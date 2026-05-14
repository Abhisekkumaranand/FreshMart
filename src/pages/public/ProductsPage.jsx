import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Slider } from '../../components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import ProductGrid from '../../components/product/ProductGrid';
import { products, categories, vendors } from '../../data/dummyData';
import { SORT_OPTIONS } from '../../lib/constants';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'relevance';

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter from URL
    if (categoryFilter) {
      // Remove any non-alphanumeric characters for a foolproof match against slugs
      const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter(p => 
        normalize(p.category) === normalize(categoryFilter) ||
        p.category.toLowerCase().includes(categoryFilter.toLowerCase().replace(/-/g, ' '))
      );
    }

    // Selected categories filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        selectedCategories.some(cat => p.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Vendor filter
    if (selectedVendors.length > 0) {
      result = result.filter(p => selectedVendors.includes(p.vendorId));
    }

    // Price filter
    result = result.filter(p => {
      const price = p.discountedPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter(p => 
        selectedRatings.some(r => p.rating >= r)
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stockQuantity > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price_high':
        result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'newest':
        result.reverse();
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, categoryFilter, selectedCategories, selectedVendors, priceRange, selectedRatings, inStockOnly, sortBy]);

  const handleSortChange = (value) => {
    setSearchParams(prev => {
      prev.set('sort', value);
      return prev;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSelectedRatings([]);
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setSearchParams({});
  };

  const activeFiltersCount = selectedCategories.length + selectedVendors.length + selectedRatings.length + (inStockOnly ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.slice(0, 6).map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.name]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                  }
                }}
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            step={10}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Vendors */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Vendors</h3>
        <div className="space-y-2">
          {vendors.slice(0, 5).map((vendor) => (
            <label key={vendor.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedVendors.includes(vendor.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedVendors([...selectedVendors, vendor.id]);
                  } else {
                    setSelectedVendors(selectedVendors.filter(v => v !== vendor.id));
                  }
                }}
              />
              <span className="text-sm text-gray-600">{vendor.storeName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRatings([...selectedRatings, rating]);
                  } else {
                    setSelectedRatings(selectedRatings.filter(r => r !== rating));
                  }
                }}
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                {rating}+ <span className="text-yellow-500">⭐</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={setInStockOnly}
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Products' }
          ]}
          className="mb-6"
        />

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {filteredProducts.length} products found
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-2">{activeFiltersCount}</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center border rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(activeFiltersCount > 0 || categoryFilter || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {categoryFilter && (
                    <Badge variant="secondary" className="gap-1">
                  {categoryFilter.replace(/-/g, ' ')}
                      <button onClick={() => setSearchParams({})}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="gap-1">
                      {cat}
                      <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {inStockOnly && (
                    <Badge variant="secondary" className="gap-1">
                      In Stock
                      <button onClick={() => setInStockOnly(false)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                icon="search"
                title="No products found"
                description="Try adjusting your filters or search terms"
                action={clearFilters}
                actionLabel="Clear Filters"
              />
            ) : (
              <ProductGrid products={filteredProducts} columns={4} />
            )}

            {/* Pagination placeholder */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled>Previous</Button>
                  <Button variant="default">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
