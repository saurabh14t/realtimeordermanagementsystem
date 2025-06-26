"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Database, ExternalLink, CheckCircle, AlertCircle, Copy, Play, FileText, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SupabaseSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const { toast } = useToast()

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNumber)
    toast({
      title: "Copied to clipboard",
      description: "SQL script copied successfully",
    })
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const sqlScripts = [
    {
      name: "01-create-supabase-schema.sql",
      description: "Creates all database tables and indexes",
      priority: "high",
    },
    {
      name: "02-create-supabase-functions.sql",
      description: "Creates database functions for better performance",
      priority: "high",
    },
    {
      name: "06-insert-comprehensive-sample-data.sql",
      description: "Inserts comprehensive sample data (products, customers, orders)",
      priority: "medium",
    },
  ]

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-blue-600" />
          <span>Supabase Setup Guide</span>
        </CardTitle>
        <CardDescription>
          Complete setup instructions to get your Real-time Order Tracking System running with Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Create Supabase Project */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">Step 1</Badge>
            <h3 className="text-lg font-semibold">Create Supabase Project</h3>
          </div>
          <div className="pl-4 space-y-3">
            <p className="text-gray-600">First, you need to create a new Supabase project to host your database.</p>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Go to Supabase Dashboard</span>
              </Button>
              <div className="text-sm text-gray-500">
                Create a new project → Choose a name → Select region → Set password
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Step 2: Add Supabase Integration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">Step 2</Badge>
            <h3 className="text-lg font-semibold">Add Supabase Integration to v0</h3>
          </div>
          <div className="pl-4 space-y-3">
            <p className="text-gray-600">
              Add the Supabase integration to your v0 project to automatically configure environment variables.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">In your v0 project:</p>
                  <ol className="list-decimal list-inside text-sm text-blue-800 mt-2 space-y-1">
                    <li>Click "Add Integration" in the top menu</li>
                    <li>Select "Supabase" from the list</li>
                    <li>Connect your Supabase project</li>
                    <li>Environment variables will be automatically configured</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Step 3: Run SQL Scripts */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">Step 3</Badge>
            <h3 className="text-lg font-semibold">Run SQL Scripts in Supabase</h3>
          </div>
          <div className="pl-4 space-y-4">
            <p className="text-gray-600">
              Execute these SQL scripts in your Supabase SQL Editor in the exact order shown below:
            </p>

            {sqlScripts.map((script, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{script.name}</span>
                    <Badge
                      className={
                        script.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {script.priority === "high" ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `-- Run this script in Supabase SQL Editor\n-- ${script.name}\n\n-- Copy the content from the ${script.name} file in your project`,
                        index,
                      )
                    }
                    className="flex items-center space-x-2"
                  >
                    {copiedStep === index ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copiedStep === index ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{script.description}</p>
              </div>
            ))}

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Important Notes:</p>
                  <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
                    <li>Run scripts in the exact order shown above</li>
                    <li>Wait for each script to complete before running the next one</li>
                    <li>Check for any errors in the Supabase SQL Editor</li>
                    <li>The comprehensive sample data script will create realistic test data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Step 4: Verify Setup */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">Step 4</Badge>
            <h3 className="text-lg font-semibold">Verify Setup</h3>
          </div>
          <div className="pl-4 space-y-3">
            <p className="text-gray-600">After running all scripts, verify your setup is working correctly.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">✅ What You Should See:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Connection status shows "Connected"</li>
                  <li>• Products appear in inventory</li>
                  <li>• Sample orders in the dashboard</li>
                  <li>• Real-time updates working</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">❌ Troubleshooting:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Check environment variables</li>
                  <li>• Verify SQL scripts ran successfully</li>
                  <li>• Check Supabase project status</li>
                  <li>• Review browser console for errors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Step 5: Start Using */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">Step 5</Badge>
            <h3 className="text-lg font-semibold">Start Using the System</h3>
          </div>
          <div className="pl-4 space-y-3">
            <p className="text-gray-600">
              Your Real-time Order Tracking System is now ready to use with live Supabase data!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium">View Orders</h4>
                <p className="text-sm text-gray-600">Check the fulfillment dashboard</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium">Manage Inventory</h4>
                <p className="text-sm text-gray-600">Update stock levels</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Play className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-medium">Track Orders</h4>
                <p className="text-sm text-gray-600">Use the order tracking feature</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
