import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-primary-700" />
          </div>
          <span className="text-2xl font-bold text-white">FreshMart</span>
        </Link>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Fresh Groceries<br />Delivered to Your<br />Doorstep
          </h1>
          <p className="text-primary-100 text-lg max-w-md">
            Shop from a wide range of fresh vegetables, fruits, dairy products, and more. Quality guaranteed with same-day delivery.
          </p>
          
          <div className="flex items-center gap-8 pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-primary-200 text-sm">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-primary-200 text-sm">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-primary-200 text-sm">Happy Customers</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-primary-200 text-sm">
          <span>🛡️ Secure Payments</span>
          <span>•</span>
          <span>🚚 Fast Delivery</span>
          <span>•</span>
          <span>✓ Quality Assured</span>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FreshMart</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
