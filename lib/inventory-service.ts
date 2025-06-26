import { redis, REDIS_KEYS, cacheData, getCachedData } from "./redis"
import type { Product } from "./order-service"

export class InventoryService {
  static async addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const productId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const product: Product = {
      ...productData,
      id: productId,
      createdAt: now,
      updatedAt: now,
    }

    await redis.hset(REDIS_KEYS.INVENTORY, productId, JSON.stringify(product))
    await this.invalidateProductCache()

    return product
  }

  static async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const productData = await redis.hget(REDIS_KEYS.INVENTORY, productId)
    if (!productData) return null

    const product: Product = JSON.parse(productData as string)
    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await redis.hset(REDIS_KEYS.INVENTORY, productId, JSON.stringify(updatedProduct))
    await this.invalidateProductCache()

    return updatedProduct
  }

  static async getProduct(productId: string): Promise<Product | null> {
    const productData = await redis.hget(REDIS_KEYS.INVENTORY, productId)
    return productData ? JSON.parse(productData as string) : null
  }

  static async getAllProducts(): Promise<Product[]> {
    const cached = await getCachedData("all_products")
    if (cached) return cached

    const productData = await redis.hgetall(REDIS_KEYS.INVENTORY)
    const products = Object.values(productData).map((data) => JSON.parse(data as string))

    await cacheData("all_products", products, 600) // Cache for 10 minutes
    return products
  }

  static async getActiveProducts(): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter((product) => product.status === "active")
  }

  static async getLowStockProducts(): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter((product) => product.stock <= product.lowStockThreshold)
  }

  static async updateStock(productId: string, newStock: number): Promise<Product | null> {
    return this.updateProduct(productId, { stock: newStock })
  }

  static async bulkUpdateStock(updates: Array<{ productId: string; stock: number }>): Promise<void> {
    const pipeline = redis.pipeline()

    for (const update of updates) {
      const productData = await redis.hget(REDIS_KEYS.INVENTORY, update.productId)
      if (productData) {
        const product: Product = JSON.parse(productData as string)
        product.stock = update.stock
        product.updatedAt = new Date().toISOString()
        pipeline.hset(REDIS_KEYS.INVENTORY, update.productId, JSON.stringify(product))
      }
    }

    await pipeline.exec()
    await this.invalidateProductCache()
  }

  private static async invalidateProductCache() {
    await redis.del("all_products", "active_products")
  }
}
