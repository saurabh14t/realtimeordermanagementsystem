"use client"

import { useState, useEffect } from "react"
import { SupabaseOrderService } from "@/lib/supabase-service"
import type { Order } from "@/lib/order-service"

export function useSupabaseOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await SupabaseOrderService.getAllOrders()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"], notes?: string) => {
    try {
      const updatedOrder = await SupabaseOrderService.updateOrderStatus(orderId, status, notes)
      if (updatedOrder) {
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
