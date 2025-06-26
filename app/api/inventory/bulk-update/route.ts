import { type NextRequest, NextResponse } from "next/server"
import { InventoryService } from "@/lib/inventory-service"

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json()
    await InventoryService.bulkUpdateStock(updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error bulk updating inventory:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
