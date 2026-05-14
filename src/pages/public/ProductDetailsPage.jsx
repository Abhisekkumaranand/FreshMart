import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Star,
  Check,
  Minus,
  Plus,
  Store
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import RatingStars from '../../components/product/RatingStars';
import QuantityStepper from '../../components/product/QuantityStepper';
import ProductGrid from '../../components/product/ProductGrid';
import { addToCart } from '../../features/cart/cartSlice';
import { products } from '../../data/dummyData';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Find product by slug
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.discountedPrice);
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category, href: `/products?category=${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}` },
            { label: product.name }
          ]}
          className="mb-6"
        />

        {/* Product Details */}
        <div className="bg-white rounded-xl p-6 lg:p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-4 relative">
                <span className="text-[150px]">
                  {product.images?.[selectedImage] || '📦'}
                </span>
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
              {/* Thumbnail strip would go here for multiple images */}
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.brand && (
                  <span className="text-sm text-gray-500">by {product.brand}</span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-500">
                  ({product.numReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <PriceDisplay
                  price={product.price}
                  discountedPrice={product.discountedPrice}
                  size="lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Price per {product.unit}
                </p>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6">
                {product.shortDescription}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-sm">
                    Out of Stock
                  </Badge>
                ) : isLowStock ? (
                  <Badge variant="warning" className="text-sm">
                    Only {product.stockQuantity} left in stock
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-sm">
                    <Check className="w-3 h-3 mr-1" />
                    In Stock
                  </Badge>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500 mb-2 block">Quantity</span>
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    max={product.stockQuantity}
                    size="lg"
                  />
                </div>
                <div className="flex-1 flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Wishlist & Share */}
              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" className="text-gray-600">
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="ghost" className="text-gray-600">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Delivery Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-500">On orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Quality Assured</p>
                    <p className="text-sm text-gray-500">100% fresh products guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-500">7 days return policy</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Vendor Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  {product.vendor?.logo || <Store className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.vendor?.storeName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {product.vendor?.rating}
                    </span>
                    <span>•</span>
                    <span>{product.vendor?.totalProducts} products</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Specifications, Reviews */}
        <div className="bg-white rounded-xl p-6 lg:p-8 mb-8">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6">
              <TabsTrigger 
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
              >
                Reviews ({product.numReviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Unit</span>
                  <span className="font-medium">{product.unit}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Shelf Life</span>
                  <span className="font-medium">As per packaging</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                    <RatingStars rating={product.rating} showValue={false} />
                    <p className="text-sm text-gray-500 mt-1">{product.numReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm w-3">{star}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                          R
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Rahul S.</span>
                            <span className="text-sm text-gray-500">2 days ago</span>
                          </div>
                          <RatingStars rating={5} size="sm" showValue={false} />
                          <p className="text-gray-600 mt-2">
                            Great quality product! Fresh and exactly as described. Will definitely buy again.
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
