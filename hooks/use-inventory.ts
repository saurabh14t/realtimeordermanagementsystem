"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/order-service"

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/inventory")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const newProduct = await response.json()
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
      const response = await fetch("/api/inventory/bulk-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchProducts() // Refresh the list
      }
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
