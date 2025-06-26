import { redis, REDIS_KEYS, cacheData, getCachedData } from "./redis"

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    productId: string
    name: string
    sku: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  fulfillmentStatus: "pending" | "picking" | "packing" | "ready_to_ship" | "shipped" | "delivered"
  assignedTo?: string
  pickingStarted?: string
  packingStarted?: string
  shippingDate?: string
}

export interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  cost: number
  stock: number
  lowStockThreshold: number
  category: string
  status: "active" | "inactive" | "discontinued"
  images: string[]
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  createdAt: string
  updatedAt: string
}

export class OrderService {
  static async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const order: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now,
    }

    // Store order in Redis
    await redis.hset(REDIS_KEYS.ORDERS, orderId, JSON.stringify(order))

    // Add to order processing queue
    await redis.lpush(`${REDIS_KEYS.ORDER_QUEUE}:pending`, orderId)

    // Update inventory
    for (const item of order.items) {
      await this.updateInventory(item.productId, -item.quantity)
    }

    // Publish real-time update
    await redis.publish(
      "order_updates",
      JSON.stringify({
        type: "order_created",
        orderId,
        order,
      }),
    )

    // Cache recent orders
    await this.cacheRecentOrders()

    return order
  }

  static async updateOrderStatus(orderId: string, status: Order["status"], notes?: string): Promise<Order | null> {
    const orderData = await redis.hget(REDIS_KEYS.ORDERS, orderId)
    if (!orderData) return null

    const order: Order = JSON.parse(orderData as string)
    order.status = status
    order.updatedAt = new Date().toISOString()
    if (notes) order.notes = notes

    // Generate tracking number for shipped orders
    if (status === "shipped" && !order.trackingNumber) {
      order.trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    }

    await redis.hset(REDIS_KEYS.ORDERS, orderId, JSON.stringify(order))

    // Move between queues based on status
    await this.moveOrderInQueue(orderId, status)

    // Publish real-time update
    await redis.publish(
      "order_updates",
      JSON.stringify({
        type: "status_updated",
        orderId,
        status,
        order,
      }),
    )

    await this.cacheRecentOrders()
    return order
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    const orderData = await redis.hget(REDIS_KEYS.ORDERS, orderId)
    return orderData ? JSON.parse(orderData as string) : null
  }

  static async getAllOrders(): Promise<Order[]> {
    // 1️⃣ Try cache first
    const cached = await getCachedData("all_orders")
    if (cached) return cached

    // 2️⃣ Safely read from Redis. hgetall can return null ➜ default to {}
    const raw = (await redis.hgetall(REDIS_KEYS.ORDERS)) || {}

    // 3️⃣ Convert the hash values into Order objects
    const orders: Order[] = Object.values(raw).map((v) => JSON.parse(v as string))

    // 4️⃣ Cache the result for 5 minutes
    await cacheData("all_orders", orders, 300)

    return orders
  }

  static async getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
    const orders = await this.getAllOrders()
    return orders.filter((order) => order.status === status)
  }

  private static async updateInventory(productId: string, quantityChange: number) {
    const productData = await redis.hget(REDIS_KEYS.INVENTORY, productId)
    if (productData) {
      const product: Product = JSON.parse(productData as string)
      product.stock += quantityChange
      product.updatedAt = new Date().toISOString()

      await redis.hset(REDIS_KEYS.INVENTORY, productId, JSON.stringify(product))

      // Check for low stock alerts
      if (product.stock <= product.lowStockThreshold) {
        await redis.lpush(
          "low_stock_alerts",
          JSON.stringify({
            productId,
            productName: product.name,
            currentStock: product.stock,
            threshold: product.lowStockThreshold,
            timestamp: new Date().toISOString(),
          }),
        )
      }
    }
  }

  private static async moveOrderInQueue(orderId: string, status: Order["status"]) {
    // Remove from all queues first
    const queues = ["pending", "processing", "shipped"]
    for (const queue of queues) {
      await redis.lrem(`${REDIS_KEYS.ORDER_QUEUE}:${queue}`, 0, orderId)
    }

    // Add to appropriate queue
    if (status !== "delivered" && status !== "cancelled") {
      await redis.lpush(`${REDIS_KEYS.ORDER_QUEUE}:${status}`, orderId)
    }
  }

  private static async cacheRecentOrders() {
    const orders = await this.getAllOrders()
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)

    await cacheData("recent_orders", recentOrders, 300)
  }

  static async updateFulfillmentStatus(
    orderId: string,
    fulfillmentStatus: Order["fulfillmentStatus"],
    assignedTo?: string,
  ): Promise<Order | null> {
    const orderData = await redis.hget(REDIS_KEYS.ORDERS, orderId)
    if (!orderData) return null

    const order: Order = JSON.parse(orderData as string)
    order.fulfillmentStatus = fulfillmentStatus
    order.updatedAt = new Date().toISOString()

    if (assignedTo) {
      order.assignedTo = assignedTo
    }

    if (fulfillmentStatus === "picking" && !order.pickingStarted) {
      order.pickingStarted = new Date().toISOString()
    }

    if (fulfillmentStatus === "packing" && !order.packingStarted) {
      order.packingStarted = new Date().toISOString()
    }

    if (fulfillmentStatus === "shipped" && !order.shippingDate) {
      order.shippingDate = new Date().toISOString()
    }

    await redis.hset(REDIS_KEYS.ORDERS, orderId, JSON.stringify(order))

    // Publish real-time update
    await redis.publish(
      "order_updates",
      JSON.stringify({
        type: "fulfillment_updated",
        orderId,
        fulfillmentStatus,
        order,
      }),
    )

    await this.cacheRecentOrders()
    return order
  }
}
