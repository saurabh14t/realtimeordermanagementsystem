"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

interface OrderStatus {
  id: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered"
  customerName: string
  items: Array<{ name: string; quantity: number; price: number }>
  totalAmount: number
  orderDate: string
  estimatedDelivery: string
  trackingNumber?: string
  currentLocation?: string
  timeline: Array<{
    status: string
    timestamp: string
    description: string
    completed: boolean
  }>
}

const mockOrders: OrderStatus[] = [
  {
    id: "ORD-1703123456",
    status: "shipped",
    customerName: "John Doe",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 99.99 * 80 },
      { name: "USB-C Hub", quantity: 1, price: 79.99 * 80 },
    ],
    totalAmount: 179.98 * 80,
    orderDate: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-18T18:00:00Z",
    trackingNumber: "TRK123456789",
    currentLocation: "Distribution Center - Chicago",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "2024-01-15T10:30:00Z",
        description: "Order received and confirmed",
        completed: true,
      },
      {
        status: "Processing",
        timestamp: "2024-01-15T14:20:00Z",
        description: "Items picked and packed",
        completed: true,
      },
      {
        status: "Shipped",
        timestamp: "2024-01-16T09:15:00Z",
        description: "Package dispatched from warehouse",
        completed: true,
      },
      {
        status: "In Transit",
        timestamp: "2024-01-17T12:00:00Z",
        description: "Package in transit to destination",
        completed: false,
      },
      { status: "Delivered", timestamp: "", description: "Package delivered to customer", completed: false },
    ],
  },
  {
    id: "ORD-1703123457",
    status: "processing",
    customerName: "Jane Smith",
    items: [{ name: "Smart Watch", quantity: 1, price: 199.99 * 80 }],
    totalAmount: 199.99 * 80,
    orderDate: "2024-01-16T15:45:00Z",
    estimatedDelivery: "2024-01-20T18:00:00Z",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "2024-01-16T15:45:00Z",
        description: "Order received and confirmed",
        completed: true,
      },
      {
        status: "Processing",
        timestamp: "2024-01-17T08:30:00Z",
        description: "Items being picked and packed",
        completed: false,
      },
      { status: "Shipped", timestamp: "", description: "Package will be dispatched", completed: false },
      { status: "Delivered", timestamp: "", description: "Package will be delivered", completed: false },
    ],
  },
]

export function OrderTracking() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const searchOrder = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter a valid order ID to track your order.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders.find((o) => o.id === orderId.trim())
      if (foundOrder) {
        setOrder(foundOrder)
        toast({
          title: "Order found!",
          description: `Tracking information for order ${orderId}`,
        })
      } else {
        toast({
          title: "Order not found",
          description: "Please check your order ID and try again.",
          variant: "destructive",
        })
        setOrder(null)
      }
      setIsSearching(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
      case "in transit":
        return <Truck className="h-5 w-5 text-orange-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateProgress = (timeline: OrderStatus["timeline"]) => {
    const completed = timeline.filter((item) => item.completed).length
    return (completed / timeline.length) * 100
  }

  useEffect(() => {
    if (order) {
      setProgress(calculateProgress(order.timeline))
    }
  }, [order])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>Enter your order ID to get real-time tracking information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORD-1703123456"
                onKeyPress={(e) => e.key === "Enter" && searchOrder()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchOrder} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Track Order"}
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Try these sample order IDs:</p>
            <div className="flex space-x-4 mt-2">
              <Button variant="outline" size="sm" onClick={() => setOrderId("ORD-1703123456")}>
                ORD-1703123456
              </Button>
              <Button variant="outline" size="sm" onClick={() => setOrderId("ORD-1703123457")}>
                ORD-1703123457
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order {order.id}</CardTitle>
                  <CardDescription>Placed on {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Customer</h4>
                  <p className="text-gray-600">{order.customerName}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Total Amount</h4>
                  <p className="text-2xl font-bold text-green-600">{formatINR(order.totalAmount)}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Estimated Delivery</h4>
                  <p className="text-gray-600">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Tracking Number: {order.trackingNumber}</p>
                      {order.currentLocation && (
                        <p className="text-sm text-gray-600">Current Location: {order.currentLocation}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4">
                  {order.timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-semibold ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                              {item.status}
                            </h4>
                            <p className={`text-sm ${item.completed ? "text-gray-600" : "text-gray-400"}`}>
                              {item.description}
                            </p>
                          </div>
                          {item.timestamp && (
                            <span className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatINR(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
