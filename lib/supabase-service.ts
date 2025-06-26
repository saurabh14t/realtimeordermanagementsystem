import { supabase } from "./supabase"
import type { Order, Product } from "./order-service"

// Check if we have a real Supabase connection
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export class SupabaseOrderService {
  static async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order | null> {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - using mock data")
      return this.createMockOrder(orderData)
    }

    try {
      // First, let's try a simple insert instead of using the function
      const orderId = crypto.randomUUID()
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          order_number: orderNumber,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          shipping_address: orderData.shippingAddress,
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          shipping: orderData.shipping,
          total: orderData.total,
          status: orderData.status,
          payment_status: orderData.paymentStatus,
          fulfillment_status: orderData.fulfillmentStatus || "pending",
          estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = orderData.items.map((item) => ({
        order_id: orderId,
        product_id: item.productId || crypto.randomUUID(),
        product_name: item.name,
        product_sku: item.sku,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      return await this.getOrder(orderId)
    } catch (error) {
      console.error("Error creating order:", error)
      return null
    }
  }

  static async getAllOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - using mock data")
      return this.getMockOrders()
    }

    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        return this.getMockOrders()
      }

      return orders?.map(this.mapOrderFromDB) || []
    } catch (error) {
      console.error("Error fetching orders:", error)
      return this.getMockOrders()
    }
  }

  static async updateOrderStatus(orderId: string, status: Order["status"], notes?: string): Promise<Order | null> {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - using mock update")
      return null
    }

    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (notes) updateData.notes = notes

      if (status === "shipped") {
        updateData.tracking_number = `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }

      const { data: order, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_price
          )
        `)
        .single()

      if (error) throw error

      return this.mapOrderFromDB(order)
    } catch (error) {
      console.error("Error updating order:", error)
      return null
    }
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    if (!isSupabaseConfigured()) {
      return null
    }

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq("id", orderId)
        .single()

      if (error) throw error

      return this.mapOrderFromDB(order)
    } catch (error) {
      console.error("Error fetching order:", error)
      return null
    }
  }

  static async getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
    if (!isSupabaseConfigured()) {
      return this.getMockOrders().filter((order) => order.status === status)
    }

    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq("status", status)
        .order("created_at", { ascending: false })

      if (error) throw error

      return orders?.map(this.mapOrderFromDB) || []
    } catch (error) {
      console.error("Error fetching orders by status:", error)
      return []
    }
  }

  // Mock data methods for when Supabase isn't configured
  private static createMockOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const now = new Date().toISOString()
    return {
      ...orderData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  private static getMockOrders(): Order[] {
    return [
      {
        id: "mock-order-1",
        customerId: "mock-customer-1",
        customerName: "Ravi Kumar",
        customerEmail: "ravi.kumar@gmail.com",
        customerPhone: "+91-9876543210",
        shippingAddress: {
          street: "A-123, Sector 15, Noida",
          city: "Noida",
          state: "Uttar Pradesh",
          zipCode: "201301",
          country: "India",
        },
        items: [
          {
            productId: "mock-product-1",
            name: "Chana Dal (1 kg)",
            sku: "PULSE-CHANA-1KG",
            quantity: 2,
            price: 120.0,
            total: 240.0,
          },
          {
            productId: "mock-product-2",
            name: "Basmati Rice (5 kg)",
            sku: "RICE-BASMATI-5KG",
            quantity: 1,
            price: 450.0,
            total: 450.0,
          },
        ],
        subtotal: 690.0,
        tax: 62.1,
        shipping: 50.0,
        total: 802.1,
        status: "pending",
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "mock-order-2",
        customerId: "mock-customer-2",
        customerName: "Sunita Devi",
        customerEmail: "sunita.devi@yahoo.com",
        customerPhone: "+91-9876543211",
        shippingAddress: {
          street: "B-456, Koramangala, Bangalore",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560034",
          country: "India",
        },
        items: [
          {
            productId: "mock-product-3",
            name: "Sunflower Oil (1 Liter)",
            sku: "OIL-SUNFLOWER-1L",
            quantity: 2,
            price: 180.0,
            total: 360.0,
          },
        ],
        subtotal: 360.0,
        tax: 32.4,
        shipping: 40.0,
        total: 432.4,
        status: "confirmed",
        paymentStatus: "paid",
        fulfillmentStatus: "picking",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  private static mapOrderFromDB(dbOrder: any): Order {
    return {
      id: dbOrder.id,
      customerId: dbOrder.customer_id || "",
      customerName: dbOrder.customer_name,
      customerEmail: dbOrder.customer_email,
      customerPhone: dbOrder.customer_phone || "",
      shippingAddress: dbOrder.shipping_address,
      items:
        dbOrder.order_items?.map((item: any) => ({
          productId: item.product_id || "",
          name: item.product_name,
          sku: item.product_sku,
          quantity: item.quantity,
          price: Number(item.unit_price),
          total: Number(item.total_price),
        })) || [],
      subtotal: Number(dbOrder.subtotal),
      tax: Number(dbOrder.tax),
      shipping: Number(dbOrder.shipping),
      total: Number(dbOrder.total),
      status: dbOrder.status,
      paymentStatus: dbOrder.payment_status,
      trackingNumber: dbOrder.tracking_number,
      notes: dbOrder.notes,
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      estimatedDelivery: dbOrder.estimated_delivery,
      fulfillmentStatus: dbOrder.fulfillment_status,
      assignedTo: dbOrder.assigned_to,
      pickingStarted: dbOrder.picking_started,
      packingStarted: dbOrder.packing_started,
      shippingDate: dbOrder.shipping_date,
    }
  }
}

export class SupabaseInventoryService {
  static async getAllProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - using mock data")
      return this.getMockProducts()
    }

    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("category", { ascending: true })

      if (error) {
        console.error("Supabase error:", error)
        return this.getMockProducts()
      }

      return products?.map(this.mapProductFromDB) || []
    } catch (error) {
      console.error("Error fetching products:", error)
      return this.getMockProducts()
    }
  }

  static async addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - cannot add product")
      return null
    }

    try {
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          price: productData.price,
          cost: productData.cost,
          stock: productData.stock,
          low_stock_threshold: productData.lowStockThreshold,
          category: productData.category,
          status: productData.status,
          images: productData.images,
          weight: productData.weight,
          dimensions: productData.dimensions,
        })
        .select()
        .single()

      if (error) throw error

      return this.mapProductFromDB(product)
    } catch (error) {
      console.error("Error adding product:", error)
      return null
    }
  }

  static async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      return null
    }

    try {
      const updateData: any = {}

      if (updates.name) updateData.name = updates.name
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.stock !== undefined) updateData.stock = updates.stock
      if (updates.status) updateData.status = updates.status

      const { data: product, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .select()
        .single()

      if (error) throw error

      return this.mapProductFromDB(product)
    } catch (error) {
      console.error("Error updating product:", error)
      return null
    }
  }

  static async bulkUpdateStock(updates: Array<{ productId: string; stock: number }>): Promise<void> {
    if (!isSupabaseConfigured()) {
      return
    }

    try {
      for (const update of updates) {
        await supabase.from("products").update({ stock: update.stock }).eq("id", update.productId)
      }
    } catch (error) {
      console.error("Error bulk updating stock:", error)
    }
  }

  static async getLowStockProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return this.getMockProducts().filter((p) => p.stock <= p.lowStockThreshold)
    }

    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .lte("stock", supabase.raw("low_stock_threshold"))
        .eq("status", "active")

      if (error) throw error

      return products?.map(this.mapProductFromDB) || []
    } catch (error) {
      console.error("Error fetching low stock products:", error)
      return []
    }
  }

  // Mock data for when Supabase isn't configured
  private static getMockProducts(): Product[] {
    return [
      {
        id: "mock-product-1",
        name: "Chana Dal (1 kg)",
        sku: "PULSE-CHANA-1KG",
        description: "Premium quality chana dal, split chickpea lentils",
        price: 120.0,
        cost: 95.0,
        stock: 150,
        lowStockThreshold: 30,
        category: "Pulses & Lentils",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200"],
        weight: 1.0,
        dimensions: { length: 20.0, width: 15.0, height: 5.0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "mock-product-2",
        name: "Basmati Rice (5 kg)",
        sku: "RICE-BASMATI-5KG",
        description: "Premium long grain basmati rice, aromatic and fluffy",
        price: 450.0,
        cost: 380.0,
        stock: 80,
        lowStockThreshold: 15,
        category: "Rice & Grains",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200"],
        weight: 5.0,
        dimensions: { length: 40.0, width: 25.0, height: 8.0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "mock-product-3",
        name: "Sunflower Oil (1 Liter)",
        sku: "OIL-SUNFLOWER-1L",
        description: "Pure sunflower cooking oil, heart healthy and light",
        price: 180.0,
        cost: 155.0,
        stock: 75,
        lowStockThreshold: 15,
        category: "Cooking Oils",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200"],
        weight: 0.9,
        dimensions: { length: 25.0, width: 8.0, height: 8.0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "mock-product-4",
        name: "Turmeric Powder (100g)",
        sku: "SPICE-TURMERIC-100G",
        description: "Pure turmeric powder, essential spice for Indian cooking",
        price: 45.0,
        cost: 32.0,
        stock: 8, // Low stock for demo
        lowStockThreshold: 50,
        category: "Spices & Condiments",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200"],
        weight: 0.1,
        dimensions: { length: 12.0, width: 8.0, height: 3.0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "mock-product-5",
        name: "Tea Leaves (250g)",
        sku: "BEV-TEA-250G",
        description: "Premium Assam tea leaves, strong and flavorful",
        price: 95.0,
        cost: 75.0,
        stock: 90,
        lowStockThreshold: 20,
        category: "Tea & Beverages",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200"],
        weight: 0.25,
        dimensions: { length: 15.0, width: 10.0, height: 5.0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  private static mapProductFromDB(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      sku: dbProduct.sku,
      description: dbProduct.description,
      price: Number(dbProduct.price),
      cost: Number(dbProduct.cost),
      stock: dbProduct.stock,
      lowStockThreshold: dbProduct.low_stock_threshold,
      category: dbProduct.category,
      status: dbProduct.status,
      images: dbProduct.images || [],
      weight: Number(dbProduct.weight),
      dimensions: dbProduct.dimensions,
      createdAt: dbProduct.created_at,
      updatedAt: dbProduct.updated_at,
    }
  }
}
