import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Trash2, ArrowRight, Tag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import QuantityStepper from '../../components/product/QuantityStepper';
import { 
  selectCartItems, 
  selectCartTotals,
  updateQuantity, 
  removeFromCart,
  applyCoupon,
  removeCoupon
} from '../../features/cart/cartSlice';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export default function CartPage() {
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState('');

  const handleUpdateQuantity = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemove = (productId, productName) => {
    dispatch(removeFromCart(productId));
    toast.success(`${productName} removed from cart`);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    // Demo coupon codes
    const validCoupons = {
      'FRESH10': { type: 'percentage', value: 10 },
      'SAVE50': { type: 'fixed', value: 50 },
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon) {
      dispatch(applyCoupon({ code: couponCode.toUpperCase(), ...coupon }));
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
    toast.success('Coupon removed');
  };

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <Breadcrumbs items={[{ label: 'Cart' }]} className="mb-6" />
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
          action={() => window.location.href = '/products'}
          actionLabel="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} className="mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Shopping Cart ({items.length} items)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link 
                      to={`/products/${item.product.slug}`}
                      className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-4xl shrink-0"
                    >
                      {item.product.images?.[0] || '📦'}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product.unit} • Sold by {item.product.vendor?.storeName}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => handleUpdateQuantity(item.product.id, qty)}
                          max={item.product.stockQuantity}
                        />

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice((item.product.discountedPrice || item.product.price) * item.quantity)}
                          </p>
                          {item.product.discountedPrice && (
                            <p className="text-sm text-gray-400 line-through">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                {totals.coupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {totals.coupon.code}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Try: FRESH10 or SAVE50
                </p>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span>
                      {totals.deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(totals.deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (5%)</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary-700">{formatPrice(totals.total)}</span>
                  </div>
                </div>

                {totals.subtotal < 500 && (
                  <p className="text-xs text-center text-gray-500 bg-yellow-50 p-2 rounded">
                    Add {formatPrice(500 - totals.subtotal)} more for free delivery
                  </p>
                )}

                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
