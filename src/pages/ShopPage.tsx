import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES_LIST } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { products, loadingProducts } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const fits = ['all', 'Oversized / Boxy Fit', 'Regular Fit', 'Smart Casual Fit', 'Relaxed Streetwear Fit'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Fit check
      if (selectedFit !== 'all' && p.fit !== selectedFit) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesFabric = p.fabric.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesFabric && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedFit, searchQuery, sortBy]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setSearchParams(catId === 'all' ? {} : { category: catId });
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-md border border-indigo-800/60 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tiruppur Direct Sourcing & Supply</span>
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
              Authentic Indian T-Shirt Collection
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore heavyweight, bio-washed, and drop-shoulder T-shirts crafted from 100% super-combed cotton in Tiruppur. Pay on Delivery and 48-Hour Return Guarantee on every order.
            </p>
          </div>
        </div>

        {/* Categories Bar (Expandable Architecture for future Shirts, Hoodies, etc.) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-700">
              Apparel Categories:
            </span>
            <span className="text-xs text-slate-500">
              Showing {filteredProducts.length} items
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => !cat.comingSoon && handleCategoryClick(cat.id)}
                  disabled={cat.comingSoon}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : cat.comingSoon
                      ? 'bg-slate-100 text-slate-400 border border-dashed border-slate-300 cursor-not-allowed'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.comingSoon ? (
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Soon
                    </span>
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Fit Filter & Sort Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by fabric, fit, GSM, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Fit & Sort controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
            {/* Fit Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedFit}
                onChange={(e) => setSelectedFit(e.target.value)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden"
              >
                <option value="all">All Fits</option>
                <option value="Oversized / Boxy Fit">Oversized / Boxy</option>
                <option value="Regular Fit">Regular Fit</option>
                <option value="Smart Casual Fit">Smart Casual (Polo)</option>
                <option value="Relaxed Streetwear Fit">Relaxed Streetwear</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 text-sm">Loading T-shirts catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <h3 className="font-display font-bold text-lg text-slate-800">No matching T-shirts found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or removing active filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFit('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Sourcing Guarantee Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
            <Truck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900">Direct From Tiruppur Hub</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Direct procurement from India's knitwear capital ensuring authentic combed cotton and high GSM density.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900">48-Hour Return Policy</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hassle-free returns accepted within 48 hours of delivery for wrong product or size with tags intact.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900">Pay on Delivery Options</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Convenient courier payment options with Cash/UPI on Arrival or direct Bank Transfer.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
