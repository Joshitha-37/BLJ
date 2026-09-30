import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
  Lock,
  User,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    storeSettings,
    currentUser,
    isCustomerLoggedIn,
    openLoginModal,
  } = useShop();

  const freeDeliveryShortfall = Math.max(
    0,
    storeSettings.freeDeliveryThreshold - cartSubtotal
  );

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-slate-600 mt-2 text-sm max-w-md mx-auto">
          Explore our collection of authentic, heavyweight bio-washed T-shirts sourced directly from Tiruppur knitters.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-xs"
          >
            <span>Explore All T-Shirts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/wishlist"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-colors"
          >
            <span>View Saved Wishlist</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4 text-left">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              Review Bag
            </span>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Free Delivery Bar */}
        {freeDeliveryShortfall > 0 ? (
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <span>
              Add <strong>₹{freeDeliveryShortfall}</strong> more to your order to unlock <strong>FREE Courier Delivery</strong> across India!
            </span>
            <Link to="/shop" className="font-bold underline shrink-0 ml-2">
              Browse More
            </Link>
          </div>
        ) : (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Congratulations! You qualify for <strong>FREE Courier Delivery</strong> across India.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const maxStock = item.product.stock?.[item.selectedSize] ?? 99;
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between hover:border-slate-300 transition-colors"
                >
                  {/* Product Details */}
                  <div className="flex items-center gap-4 text-left">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {item.product.fit} · {item.product.gsm} GSM
                      </span>
                      <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition-colors">
                        <Link to={`/product/${item.product.slug}`}>{item.product.name}</Link>
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-extrabold text-slate-800 border border-slate-200">
                          Size: {item.selectedSize}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-700">₹{item.price} each</span>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        {item.product.fabric}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <span className="font-display font-black text-base text-slate-900 block">
                        ₹{itemTotal}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (₹{item.price} × {item.quantity})
                      </span>
                    </div>

                    {/* Delete Item */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Sourcing & Policy Guarantee Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Express Courier Supply</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>48-Hr Return Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pay on Delivery Option</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 text-left sticky top-20">
              <h2 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Bag Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-slate-800">₹{cartSubtotal}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-bold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-extrabold uppercase">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <div>
                    <span className="font-display font-black text-base text-slate-900 block">
                      Total Payable:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      All taxes and courier handling included
                    </span>
                  </div>
                  <span className="font-display text-2xl font-black text-indigo-600">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              {/* Account Requirement Status */}
              {!isCustomerLoggedIn || !currentUser ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Account Required to Place Order</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    You can browse, cart, or wishlist freely. An account is required before your order can be placed.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openLoginModal(
                        'Please log in or create an account to finalize your order.'
                      )
                    }
                    className="mt-1 font-bold text-indigo-700 hover:text-indigo-900 underline text-[11px] block cursor-pointer"
                  >
                    Log In or Sign Up Now →
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">
                    Logged in as <strong>{currentUser.fullName}</strong>
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/shop"
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>

              {/* Return Policy Reminder */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-800 block">
                  Return Conditions Reminder:
                </span>
                <p>
                  Returns must be submitted within <strong>48 hours of delivery</strong> with all original tags and packaging intact.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
