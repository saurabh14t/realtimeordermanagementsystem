import { Redis } from "@upstash/redis"

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error("Redis credentials not found. Please add Upstash integration.")
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

// Redis keys
export const REDIS_KEYS = {
  ORDERS: "orders",
  INVENTORY: "inventory",
  CUSTOMERS: "customers",
  ORDER_QUEUE: "order_queue",
  ANALYTICS: "analytics",
  NOTIFICATIONS: "notifications",
  SESSIONS: "sessions",
} as const

// Helper functions
export async function cacheData(key: string, data: any, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(data))
}

export async function getCachedData(key: string) {
  const data = await redis.get(key)
  return data ? JSON.parse(data as string) : null
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
