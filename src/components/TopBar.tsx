import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Mail, ShoppingCart, Heart, ShieldCheck, User, LogIn } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { useShop } from '../context/ShopContext';

export default function TopBar() {
  const { cartCount, wishlist, currentUser, isCustomerLoggedIn, openLoginModal } = useShop();

  return (
    <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-2.5 px-6 border-b border-slate-800">
      <div className="flex justify-between items-center">
        {/* Left Information */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium">{COMPANY_INFO.address.shortLocation}</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pay on Delivery Available</span>
          </span>
          <span className="text-slate-700">|</span>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{COMPANY_INFO.email}</span>
          </a>
        </div>

        {/* Right Direct CTAs & Cart/Wishlist */}
        <div className="flex items-center gap-3.5">
          {/* Customer Auth Indicator */}
          {isCustomerLoggedIn && currentUser ? (
            <Link
              to="/account"
              className="flex items-center gap-1.5 text-indigo-300 hover:text-white font-semibold transition-colors bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/60"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hi, {currentUser.fullName.split(' ')[0]}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              className="flex items-center gap-1 text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In / Register</span>
            </button>
          )}

          <span className="text-slate-700">|</span>
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Wishlist ({wishlist.length})</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cart ({cartCount})</span>
          </Link>
          <span className="text-slate-700">|</span>
          <a
            href={`tel:${COMPANY_INFO.phoneRaw}`}
            className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{COMPANY_INFO.phone}</span>
          </a>
          <span className="text-slate-700">|</span>
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      </div>
    </div>
  );
}
