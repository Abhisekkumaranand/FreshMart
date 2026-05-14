import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import { sampleOrders } from '../../data/dummyData';
import { formatPrice, formatDate, getOrderStatusColor } from '../../lib/utils';

export default function OrdersPage() {
  const orders = sampleOrders;

  const getStatusLabel = (status) => {
    const labels = {
      placed: 'Placed',
      confirmed: 'Confirmed',
      packed: 'Packed',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Breadcrumbs items={[{ label: 'My Orders' }]} className="mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search orders..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.length === 0 ? (
              <EmptyState
                icon="orders"
                title="No orders yet"
                description="You haven't placed any orders. Start shopping to see your orders here."
                action={() => window.location.href = '/products'}
                actionLabel="Start Shopping"
              />
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 border-b">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div>
                          <p className="text-xs text-gray-500">ORDER ID</p>
                          <p className="font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">PLACED ON</p>
                          <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">TOTAL</p>
                          <p className="font-semibold text-primary-700">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getOrderStatusColor(order.orderStatus)}>
                        {getStatusLabel(order.orderStatus)}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
                              {item.product.images?.[0] || '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium line-clamp-1">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                              </p>
                            </div>
                            <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            + {order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/orders/${order.id}`}>
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <Button asChild size="sm">
                            <Link to={`/track-order/${order.id}`}>
                              <Package className="w-4 h-4 mr-1" />
                              Track Order
                            </Link>
                          </Button>
                        )}
                        {order.orderStatus === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="active">
            <EmptyState
              icon="orders"
              title="No active orders"
              description="You don't have any active orders at the moment."
            />
          </TabsContent>

          <TabsContent value="delivered">
            <EmptyState
              icon="orders"
              title="No delivered orders"
              description="Your delivered orders will appear here."
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <EmptyState
              icon="orders"
              title="No cancelled orders"
              description="You haven't cancelled any orders."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
