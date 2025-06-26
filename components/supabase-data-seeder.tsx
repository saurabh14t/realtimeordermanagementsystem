"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Database, Loader2, CheckCircle } from "lucide-react"
import { SupabaseInventoryService, SupabaseOrderService } from "@/lib/supabase-service"

export function SupabaseDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedingStatus, setSeedingStatus] = useState<string[]>([])
  const { toast } = useToast()

  const sampleProducts = [
    {
      name: "Chana Dal (1 kg)",
      sku: "PULSE-CHANA-1KG",
      description: "Premium quality chana dal, split chickpea lentils",
      price: 120.0,
      cost: 95.0,
      stock: 150,
      lowStockThreshold: 30,
      category: "Pulses & Lentils",
      status: "active" as const,
      images: ["/placeholder.svg?height=200&width=200"],
      weight: 1.0,
      dimensions: { length: 20.0, width: 15.0, height: 5.0 },
    },
    {
      name: "Basmati Rice (5 kg)",
      sku: "RICE-BASMATI-5KG",
      description: "Premium long grain basmati rice, aromatic and fluffy",
      price: 450.0,
      cost: 380.0,
      stock: 80,
      lowStockThreshold: 15,
      category: "Rice & Grains",
      status: "active" as const,
      images: ["/placeholder.svg?height=200&width=200"],
      weight: 5.0,
      dimensions: { length: 40.0, width: 25.0, height: 8.0 },
    },
    {
      name: "Sunflower Oil (1 Liter)",
      sku: "OIL-SUNFLOWER-1L",
      description: "Pure sunflower cooking oil, heart healthy and light",
      price: 180.0,
      cost: 155.0,
      stock: 75,
      lowStockThreshold: 15,
      category: "Cooking Oils",
      status: "active" as const,
      images: ["/placeholder.svg?height=200&width=200"],
      weight: 0.9,
      dimensions: { length: 25.0, width: 8.0, height: 8.0 },
    },
    {
      name: "Turmeric Powder (100g)",
      sku: "SPICE-TURMERIC-100G",
      description: "Pure turmeric powder, essential spice for Indian cooking",
      price: 45.0,
      cost: 32.0,
      stock: 200,
      lowStockThreshold: 50,
      category: "Spices & Condiments",
      status: "active" as const,
      images: ["/placeholder.svg?height=200&width=200"],
      weight: 0.1,
      dimensions: { length: 12.0, width: 8.0, height: 3.0 },
    },
    {
      name: "Tea Leaves (250g)",
      sku: "BEV-TEA-250G",
      description: "Premium Assam tea leaves, strong and flavorful",
      price: 95.0,
      cost: 75.0,
      stock: 90,
      lowStockThreshold: 20,
      category: "Tea & Beverages",
      status: "active" as const,
      images: ["/placeholder.svg?height=200&width=200"],
      weight: 0.25,
      dimensions: { length: 15.0, width: 10.0, height: 5.0 },
    },
  ]

  const addStatus = (message: string) => {
    setSeedingStatus((prev) => [...prev, message])
  }

  const seedData = async () => {
    setIsSeeding(true)
    setSeedingStatus([])

    try {
      addStatus("🌱 Starting Supabase data seeding process...")

      // Add products first
      addStatus("📦 Adding sample products...")
      const createdProducts = []

      for (const product of sampleProducts) {
        try {
          const result = await SupabaseInventoryService.addProduct(product)
          if (result) {
            createdProducts.push(result)
            addStatus(`✅ Added product: ${result.name}`)
          } else {
            addStatus(`❌ Failed to add product: ${product.name}`)
          }
        } catch (error) {
          addStatus(`❌ Error adding product ${product.name}: ${error}`)
        }
      }

      // Create sample orders if we have products
      if (createdProducts.length > 0) {
        addStatus("🛒 Adding sample orders...")

        const sampleOrders = [
          {
            customerId: "",
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
                productId: createdProducts[0].id, // Chana Dal
                name: createdProducts[0].name,
                sku: createdProducts[0].sku,
                quantity: 2,
                price: createdProducts[0].price,
                total: createdProducts[0].price * 2,
              },
              {
                productId: createdProducts[1].id, // Basmati Rice
                name: createdProducts[1].name,
                sku: createdProducts[1].sku,
                quantity: 1,
                price: createdProducts[1].price,
                total: createdProducts[1].price * 1,
              },
            ],
            subtotal: 690.0,
            tax: 62.1,
            shipping: 50.0,
            total: 802.1,
            status: "pending" as const,
            paymentStatus: "paid" as const,
            fulfillmentStatus: "pending" as const,
          },
          {
            customerId: "",
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
                productId: createdProducts[2].id, // Sunflower Oil
                name: createdProducts[2].name,
                sku: createdProducts[2].sku,
                quantity: 2,
                price: createdProducts[2].price,
                total: createdProducts[2].price * 2,
              },
            ],
            subtotal: 360.0,
            tax: 32.4,
            shipping: 40.0,
            total: 432.4,
            status: "confirmed" as const,
            paymentStatus: "paid" as const,
            fulfillmentStatus: "picking" as const,
          },
        ]

        for (const order of sampleOrders) {
          try {
            const result = await SupabaseOrderService.createOrder(order)
            if (result) {
              addStatus(`✅ Added order: ${result.id} for ${result.customerName}`)
            } else {
              addStatus(`❌ Failed to add order for: ${order.customerName}`)
            }
          } catch (error) {
            addStatus(`❌ Error adding order for ${order.customerName}: ${error}`)
          }
        }
      }

      addStatus("🎉 Supabase data seeding completed!")
      toast({
        title: "Data seeded successfully!",
        description: "Sample products and orders have been added to your Supabase database.",
      })
    } catch (error) {
      addStatus(`❌ Error during seeding: ${error}`)
      toast({
        title: "Seeding failed",
        description: "There was an error seeding the sample data.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Supabase Data Seeder</span>
        </CardTitle>
        <CardDescription>
          Populate your Supabase database with sample grocery products and orders to get started quickly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button onClick={seedData} disabled={isSeeding} className="flex items-center space-x-2">
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            <span>{isSeeding ? "Seeding Data..." : "Seed Sample Data"}</span>
          </Button>
          <div className="text-sm text-gray-600">
            This will add {sampleProducts.length} products and 2 sample orders
          </div>
        </div>

        {seedingStatus.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h4 className="font-semibold mb-2">Seeding Progress:</h4>
            <div className="space-y-1 text-sm font-mono">
              {seedingStatus.map((status, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {status.includes("✅") && <CheckCircle className="h-3 w-3 text-green-500" />}
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">📋 Prerequisites:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Supabase project created and connected</li>
            <li>Database tables created (run SQL scripts first)</li>
            <li>Environment variables configured</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
