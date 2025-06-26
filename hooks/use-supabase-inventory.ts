"use client"

import { useState, useEffect } from "react"
import { SupabaseInventoryService } from "@/lib/supabase-service"
import type { Product } from "@/lib/order-service"

export function useSupabaseInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await SupabaseInventoryService.getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newProduct = await SupabaseInventoryService.addProduct(productData)
      if (newProduct) {
        setProducts((prev) => [...prev, newProduct])
        return newProduct
      }
    } catch (error) {
      console.error("Error adding product:", error)
      throw error
    }
  }

  const bulkUpdateStock = async (updates: Array<{ productId: string; stock: number }>) => {
    try {
      await SupabaseInventoryService.bulkUpdateStock(updates)
      await fetchProducts() // Refresh the list
    } catch (error) {
      console.error("Error bulk updating stock:", error)
      throw error
    }
  }

  return {
    products,
    loading,
    addProduct,
    bulkUpdateStock,
    refetch: fetchProducts,
  }
}
