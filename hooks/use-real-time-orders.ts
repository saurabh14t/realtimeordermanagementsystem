"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/lib/order-service"

export function useRealTimeOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial orders
    fetchOrders()

    // Set up polling for real-time updates (in production, use WebSocket)
    const interval = setInterval(fetchOrders, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"], notes?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))
        return updatedOrder
      }
    } catch (error) {
      console.error("Error updating order:", error)
      throw error
    }
  }

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders,
  }
}
