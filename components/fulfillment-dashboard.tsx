"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  Eye,
  Edit,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Truck,
  CheckCircle,
  PackageCheck,
  IndianRupee,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseOrders } from "@/hooks/use-supabase-orders"
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory"
import { ConnectionStatus } from "@/components/connection-status"
import type { Order, Product } from "@/lib/order-service"

interface FulfillmentMetrics {
  totalOrdersToFulfill: number
  pendingPickup: number
  inProgress: number
  readyToShip: number
  avgFulfillmentTime: number
  todaysFulfillments: number
}

export function FulfillmentDashboard() {
  const { orders, loading: ordersLoading, updateOrderStatus } = useSupabaseOrders()
  const { products, loading: productsLoading, addProduct, bulkUpdateStock } = useSupabaseInventory()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [fulfillmentMetrics, setFulfillmentMetrics] = useState<FulfillmentMetrics>({
    totalOrdersToFulfill: 0,
    pendingPickup: 0,
    inProgress: 0,
    readyToShip: 0,
    avgFulfillmentTime: 0,
    todaysFulfillments: 0,
  })
  const { toast } = useToast()

  // Calculate fulfillment metrics
  useEffect(() => {
    if (orders.length > 0) {
      const ordersToFulfill = orders.filter((order) => ["pending", "confirmed", "processing"].includes(order.status))

      const metrics: FulfillmentMetrics = {
        totalOrdersToFulfill: ordersToFulfill.length,
        pendingPickup: orders.filter((order) => order.status === "pending").length,
        inProgress: orders.filter((order) => order.status === "processing").length,
        readyToShip: orders.filter((order) => order.status === "confirmed").length,
        avgFulfillmentTime: 2.5, // Mock data - hours
        todaysFulfillments: orders.filter((order) => {
          const today = new Date().toDateString()
          return new Date(order.updatedAt).toDateString() === today && order.status === "shipped"
        }).length,
      }

      setFulfillmentMetrics(metrics)
    }
  }, [orders])

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"], notes?: string) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(orderId, newStatus, notes)
      toast({
        title: "Order status updated",
        description: `Order ${orderId.slice(0, 8)}... moved to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
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
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <PackageCheck className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getFulfillmentProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "confirmed":
        return 50
      case "processing":
        return 75
      case "shipped":
        return 90
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const getInventoryStatusColor = (product: Product) => {
    if (product.stock === 0) return "bg-red-100 text-red-800"
    if (product.stock <= product.lowStockThreshold) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getInventoryStatus = (product: Product) => {
    if (product.stock === 0) return "Out of Stock"
    if (product.stock <= product.lowStockThreshold) return "Low Stock"
    return "In Stock"
  }

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate total revenue in INR
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const lowStockItems = products.filter((product) => product.stock <= product.lowStockThreshold).length

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Fulfillment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders to Fulfill</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fulfillmentMetrics.totalOrdersToFulfill}</div>
            <p className="text-xs text-muted-foreground">Pending customer orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fulfillmentMetrics.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fulfillmentMetrics.todaysFulfillments}</div>
            <p className="text-xs text-muted-foreground">Orders shipped today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All-time revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="fulfillment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fulfillment">Order Fulfillment</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="staples">Staples Catalog</TabsTrigger>
          <TabsTrigger value="analytics">Fulfillment Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="fulfillment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Fulfillment Queue</CardTitle>
                  <CardDescription>Track and process customer orders for delivery</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Queue
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Total (INR)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((order) => !["delivered", "cancelled"].includes(order.status))
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            <div className="text-xs text-gray-500">
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.name)
                                .join(", ")}
                              {order.items.length > 2 && "..."}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={getFulfillmentProgress(order.status)} className="h-2" />
                            <div className="text-xs text-gray-500 mt-1">{getFulfillmentProgress(order.status)}%</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatINR(order.total)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Fulfillment Details - {order.id}</DialogTitle>
                                  <DialogDescription>Process and track this customer order</DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="font-semibold mb-2">Customer Information</h4>
                                        <div className="space-y-1">
                                          <p>
                                            <strong>Name:</strong> {selectedOrder.customerName}
                                          </p>
                                          <p>
                                            <strong>Email:</strong> {selectedOrder.customerEmail}
                                          </p>
                                          <p>
                                            <strong>Phone:</strong> {selectedOrder.customerPhone}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold mb-2">Delivery Address</h4>
                                        <div className="space-y-1">
                                          <p>{selectedOrder.shippingAddress.street}</p>
                                          <p>
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                          </p>
                                          <p>{selectedOrder.shippingAddress.zipCode}</p>
                                          <p>{selectedOrder.shippingAddress.country}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Items to Fulfill</h4>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedOrder.items.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{item.name}</TableCell>
                                              <TableCell>{item.sku}</TableCell>
                                              <TableCell>{item.quantity}</TableCell>
                                              <TableCell>{formatINR(item.price)}</TableCell>
                                              <TableCell>{formatINR(item.total)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                      <div className="mt-4 space-y-2 text-right">
                                        <p>Subtotal: {formatINR(selectedOrder.subtotal)}</p>
                                        <p>Tax: {formatINR(selectedOrder.tax)}</p>
                                        <p>Shipping: {formatINR(selectedOrder.shipping)}</p>
                                        <p className="font-bold text-lg">Total: {formatINR(selectedOrder.total)}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Update Fulfillment Status</Label>
                                        <Select
                                          value={selectedOrder.status}
                                          onValueChange={(value) =>
                                            handleStatusUpdate(selectedOrder.id, value as Order["status"])
                                          }
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending Pickup</SelectItem>
                                            <SelectItem value="confirmed">Ready to Process</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Tracking Number</Label>
                                        <Input
                                          value={selectedOrder.trackingNumber || ""}
                                          placeholder="Enter tracking number"
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Fulfillment Notes</Label>
                                      <Textarea
                                        value={selectedOrder.notes || ""}
                                        placeholder="Add notes about fulfillment process..."
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusUpdate(order.id, value as Order["status"])}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Monitor stock levels for order fulfillment</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Stock
                  </Button>
                  <Button variant="outline" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Bulk Update
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price (INR)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{product.stock} units</span>
                          {product.stock <= product.lowStockThreshold && (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatINR(product.price)}</TableCell>
                      <TableCell>
                        <Badge className={getInventoryStatusColor(product)}>{getInventoryStatus(product)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Input type="number" placeholder="New stock" className="w-24" />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grocery Staples Catalog</CardTitle>
              <CardDescription>Essential grocery items for your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-green-600">{formatINR(product.price)}</span>
                      <Badge className={getInventoryStatusColor(product)}>{getInventoryStatus(product)}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>SKU: {product.sku}</p>
                      <p>Stock: {product.stock} units</p>
                      <p>Category: {product.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fulfillment Performance</CardTitle>
                <CardDescription>Track your order processing efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Fulfillment Time</span>
                    <span className="font-bold">{fulfillmentMetrics.avgFulfillmentTime} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Orders Processed Today</span>
                    <span className="font-bold">{fulfillmentMetrics.todaysFulfillments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Orders</span>
                    <span className="font-bold">{fulfillmentMetrics.pendingPickup}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-bold">{formatINR(totalRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .filter((product) => product.stock <= product.lowStockThreshold)
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.stock} units remaining</p>
                        </div>
                        <Badge className={getInventoryStatusColor(product)}>{getInventoryStatus(product)}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
