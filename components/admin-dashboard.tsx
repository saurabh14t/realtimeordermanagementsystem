"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, ShoppingCart, TrendingUp, Eye, Edit, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{ name: string; quantity: number; price: number }>
  totalAmount: number
  orderDate: string
  lastUpdated: string
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  stock: number
  price: number
  lowStockThreshold: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

const mockOrders: Order[] = [
  {
    id: "ORD-1703123456",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    status: "shipped",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 99.99 },
      { name: "USB-C Hub", quantity: 1, price: 79.99 },
    ],
    totalAmount: 179.98,
    orderDate: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-16T09:15:00Z",
  },
  {
    id: "ORD-1703123457",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "processing",
    items: [{ name: "Smart Watch", quantity: 1, price: 199.99 }],
    totalAmount: 199.99,
    orderDate: "2024-01-16T15:45:00Z",
    lastUpdated: "2024-01-17T08:30:00Z",
  },
  {
    id: "ORD-1703123458",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    status: "pending",
    items: [{ name: "Laptop Stand", quantity: 2, price: 49.99 }],
    totalAmount: 99.98,
    orderDate: "2024-01-17T12:20:00Z",
    lastUpdated: "2024-01-17T12:20:00Z",
  },
]

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-001",
    stock: 45,
    price: 99.99,
    lowStockThreshold: 10,
    status: "in_stock",
  },
  {
    id: "2",
    name: "Smart Watch",
    sku: "SW-002",
    stock: 8,
    price: 199.99,
    lowStockThreshold: 10,
    status: "low_stock",
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    stock: 0,
    price: 49.99,
    lowStockThreshold: 5,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: "USB-C Hub",
    sku: "UCH-004",
    stock: 23,
    price: 79.99,
    lowStockThreshold: 15,
    status: "in_stock",
  },
]

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, lastUpdated: new Date().toISOString() } : order,
        ),
      )

      toast({
        title: "Order updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      })

      setIsUpdating(false)
    }, 1000)
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

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInventoryIcon = (status: string) => {
    switch (status) {
      case "in_stock":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "low_stock":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "out_of_stock":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const lowStockItems = inventory.filter((item) => item.status === "low_stock" || item.status === "out_of_stock").length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+3 new orders today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders Management</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage and track all customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details - {order.id}</DialogTitle>
                                <DialogDescription>Complete order information and status management</DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Customer</Label>
                                      <p className="font-medium">{selectedOrder.customerName}</p>
                                      <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div>
                                      <Label>Current Status</Label>
                                      <div className="mt-1">
                                        <Badge className={getStatusColor(selectedOrder.status)}>
                                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Update Status</Label>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) =>
                                        updateOrderStatus(selectedOrder.id, value as Order["status"])
                                      }
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label>Order Items</Label>
                                    <div className="mt-2 space-y-2">
                                      {selectedOrder.items.map((item, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                        >
                                          <div>
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                                          </div>
                                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                      ))}
                                      <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                                        <span>Total:</span>
                                        <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
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
                              <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Monitor stock levels and manage product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getInventoryIcon(item.status)}
                          <span>{item.stock} units</span>
                        </div>
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getInventoryStatusColor(item.status)}>
                          {item.status.replace("_", " ").charAt(0).toUpperCase() +
                            item.status.replace("_", " ").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Update Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["pending", "processing", "shipped", "delivered"].map((status) => {
                    const count = orders.filter((order) => order.status === status).length
                    const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                          <span>{count} orders</span>
                        </div>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory
                    .filter((item) => item.status !== "in_stock")
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getInventoryIcon(item.status)}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.stock} units remaining</p>
                          </div>
                        </div>
                        <Badge className={getInventoryStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
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
