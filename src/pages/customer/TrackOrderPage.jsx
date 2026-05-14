import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone,
  ChevronLeft,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { sampleOrders } from '../../data/dummyData';
import { formatPrice, formatDateTime, getOrderStatusColor } from '../../lib/utils';

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrderPage() {
  const { id } = useParams();
  const order = sampleOrders.find(o => o.id === id) || sampleOrders[0];

  const currentStatusIndex = statusSteps.findIndex(s => s.key === order.orderStatus);

  const getTimeForStatus = (status) => {
    const event = order.orderTimeline.find(e => e.status === status);
    return event ? formatDateTime(event.timestamp) : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { label: 'My Orders', href: '/orders' },
            { label: `Track Order ${order.id}` }
          ]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
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
          {/* Main Tracking */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Status</CardTitle>
                  <Badge className={getOrderStatusColor(order.orderStatus)}>
                    {statusSteps.find(s => s.key === order.orderStatus)?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Status Progress */}
                <div className="relative py-8">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden lg:block" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 transition-all duration-500 hidden lg:block"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />

                  {/* Steps */}
                  <div className="flex flex-col lg:flex-row lg:justify-between relative z-10 gap-6 lg:gap-0">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const time = getTimeForStatus(step.key);

                      return (
                        <div key={step.key} className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isCompleted 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                            <step.icon className="w-6 h-6" />
                          </div>
                          <div className="lg:text-center">
                            <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            {time && (
                              <p className="text-xs text-gray-500 mt-1">{time}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Delivery */}
                {order.orderStatus !== 'delivered' && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg flex items-center gap-4">
                    <Clock className="w-8 h-8 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">
                        Expected by tomorrow, between 10 AM - 6 PM
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-4">
                    {[...order.orderTimeline].reverse().map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary-600' : 'bg-gray-300'
                          }`} />
                          {index < order.orderTimeline.length - 1 && (
                            <div className="absolute top-3 left-1 w-0.5 h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-gray-900">
                            {statusSteps.find(s => s.key === event.status)?.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(event.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
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

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xl shrink-0">
                      {item.product.images?.[0] || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
                <div className="pt-3 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary-700">{formatPrice(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any issues with your order, our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
