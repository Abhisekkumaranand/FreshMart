import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Home,
  Grid3X3,
  ShoppingCart,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { selectMobileMenuOpen, setMobileMenuOpen } from '../../features/ui/uiSlice';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import { categories } from '../../data/dummyData';
import { getInitials } from '../../lib/utils';

export default function MobileMenu() {
  const isOpen = useSelector(selectMobileMenuOpen);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setMobileMenuOpen(false));
  
  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const menuLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'All Categories', href: '/products', icon: Grid3X3 },
    { name: 'My Cart', href: '/cart', icon: ShoppingCart },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setMobileMenuOpen(open))}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="font-bold">FreshMart</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Section */}
          {isAuthenticated ? (
            <div className="p-4 bg-primary-50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary-600 text-white text-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">
                Sign in to access your account
              </p>
              <div className="flex gap-2">
                <Button asChild className="flex-1" onClick={handleClose}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1" onClick={handleClose}>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Menu Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase">Menu</span>
            </div>
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={handleClose}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <link.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{link.name}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}

            <Separator className="my-4" />

            <div className="px-4 mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase">Categories</span>
            </div>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                onClick={handleClose}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{category.image}</span>
                  <span className="text-gray-700">{category.name}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Separator className="my-4" />
                
                <div className="px-4 mb-2">
                  <span className="text-xs font-medium text-gray-400 uppercase">Account</span>
                </div>
                
                {user?.role === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    onClick={handleClose}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Vendor Dashboard</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={handleClose}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Admin Dashboard</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  onClick={handleClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">My Profile</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
