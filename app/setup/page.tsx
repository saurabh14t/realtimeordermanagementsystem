"use client"

import { SupabaseSetupGuide } from "@/components/supabase-setup-guide"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Setup Your Real-time Order Tracking System</h1>
          <p className="text-xl text-gray-600">
            Follow these steps to connect your Supabase database and populate it with sample data
          </p>
        </div>

        <div className="flex justify-center">
          <SupabaseSetupGuide />
        </div>
      </div>
    </div>
  )
}
