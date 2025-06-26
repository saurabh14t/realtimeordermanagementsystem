"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Database, Loader2, CheckCircle } from "lucide-react"

export function DataSeeder() {
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
      status: "active",
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
      status: "active",
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
      status: "active",
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
      status: "active",
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
      status: "active",
      images: ["/placeholder.svg?height=200&width=200"],
      weight: 0.25,
      dimensions: { length: 15.0, width: 10.0, height: 5.0 },
    },
  ]

  const sampleOrders = [
    {
      customerId: "CUST-001",
      customerName: "Ravi Kumar",
      customerEmail: "ravi.kumar@gmail.com",
      customerPhone: "+91-9876543210",
      shippingAddress: {
        street: "123 MG Road, Apartment 4B",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001",
        country: "India",
      },
      items: [
        {
          productId: "PROD-1",
          name: "Chana Dal (1 kg)",
          sku: "PULSE-CHANA-1KG",
          quantity: 2,
          price: 120.0,
          total: 240.0,
        },
        {
          productId: "PROD-2",
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
    },
    {
      customerId: "CUST-002",
      customerName: "Sunita Devi",
      customerEmail: "sunita.devi@yahoo.com",
      customerPhone: "+91-9876543211",
      shippingAddress: {
        street: "456 Park Street, Block A",
        city: "Delhi",
        state: "Delhi",
        zipCode: "110001",
        country: "India",
      },
      items: [
        {
          productId: "PROD-3",
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
    },
  ]

  const addStatus = (message: string) => {
    setSeedingStatus((prev) => [...prev, message])
  }

  const seedData = async () => {
    setIsSeeding(true)
    setSeedingStatus([])

    try {
      addStatus("🌱 Starting data seeding process...")

      // Add products
      addStatus("📦 Adding sample products...")
      for (const product of sampleProducts) {
        try {
          const response = await fetch("/api/inventory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          })

          if (response.ok) {
            const result = await response.json()
            addStatus(`✅ Added product: ${result.name}`)
          } else {
            addStatus(`❌ Failed to add product: ${product.name}`)
          }
        } catch (error) {
          addStatus(`❌ Error adding product ${product.name}: ${error}`)
        }
      }

      // Add orders
      addStatus("🛒 Adding sample orders...")
      for (const order of sampleOrders) {
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
          })

          if (response.ok) {
            const result = await response.json()
            addStatus(`✅ Added order: ${result.id} for ${result.customerName}`)
          } else {
            addStatus(`❌ Failed to add order for: ${order.customerName}`)
          }
        } catch (error) {
          addStatus(`❌ Error adding order for ${order.customerName}: ${error}`)
        }
      }

      addStatus("🎉 Sample data seeding completed!")
      toast({
        title: "Data seeded successfully!",
        description: "Sample products and orders have been added to your system.",
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
          <span>Sample Data Seeder</span>
        </CardTitle>
        <CardDescription>
          Populate your system with sample grocery products and orders to get started quickly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button onClick={seedData} disabled={isSeeding} className="flex items-center space-x-2">
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            <span>{isSeeding ? "Seeding Data..." : "Seed Sample Data"}</span>
          </Button>
          <div className="text-sm text-gray-600">
            This will add {sampleProducts.length} products and {sampleOrders.length} orders
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
      </CardContent>
    </Card>
  )
}
