"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const { data, error } = await supabase.from("products").select("count").limit(1)
      setIsConnected(!error)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const hasEnvVars = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Connection Status</span>
        </CardTitle>
        <CardDescription>Current status of your Supabase database connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Environment Variables:</span>
              {hasEnvVars ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Missing
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Database:</span>
              {isConnected === null ? (
                <Badge className="bg-gray-100 text-gray-800">Checking...</Badge>
              ) : isConnected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={checkConnection} disabled={isChecking} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            Check Connection
          </Button>
        </div>

        {!hasEnvVars && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong> Add Supabase integration to connect to your database. Currently showing
              mock data.
            </p>
          </div>
        )}

        {hasEnvVars && !isConnected && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Connection Failed:</strong> Check your Supabase credentials and ensure your database tables are
              created.
            </p>
          </div>
        )}

        {isConnected && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Connected:</strong> Successfully connected to your Supabase database.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
