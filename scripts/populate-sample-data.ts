// This script populates sample data via API calls
// Run this in the browser console or as a Node.js script

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
    tax: 62.1, // 9% GST
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
    tax: 32.4, // 9% GST
    shipping: 40.0,
    total: 432.4,
    status: "confirmed",
    paymentStatus: "paid",
    fulfillmentStatus: "picking",
  },
]

async function populateSampleData() {
  try {
    console.log("🌱 Populating sample products...")

    // Add products
    for (const product of sampleProducts) {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Added product: ${result.name}`)
      } else {
        console.error(`❌ Failed to add product: ${product.name}`)
      }
    }

    console.log("📦 Populating sample orders...")

    // Add orders
    for (const order of sampleOrders) {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Added order: ${result.id} for ${result.customerName}`)
      } else {
        console.error(`❌ Failed to add order for: ${order.customerName}`)
      }
    }

    console.log("🎉 Sample data populated successfully!")
  } catch (error) {
    console.error("❌ Error populating sample data:", error)
  }
}

// Export for use in browser console or Node.js
if (typeof window !== "undefined") {
  // Browser environment
  ;(window as any).populateSampleData = populateSampleData
  console.log("Run populateSampleData() in the console to populate sample data")
} else {
  // Node.js environment
  populateSampleData()
}
