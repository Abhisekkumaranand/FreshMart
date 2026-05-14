import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Plus, Minus, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { selectCartDrawerOpen, setCartDrawerOpen } from '../../features/ui/uiSlice';
import { 
  selectCartItems, 
  selectCartTotals,
  updateQuantity, 
  removeFromCart 
} from '../../features/cart/cartSlice';
import { formatPrice } from '../../lib/utils';

export default function CartDrawer() {
  const isOpen = useSelector(selectCartDrawerOpen);
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setCartDrawerOpen(false));

  const handleUpdateQuantity = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setCartDrawerOpen(open))}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild onClick={handleClose}>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl shrink-0">
                    {item.product.images?.[0] || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.product.unit}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-primary-700">
                        {formatPrice(item.product.discountedPrice || item.product.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium">
                  {totals.deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(totals.deliveryFee)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg text-primary-700">
                  {formatPrice(totals.total)}
                </span>
              </div>

              {totals.subtotal < 500 && (
                <p className="text-xs text-gray-500 text-center">
                  Add {formatPrice(500 - totals.subtotal)} more for free delivery
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" asChild onClick={handleClose}>
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button asChild onClick={handleClose}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
