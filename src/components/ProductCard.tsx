import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check, ShieldCheck } from 'lucide-react';
import { Product, ApparelSize } from '../types/ecommerce';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useShop();
  const [selectedSize, setSelectedSize] = useState<ApparelSize | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      // Find first available in-stock size
      const firstInStock = product.availableSizes.find(
        (size) => (product.stock?.[size] ?? 0) > 0
      );
      if (!firstInStock) {
        showToast('All sizes currently sold out.');
        return;
      }
      setSelectedSize(firstInStock);
      const res = addToCart(product, firstInStock, 1);
      showToast(res.message);
    } else {
      const res = addToCart(product, selectedSize, 1);
      showToast(res.message);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-3 left-3 right-3 z-20 bg-slate-900 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-lg text-center animate-fade-in flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Image Container with Badges */}
      <div>
        <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-slate-100 mb-4 group/img">
          <Link to={`/product/${product.slug}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Badges on top left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.badge && (
              <span className="px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                {product.badge}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
              {product.gsm} GSM
            </span>
          </div>

          {/* Wishlist Button on top right */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-xs'
                : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Quick Details Hover Overlay */}
          <Link
            to={`/product/${product.slug}`}
            className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-xs font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1.5 hover:bg-slate-900 backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details & Sizes</span>
          </Link>
        </div>

        {/* Product Meta */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-indigo-600">
              {product.fit}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span className="font-bold text-slate-700">{product.rating}</span>
              <span>({product.reviewsCount})</span>
            </span>
          </div>

          <h3 className="font-display font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1">
            {product.fabric}
          </p>

          {/* Price Strip */}
          <div className="pt-1 flex items-baseline gap-2">
            <span className="font-display text-lg font-black text-slate-900">
              ₹{product.price}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.mrp}
            </span>
            <span className="text-[11px] font-bold text-emerald-600">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Size Pill Selectors */}
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1.5">
              Select Size:
            </span>
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.map((size) => {
                const stock = product.stock?.[size] ?? 0;
                const isOutOfStock = stock <= 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isOutOfStock) setSelectedSize(size);
                    }}
                    className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isOutOfStock
                        ? 'bg-slate-100 text-slate-300 line-through cursor-not-allowed border border-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={isOutOfStock ? `${size} Sold Out` : `${size} (${stock} in stock)`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={handleQuickAdd}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs group"
        >
          <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{selectedSize ? `Add Size ${selectedSize}` : 'Add to Cart'}</span>
        </button>

        <Link
          to={`/product/${product.slug}`}
          className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          title="Full specifications"
        >
          Details
        </Link>
      </div>

      {/* Assurance note */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Tiruppur Quality</span>
        </span>
        <span>48-Hr Return</span>
      </div>
    </div>
  );
}
