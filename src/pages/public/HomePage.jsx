import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, Clock, Headphones } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import ProductGrid from '../../components/product/ProductGrid';
import {
  categories,
  products,
  featuredProducts,
  bestSellers,
  flashDeals,
  vendors,
  promotionalBanners,
  howItWorks
} from '../../data/dummyData';

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = () =>
    setCurrentBanner((prev) => (prev + 1) % promotionalBanners.length);
  const prevBanner = () =>
    setCurrentBanner((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);

  return (
    <div>
      {/* ====================== HERO ====================== */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
        {/* Decorative floating emojis */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <span className="absolute top-10 left-10 text-9xl">🥬</span>
          <span className="absolute bottom-10 right-10 text-9xl">🍎</span>
          <span className="absolute top-1/2 left-1/4 text-7xl">🥕</span>
          <span className="absolute bottom-1/3 right-1/3 text-8xl">🍋</span>
        </div>

        <div className="container relative z-10 py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                🎉 Free Delivery on orders above ₹500
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Fresh Groceries
                <br />
                <span className="text-secondary-400">Delivered Fast</span>
              </h1>
              <p className="text-lg text-primary-100 mb-8 max-w-lg">
                Shop from a wide range of fresh vegetables, fruits, dairy
                products, and daily essentials. Quality guaranteed with same-day
                delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white">
                  <Link to="/products">
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/products?deals=true">View Deals</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-primary-200 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-primary-200 text-sm">Local Vendors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-primary-200 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl" />
              <span className="relative z-10 text-[200px] drop-shadow-lg">🛒</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============= TRUST BADGES ============= */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Clock, title: 'Same Day Delivery', desc: 'Order before 2 PM' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CATEGORIES ============= */}
      <section className="py-14 lg:py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Explore our wide range of categories</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/products">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="group">
                <Card className="p-4 text-center hover:border-primary-300 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                    {category.image}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{category.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============= PROMOTIONAL BANNER ============= */}
      <section className="pb-14 lg:pb-20">
        <div className="container">
          <div className="relative rounded-2xl overflow-hidden">
            <div className={`p-8 lg:p-12 bg-gradient-to-r ${promotionalBanners[currentBanner].bgColor} text-white`}>
              <div className="max-w-lg">
                <span className="text-sm font-medium opacity-90">{promotionalBanners[currentBanner].subtitle}</span>
                <h3 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">{promotionalBanners[currentBanner].title}</h3>
                <p className="text-white/80 mb-6">{promotionalBanners[currentBanner].description}</p>
                <Button asChild className="bg-white text-gray-900 hover:bg-gray-100">
                  <Link to={promotionalBanners[currentBanner].ctaLink}>{promotionalBanners[currentBanner].ctaText}</Link>
                </Button>
              </div>
            </div>
            <div className="absolute right-4 bottom-4 flex gap-2">
              <button onClick={prevBanner} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextBanner} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FLASH DEALS ============= */}
      <section className="py-14 lg:py-20 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="text-3xl">⚡</span>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Flash Deals</h2>
                <p className="text-gray-500">Limited time offers</p>
              </div>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/products?deals=true">View All Deals <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <ProductGrid products={flashDeals} columns={6} />
        </div>
      </section>

      {/* ============= FEATURED PRODUCTS ============= */}
      <section className="py-14 lg:py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked products just for you</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/products?featured=true">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 8)} columns={4} />
        </div>
      </section>

      {/* ============= BEST SELLERS ============= */}
      <section className="py-14 lg:py-20 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-gray-500 mt-1">Most popular products this week</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/products?sort=best-selling">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          <ProductGrid products={bestSellers.slice(0, 8)} columns={4} />
        </div>
      </section>

      {/* ============= TOP VENDORS ============= */}
      <section className="py-14 lg:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Our Top Vendors</h2>
            <p className="text-gray-500">Trusted sellers with quality products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">{vendor.logo}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{vendor.storeName}</h3>
                <p className="text-sm text-gray-500 mb-2">{vendor.address}</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-medium">{vendor.rating}</span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-gray-500">{vendor.totalProducts} products</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============= HOW IT WORKS ============= */}
      <section className="py-14 lg:py-20 bg-primary-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500">Getting fresh groceries delivered is easy</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200" />
                )}
                <div className="relative z-10 w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">{step.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="py-14 lg:py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who trust FreshMart for their daily
            grocery needs. Fresh products, best prices, and fast delivery
            guaranteed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
              <Link to="/products">Start Shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/register?role=vendor">Become a Seller</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
