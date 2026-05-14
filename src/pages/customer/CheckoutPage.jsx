import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ChevronRight,
  Smartphone,
  Building,
  Banknote,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { selectCartItems, selectCartTotals, clearCart } from '../../features/cart/cartSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { addressSchema } from '../../lib/validators';
import { formatPrice } from '../../lib/utils';
import { INDIAN_STATES, ADDRESS_TYPES } from '../../lib/constants';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using any UPI app' },
  { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks supported' },
  { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, description: 'Visa, Mastercard, Rupay' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
];

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Confirmation', icon: CheckCircle },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      type: 'home',
    },
  });

  const handleAddressSubmit = (data) => {
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    setCurrentStep(3);
    dispatch(clearCart());

    setIsProcessing(false);
    toast.success('Order placed successfully!');
  };

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <Breadcrumbs 
          items={[
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' }
          ]} 
          className="mb-6" 
        />

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                currentStep >= step.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(handleAddressSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          {...register('fullName')}
                          className={errors.fullName ? 'border-red-500' : ''}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        placeholder="House/Flat No., Building Name"
                        {...register('addressLine1')}
                        className={errors.addressLine1 ? 'border-red-500' : ''}
                      />
                      {errors.addressLine1 && (
                        <p className="text-sm text-red-500">{errors.addressLine1.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        placeholder="Street, Landmark"
                        {...register('addressLine2')}
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...register('city')}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-500">{errors.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select onValueChange={(value) => setValue('state', value)}>
                          <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.state && (
                          <p className="text-sm text-red-500">{errors.state.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          {...register('pincode')}
                          className={errors.pincode ? 'border-red-500' : ''}
                        />
                        {errors.pincode && (
                          <p className="text-sm text-red-500">{errors.pincode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <RadioGroup
                        defaultValue="home"
                        onValueChange={(value) => setValue('type', value)}
                        className="flex gap-4"
                      >
                        {ADDRESS_TYPES.map((type) => (
                          <Label
                            key={type.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <RadioGroupItem value={type.value} />
                            {type.label}
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <Label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value={method.id} />
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <method.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handlePaymentSubmit}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && orderPlaced && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-gray-500 mb-2">
                    Thank you for your order. Your order ID is:
                  </p>
                  <p className="text-xl font-semibold text-primary-600 mb-6">
                    {orderId}
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    You will receive an order confirmation email shortly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <a href={`/track-order/${orderId}`}>Track Order</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/products">Continue Shopping</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          {!orderPlaced && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center text-2xl shrink-0">
                          {item.product.images?.[0] || '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice((item.product.discountedPrice || item.product.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery</span>
                      <span>{totals.deliveryFee === 0 ? 'FREE' : formatPrice(totals.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>{formatPrice(totals.tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary-700">{formatPrice(totals.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
