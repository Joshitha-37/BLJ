import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Ruler,
  Star,
  ChevronRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ApparelSize } from '../types/ecommerce';
import { COMPANY_INFO } from '../data/company';
import SizeGuideModal from '../components/SizeGuideModal';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug, addToCart, isInWishlist, toggleWishlist } = useShop();

  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ApparelSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="py-24 px-4 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ?
        </div>
        <h2 className="font-display text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-slate-600 mt-2 text-sm">
          The requested T-shirt does not exist or may have been updated.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
        >
          <span>Browse All T-Shirts</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const currentSizeStock = selectedSize ? (product.stock?.[selectedSize] ?? 0) : null;
  const isSelectedOutOfStock = currentSizeStock !== null && currentSizeStock <= 0;
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleSelectSize = (size: ApparelSize) => {
    setSelectedSize(size);
    setErrorMessage(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMessage('Please select a size (XS, S, M, L, XL, XXL) before adding to cart.');
      return;
    }

    if (isSelectedOutOfStock) {
      setErrorMessage(`Size ${selectedSize} is currently SOLD OUT / SIZE UNAVAILABLE.`);
      return;
    }

    const res = addToCart(product, selectedSize, quantity);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setErrorMessage(null);
      setSuccessToast(res.message);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setErrorMessage('Please select a size (XS, S, M, L, XL, XXL) to Buy Now.');
      return;
    }

    if (isSelectedOutOfStock) {
      setErrorMessage(`Size ${selectedSize} is currently SOLD OUT / SIZE UNAVAILABLE.`);
      return;
    }

    const res = addToCart(product, selectedSize, quantity);
    if (res.success) {
      navigate('/checkout');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/category/t-shirts" className="hover:text-slate-900 transition-colors">T-Shirts</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Success Alert */}
        {successToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <Link
              to="/cart"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              View Cart
            </Link>
          </div>
        )}

        {/* Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Tag Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                {product.badge && (
                  <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                    {product.badge}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                  {product.gsm} GSM Tiruppur Knit
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 shadow-md'
                    : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white shadow-xs'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-xs'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Tiruppur Origin & Fabric Spec Box */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fabric & Manufacturing Specifications</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fabric</span>
                  <span className="font-semibold text-slate-800">{product.fabric}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Knit Density</span>
                  <span className="font-semibold text-slate-800">{product.gsm} GSM Heavyweight</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fit Cut</span>
                  <span className="font-semibold text-slate-800">{product.fit}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Origin</span>
                  <span className="font-semibold text-slate-800">Tiruppur, Tamil Nadu</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Wash Care</span>
                  <span className="font-semibold text-slate-800">Machine Wash Cold</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pre-Shrunk</span>
                  <span className="font-semibold text-slate-800">Bio-Washed (0-2% Shrinkage)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Buying Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5 text-left">
              {/* Product Title & Review Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </span>
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Price Display (INR ONLY) */}
                <div className="pt-2 flex items-baseline gap-3">
                  <span className="font-display text-3xl font-black text-slate-900">
                    ₹{product.price}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.mrp}
                  </span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    SAVE {discountPercent}%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Inclusive of all taxes)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {product.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 pt-1">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Size Selector Strip */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-slate-900">
                      Select Size:
                    </span>
                    {selectedSize ? (
                      <span className="text-xs font-bold text-indigo-600">({selectedSize})</span>
                    ) : (
                      <span className="text-xs text-rose-500 font-bold">*Required</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Chart & Guide</span>
                  </button>
                </div>

                {/* Size Button Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {product.availableSizes.map((size) => {
                    const stock = product.stock?.[size] ?? 0;
                    const isOutOfStock = stock <= 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleSelectSize(size)}
                        className={`py-3 px-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-extrabold shadow-md scale-102 ring-2 ring-indigo-300'
                            : isOutOfStock
                            ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed opacity-60'
                            : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold hover:border-indigo-400'
                        }`}
                      >
                        <span className="text-sm font-display tracking-tight">{size}</span>
                        <span className="text-[10px] mt-0.5 font-normal">
                          {isOutOfStock ? (
                            <span className="text-rose-400 line-through">Sold Out</span>
                          ) : stock <= 5 ? (
                            <span className={isSelected ? 'text-amber-200' : 'text-amber-600'}>
                              {stock} left
                            </span>
                          ) : (
                            <span className={isSelected ? 'text-indigo-200' : 'text-slate-400'}>
                              In Stock
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Size Stock Status Feedback */}
                {selectedSize && (
                  <div className="text-xs pt-1">
                    {isSelectedOutOfStock ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Size {selectedSize} is SOLD OUT / SIZE UNAVAILABLE.</span>
                      </span>
                    ) : (currentSizeStock ?? 0) <= 5 ? (
                      <span className="text-amber-600 font-bold">
                        Hurry! Only {currentSizeStock} units left in size {selectedSize}.
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Size {selectedSize} is in stock and ready to dispatch from Tiruppur.</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-extrabold text-slate-900">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isSelectedOutOfStock}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxAvailable = currentSizeStock ?? 99;
                      setQuantity((q) => Math.min(maxAvailable, q + 1));
                    }}
                    disabled={
                      (currentSizeStock !== null && quantity >= currentSizeStock) ||
                      isSelectedOutOfStock
                    }
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Main Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isSelectedOutOfStock}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isSelectedOutOfStock}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>BUY NOW (EXPRESS CHECKOUT)</span>
                </button>
              </div>

              {/* Return Policy & Courier Trust Strip */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <RotateCcw className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900 block font-bold">
                        48-Hour Return Policy (Original Tags & Packaging)
                      </strong>
                      <span>
                        Returns accepted within <strong>48 hours of delivery</strong> for wrong product or wrong size received. Garment must retain original tags and packaging intact.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1.5 border-t border-slate-200/50">
                    <Truck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900 block font-bold">
                        Courier Dispatch & Pay on Delivery
                      </strong>
                      <span>
                        Dispatched with trusted courier partners. Pay on Delivery (Cash/UPI) or Bank Transfer accepted.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Founder Hotline */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Questions about fabric or sizing?</span>
                  <a
                    href={COMPANY_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
