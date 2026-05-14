import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">
                Subscribe to our Newsletter
              </h3>
              <p className="text-gray-400 text-sm">
                Get updates on offers, new products, and recipes
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 w-full md:w-64"
              />
              <Button className="bg-primary-600 hover:bg-primary-700 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🛒</span>
              </div>
              <span className="text-xl font-bold text-white">FreshMart</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your trusted online grocery shopping platform. Fresh vegetables,
              fruits, dairy, and more delivered to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              {['f', '𝕏', '📷', '▶'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/products' },
                { label: 'Fresh Produce', to: '/products?category=fruits-vegetables' },
                { label: 'Deals & Offers', to: '/products?deals=true' },
                { label: 'Become a Seller', to: '/register?role=vendor' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-primary-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              {['Track Order', 'My Account', 'FAQs', 'Return Policy', 'Shipping Info'].map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'].map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                <span>123 Market Street, Connaught Place, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary-400" />
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-primary-400" />
                <span>support@freshmart.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} FreshMart. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>UPI</span>
              <span>Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
