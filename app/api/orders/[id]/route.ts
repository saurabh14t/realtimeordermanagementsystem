import { type NextRequest, NextResponse } from "next/server"
import { SupabaseOrderService } from "@/lib/supabase-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await SupabaseOrderService.getOrder(params.id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, notes } = await request.json()
    const order = await SupabaseOrderService.updateOrderStatus(params.id, status, notes)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
