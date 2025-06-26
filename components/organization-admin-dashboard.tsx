"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  AlertCircle,
  Plus,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRealTimeOrders } from "@/hooks/use-real-time-orders"
import { useInventory } from "@/hooks/use-inventory"
import type { Order, Product } from "@/lib/order-service"

export function OrganizationAdminDashboard() {
  const { orders, loading: ordersLoading, updateOrderStatus } = useRealTimeOrders()
  const { products, loading: productsLoading, addProduct, bulkUpdateStock } = useInventory()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    sku: "",
    description: "",
    price: 0,
    cost: 0,
    stock: 0,
    lowStockThreshold: 10,
    category: "",
    status: "active",
    images: [],
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  })
  const [bulkStockUpdates, setBulkStockUpdates] = useState<Array<{ productId: string; stock: number }>>([])
  const { toast } = useToast()

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"], notes?: string) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(orderId, newStatus, notes)
      toast({
        title: "Order updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
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

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct as Omit<Product, "id" | "createdAt" | "updatedAt">)
      setNewProduct({
        name: "",
        sku: "",
        description: "",
        price: 0,
        cost: 0,
        stock: 0,
        lowStockThreshold: 10,
        category: "",
        status: "active",
        images: [],
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
      })
      toast({
        title: "Product added",
        description: "New product has been added to inventory",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleBulkStockUpdate = async () => {
    try {
      await bulkUpdateStock(bulkStockUpdates)
      setBulkStockUpdates([])
      toast({
        title: "Stock updated",
        description: "Bulk stock update completed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      })
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

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Real-time revenue tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Cached with Redis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Auto-tracked inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Control</TabsTrigger>
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="analytics">Business Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order Management System</CardTitle>
                  <CardDescription>Real-time order processing with Redis backend</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Orders
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
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
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
                      <TableCell>
                        <Badge className={getStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                                <DialogTitle>Order Details - {order.id}</DialogTitle>
                                <DialogDescription>Complete order information and management</DialogDescription>
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
                                      <h4 className="font-semibold mb-2">Shipping Address</h4>
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
                                    <h4 className="font-semibold mb-2">Order Items</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Product</TableHead>
                                          <TableHead>SKU</TableHead>
                                          <TableHead>Qty</TableHead>
                                          <TableHead>Price</TableHead>
                                          <TableHead>Total</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedOrder.items.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${item.price.toFixed(2)}</TableCell>
                                            <TableCell>${item.total.toFixed(2)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    <div className="mt-4 space-y-2 text-right">
                                      <p>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
                                      <p>Tax: ${selectedOrder.tax.toFixed(2)}</p>
                                      <p>Shipping: ${selectedOrder.shipping.toFixed(2)}</p>
                                      <p className="font-bold text-lg">Total: ${selectedOrder.total.toFixed(2)}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Update Status</Label>
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
                                      <Label>Tracking Number</Label>
                                      <Input
                                        value={selectedOrder.trackingNumber || ""}
                                        placeholder="Enter tracking number"
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Order Notes</Label>
                                    <Textarea
                                      value={selectedOrder.notes || ""}
                                      placeholder="Add notes about this order..."
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Real-time stock tracking with Redis caching</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Stock
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkStockUpdate}>
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
                    <TableHead>Price</TableHead>
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
                          <div className="text-sm text-gray-500">{product.description}</div>
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
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getInventoryStatusColor(product)}>{getInventoryStatus(product)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="New stock"
                            className="w-24"
                            onChange={(e) => {
                              const stock = Number.parseInt(e.target.value) || 0
                              setBulkStockUpdates((prev) => {
                                const existing = prev.find((u) => u.productId === product.id)
                                if (existing) {
                                  return prev.map((u) => (u.productId === product.id ? { ...u, stock } : u))
                                }
                                return [...prev, { productId: product.id, stock }]
                              })
                            }}
                          />
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

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Add and manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, sku: e.target.value }))}
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter product description"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={newProduct.category}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Enter category"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Cost ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newProduct.cost}
                        onChange={(e) =>
                          setNewProduct((prev) => ({ ...prev, cost: Number.parseFloat(e.target.value) || 0 }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Initial Stock</Label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Low Stock Threshold</Label>
                      <Input
                        type="number"
                        value={newProduct.lowStockThreshold}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            lowStockThreshold: Number.parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.weight}
                      onChange={(e) =>
                        setNewProduct((prev) => ({ ...prev, weight: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={newProduct.status}
                      onValueChange={(value) =>
                        setNewProduct((prev) => ({ ...prev, status: value as Product["status"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>Real-time order insights from Redis</CardDescription>
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
                <CardTitle>Inventory Health</CardTitle>
                <CardDescription>Stock level monitoring</CardDescription>
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
