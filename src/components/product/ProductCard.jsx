import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Star, Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PriceDisplay } from '../common/PriceDisplay';
import { addToCart } from '../../features/cart/cartSlice';
import { calculateDiscount } from '../../lib/utils';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  const discount = calculateDiscount(product.price, product.discountedPrice);
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.slug}`}>
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-red-500 text-white">
              {discount}% OFF
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            toast.success('Added to wishlist');
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative">
          <span className="text-6xl transition-transform group-hover:scale-110 duration-300">
            {product.images?.[0] || '📦'}
          </span>
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          
          {/* Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">
            {product.name}
          </h3>

          {/* Unit */}
          <p className="text-sm text-gray-500 mb-2">{product.unit}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.numReviews})</span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <PriceDisplay 
              price={product.price} 
              discountedPrice={product.discountedPrice}
              size="sm"
              showDiscount={false}
            />
            
            <Button
              size="icon-sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
