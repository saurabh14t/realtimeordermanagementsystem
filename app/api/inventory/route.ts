import { type NextRequest, NextResponse } from "next/server"
import { SupabaseInventoryService } from "@/lib/supabase-service"

export async function GET() {
  try {
    const products = await SupabaseInventoryService.getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    const product = await SupabaseInventoryService.addProduct(productData)

    if (!product) {
      return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error adding product:", error)
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}
