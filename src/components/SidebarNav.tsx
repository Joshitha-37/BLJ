import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Sparkles,
  Heart,
  ShoppingCart,
  User,
  ShieldCheck,
  FileText,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  LogIn,
  LogOut,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { useShop } from '../context/ShopContext';

export default function SidebarNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    cartCount,
    wishlist,
    currentUser,
    isCustomerLoggedIn,
    openLoginModal,
    logoutCustomer,
  } = useShop();
  const [isAdminActive, setIsAdminActive] = useState(false);

  useEffect(() => {
    setIsAdminActive(Boolean(localStorage.getItem('blj_admin_session')));
    const handleStorage = () => {
      setIsAdminActive(Boolean(localStorage.getItem('blj_admin_session')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const navigationItems = [
    { name: 'HOME', path: '/', icon: Home, end: true },
    { name: 'SHOP', path: '/shop', icon: ShoppingBag },
    { name: 'T-SHIRTS', path: '/category/t-shirts', icon: Sparkles, badgeText: 'Live' },
    {
      name: 'WISHLIST',
      path: '/wishlist',
      icon: Heart,
      count: wishlist.length > 0 ? wishlist.length : undefined,
    },
    {
      name: 'CART',
      path: '/cart',
      icon: ShoppingCart,
      count: cartCount > 0 ? cartCount : undefined,
    },
    {
      name: 'ACCOUNT',
      path: '/account',
      icon: User,
      badgeText: isCustomerLoggedIn ? 'Active' : 'Login',
    },
    { name: 'RETURN POLICY', path: '/return-policy', icon: FileText },
    {
      name: 'ADMIN HUB',
      path: '/admin',
      icon: ShieldCheck,
      badgeText: isAdminActive ? 'Active' : 'Locked',
    },
  ];

  const closeMobile = () => setMobileOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md font-bold'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 space-y-6">
      {/* 1. Brand Header */}
      <div className="space-y-4">
        <Link
          to="/"
          onClick={closeMobile}
          className="flex items-center gap-3 group text-left pb-4 border-b border-slate-800/80"
        >
          {/* Brand Monogram */}
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-sm tracking-wider shadow-sm group-hover:bg-indigo-500 transition-colors shrink-0">
            BLJ
          </div>

          {/* Exact Brand Title & Tagline */}
          <div className="flex flex-col text-left">
            <span className="font-display text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors leading-tight">
              {COMPANY_INFO.name}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-400 leading-tight mt-0.5">
              Online T-Shirt Store
            </span>
          </div>
        </Link>

        {/* Location Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">{COMPANY_INFO.address.shortLocation}</span>
        </div>

        {/* Customer Account Status & Quick Auth */}
        {isCustomerLoggedIn && currentUser ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Link
              to="/account"
              onClick={closeMobile}
              className="flex items-center gap-2.5 truncate hover:text-indigo-300 transition-colors flex-1"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-indigo-500 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="truncate text-left">
                <span className="text-white font-bold block truncate text-[11px] leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-emerald-400 text-[10px] block truncate leading-tight mt-0.5">
                  Verified Member
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={logoutCustomer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1 cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              closeMobile();
              openLoginModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Customer Sign In / Register</span>
          </button>
        )}

        {/* 2. Navigation Menu */}
        <div className="space-y-1 pt-1 text-left">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-3 block mb-2">
            Store Navigation
          </span>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobile}
                  className={navLinkClass}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="flex-1">{item.name}</span>
                  
                  {item.badgeText && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white">
                      {item.badgeText}
                    </span>
                  )}

                  {typeof item.count === 'number' && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-indigo-500 text-white shadow-xs">
                      {item.count}
                    </span>
                  )}

                  <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Action Buttons & Direct Sourcing Desk */}
      <div className="space-y-4 pt-4 border-t border-slate-800 text-left">
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1 block">
          Direct Customer Desk
        </span>

        {/* Working Buttons inside Left Menu */}
        <div className="space-y-2">
          {/* CALL NOW */}
          <a
            href={`tel:${COMPANY_INFO.phoneRaw}`}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-colors shadow-xs group"
          >
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>CALL NOW</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {COMPANY_INFO.phone}
            </span>
          </a>

          {/* WHATSAPP */}
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs group"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>WHATSAPP</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-200">
              Direct Desk
            </span>
          </a>

          {/* EMAIL US */}
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>EMAIL US</span>
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
              {COMPANY_INFO.email}
            </span>
          </a>
        </div>

        {/* Founder & Courier Assurance Note */}
        <div className="pt-2 border-t border-slate-900 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-semibold text-white">{COMPANY_INFO.founder}</span>
            <span className="text-[10px] text-slate-500">({COMPANY_INFO.founderTitle})</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Courier & Pay on Delivery options</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Menu Bar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 border-r border-slate-800 flex-col overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Top Header Bar with Left Menu Trigger */}
      <header className="lg:hidden sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs">
        {/* Left Menu Hamburger Button + Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
            aria-label="Open Left Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-display font-black text-xs">
              BLJ
            </div>
            <div>
              <span className="font-display text-sm font-black tracking-tight text-white block leading-tight">
                {COMPANY_INFO.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 block leading-tight">
                Online T-Shirt Store
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Action Icons on Mobile Bar */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* WhatsApp */}
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer from Left */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={closeMobile}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-slate-950 text-slate-300 h-full border-r border-slate-800 shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Close Button Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                Store Menu
              </span>
              <button
                type="button"
                onClick={closeMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
