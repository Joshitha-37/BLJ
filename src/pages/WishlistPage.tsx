import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              Saved Garments
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              My Wishlist ({wishlistedProducts.length})
            </h1>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Browse All T-Shirts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="py-20 px-4 max-w-md mx-auto text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Explore our collection of Tiruppur-made heavyweight T-shirts and save your favorites here.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop T-Shirts Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
