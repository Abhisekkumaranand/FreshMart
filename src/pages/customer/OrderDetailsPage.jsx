import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Phone, ChevronLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { sampleOrders } from '../../data/dummyData';
import { formatPrice, formatDateTime, getOrderStatusColor, getPaymentStatusColor } from '../../lib/utils';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = sampleOrders.find(o => o.id === id) || sampleOrders[0];

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
        <Breadcrumbs
          items={[
            { label: 'My Orders', href: '/orders' },
            { label: `Order ${order.id}` }
          ]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-500">{order.id}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/orders">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  Order Status
                </CardTitle>
                <Badge className={getOrderStatusColor(order.orderStatus)}>
                  {getStatusLabel(order.orderStatus)}
                </Badge>
              </CardHeader>
              <CardContent>
                {/* Timeline */}
                <div className="relative">
                  {order.orderTimeline.map((event, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${
                          index === order.orderTimeline.length - 1 
                            ? 'bg-primary-600' 
                            : 'bg-green-500'
                        }`} />
                        {index < order.orderTimeline.length - 1 && (
                          <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{getStatusLabel(event.status)}</p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                  <Button asChild className="w-full mt-4">
                    <Link to={`/track-order/${order.id}`}>Track Order</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl shrink-0">
                      {item.product.images?.[0] || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="font-medium hover:text-primary-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Sold by: {item.product.vendor?.storeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Price Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-700">{formatPrice(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {order.shippingAddress.phone}
                </p>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full">
                  Need Help?
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
