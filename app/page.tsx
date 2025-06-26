"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FulfillmentDashboard } from "@/components/fulfillment-dashboard"
import { OrderTracking } from "@/components/order-tracking"
import { Package, Users, Building2 } from "lucide-react"
import { SupabaseDataSeeder } from "@/components/supabase-data-seeder"

export default function HomePage() {
  const [activeView, setActiveView] = useState<"admin" | "tracking">("admin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Fulfillment Center</h1>
                <p className="text-sm text-gray-600">Track & Fulfill Customer Orders</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Button
                variant={activeView === "admin" ? "default" : "ghost"}
                onClick={() => setActiveView("admin")}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Button>
              <Button
                variant={activeView === "tracking" ? "default" : "ghost"}
                onClick={() => setActiveView("tracking")}
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Order Tracking</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "admin" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Organization Dashboard</h2>
              <p className="text-gray-600">Supabase-powered order fulfillment and inventory management system</p>
            </div>

            {/* Add Data Seeder */}
            <div className="mb-8">
              <SupabaseDataSeeder />
            </div>

            <FulfillmentDashboard />
          </div>
        )}

        {activeView === "tracking" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h2>
              <p className="text-gray-600">Track your orders in real-time</p>
            </div>
            <OrderTracking />
          </div>
        )}
      </main>
    </div>
  )
}
