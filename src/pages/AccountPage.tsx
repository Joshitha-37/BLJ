import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  Clock,
  CheckCircle2,
  RotateCcw,
  Heart,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  ShoppingBag,
  LogOut,
  LogIn,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types/ecommerce';
import { submitReturnRequest } from '../lib/firebase';
import ProductCard from '../components/ProductCard';

type AccountTab =
  | 'profile'
  | 'orders'
  | 'active'
  | 'completed'
  | 'returns'
  | 'wishlist';

export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as AccountTab) || 'orders';
  const [activeTab, setActiveTab] = useState<AccountTab>(activeTabParam);

  const {
    customerOrders,
    savedAddress,
    saveSavedAddress,
    wishlist,
    products,
    currentUser,
    isCustomerLoggedIn,
    loginWithGoogle,
    loginWithEmail,
    registerCustomer,
    logoutCustomer,
    updateCustomerProfile,
    openLoginModal,
    openSignUpModal,
  } = useShop();

  // Return Modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Wrong size received');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string | null>(null);

  // Profile Edit state
  const [profileName, setProfileName] = useState(
    currentUser?.fullName || savedAddress?.fullName || 'Valued Customer'
  );
  const [profileEmail, setProfileEmail] = useState(
    currentUser?.email || savedAddress?.email || ''
  );
  const [profilePhone, setProfilePhone] = useState(
    currentUser?.phone || savedAddress?.phone || ''
  );
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Inline Auth Form State for when unauthenticated
  const [inlineAuthTab, setInlineAuthTab] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.fullName);
      setProfileEmail(currentUser.email);
      if (currentUser.phone) setProfilePhone(currentUser.phone);
    } else if (savedAddress) {
      setProfileName(savedAddress.fullName);
      setProfileEmail(savedAddress.email);
      setProfilePhone(savedAddress.phone);
    }
  }, [currentUser, savedAddress]);

  const handleTabChange = (tab: AccountTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Orders partitioned by status
  const { allOrders, activeOrders, completedOrders, returnOrders } = useMemo(() => {
    const all = customerOrders;
    const active = all.filter((o) =>
      [
        'ORDER PLACED',
        'PAYMENT PENDING',
        'PAYMENT VERIFIED',
        'PROCESSING',
        'SHIPPED',
        'OUT FOR DELIVERY',
      ].includes(o.orderStatus)
    );
    const completed = all.filter((o) =>
      ['DELIVERED', 'COMPLETED'].includes(o.orderStatus)
    );
    const returns = all.filter((o) =>
      ['RETURN REQUESTED', 'RETURN APPROVED', 'RETURN COMPLETED'].includes(o.orderStatus)
    );

    return { allOrders: all, activeOrders: active, completedOrders: completed, returnOrders: returns };
  }, [customerOrders]);

  // Wishlisted products
  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Check if order is eligible for return (within 48 hours of delivery)
  const isReturnEligible = (order: Order) => {
    if (!['DELIVERED', 'COMPLETED'].includes(order.orderStatus)) return false;
    if (order.returnRequest) return false;

    const deliveryTimestamp = order.deliveredAt
      ? new Date(order.deliveredAt).getTime()
      : new Date(order.createdAt).getTime();
    const hoursSinceDelivery = (Date.now() - deliveryTimestamp) / (1000 * 60 * 60);

    return hoursSinceDelivery <= 48;
  };

  const handleOpenReturnModal = (order: Order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('Wrong size received');
    setReturnNotes('');
    setReturnModalOpen(true);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;

    setReturnSubmitting(true);
    try {
      await submitReturnRequest(
        selectedOrderForReturn.id,
        returnReason,
        returnNotes
      );
      setReturnSuccessMessage(
        `Return request for #${selectedOrderForReturn.id} has been submitted. Our team will verify eligibility within 24 hours.`
      );
      setReturnModalOpen(false);
      setSelectedOrderForReturn(null);
      setTimeout(() => setReturnSuccessMessage(null), 6000);
    } catch (err: any) {
      alert('Failed to submit return request: ' + err.message);
    } finally {
      setReturnSubmitting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      await updateCustomerProfile({
        fullName: profileName,
        phone: profilePhone,
      });
    }

    if (savedAddress) {
      saveSavedAddress({
        ...savedAddress,
        fullName: profileName,
        email: profileEmail,
        phone: profilePhone,
      });
    }

    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleInlineGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithEmail(authEmail, authPassword);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to log in.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      await registerCustomer({
        fullName: authFullName,
        email: authEmail,
        phone: authPhone,
        password: authPassword,
      });
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER PLACED':
      case 'PAYMENT PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PAYMENT VERIFIED':
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SHIPPED':
      case 'OUT FOR DELIVERY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RETURN REQUESTED':
      case 'RETURN APPROVED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RETURN COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">Customer Account</span>
            </nav>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              Customer Orders & Profile
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              My Account & Orders
            </h1>
          </div>

          {/* Customer Auth Actions in Header */}
          {isCustomerLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block">
                  {currentUser?.fullName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {currentUser?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={logoutCustomer}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={openLoginModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={openSignUpModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Success Notification */}
        {returnSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{returnSuccessMessage}</span>
          </div>
        )}

        {/* =========================================================
            PROMPT: IF NOT LOGGED IN, SHOW LOGIN/SIGN UP PORTAL
           ========================================================= */}
        {!isCustomerLoggedIn && (
          <div className="mb-8 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Perks of Signing In */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] uppercase tracking-widest font-black text-indigo-400">
                    BLJ Customer Benefits
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Sign in to track your orders & manage fast returns
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Create a free customer account or log in with your Google account. Your orders are securely linked to your account, giving you instant access across all devices.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Real-time Order & Courier Tracking</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>48-Hour Easy Return Claims</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Saved Delivery Addresses</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Private Customer Orders Only</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Inline Quick Login & Sign Up Card */}
              <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
                
                {/* Auth Tabs */}
                <div className="flex border-b border-slate-800 pb-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setInlineAuthTab('login');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      inlineAuthTab === 'login'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Quick Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInlineAuthTab('signup');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      inlineAuthTab === 'signup'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up Free
                  </button>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* 1-Click Google Sign In */}
                <button
                  type="button"
                  onClick={handleInlineGoogleLogin}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-2 text-[10px] uppercase font-bold text-slate-500">
                    Or email
                  </span>
                  <div className="border-t border-slate-800 w-full" />
                </div>

                {inlineAuthTab === 'login' ? (
                  <form onSubmit={handleInlineEmailLogin} className="space-y-2.5 text-xs">
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 outline-hidden focus:border-indigo-500"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 outline-hidden focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      {authLoading ? 'Verifying...' : 'Sign In'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleInlineSignUp} className="space-y-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 outline-hidden focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 outline-hidden focus:border-indigo-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (+91)"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 outline-hidden focus:border-indigo-500"
                    />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Create Password (min 6 chars)"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 outline-hidden focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer mt-1"
                    >
                      {authLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs Bar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              
              {/* User Identity Chip */}
              <div className="p-3 mb-2 rounded-xl bg-slate-900 text-white flex items-center gap-3">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={profileName}
                    className="w-10 h-10 rounded-xl object-cover border border-indigo-400"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-display font-black text-sm">
                    {profileName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="truncate flex-1">
                  <span className="font-display font-bold text-sm block truncate">
                    {profileName}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {profileEmail || 'Guest Shopper'}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <button
                type="button"
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>MY ORDERS</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'orders' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {allOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('active')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>ACTIVE ORDERS</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'active' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {activeOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('completed')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>COMPLETED ORDERS</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'completed' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {completedOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('returns')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'returns'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>RETURN REQUESTS</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'returns' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {returnOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('wishlist')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>WISHLIST</span>
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'wishlist' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {wishlist.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 shrink-0" />
                  <span>MY PROFILE</span>
                </span>
              </button>

            </div>

            {/* Quick Sourcing Assurance Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-indigo-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>48-Hour Return Policy</span>
              </span>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                Completed orders qualify for returns within <strong>48 hours of delivery</strong>. Returned items must retain original packaging and tags.
              </p>
              <Link to="/return-policy" className="font-bold text-indigo-700 underline block pt-1">
                Read Full Return Policy
              </Link>
            </div>
          </div>

          {/* Right Main Tab Content */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. ORDERS / ACTIVE / COMPLETED / RETURNS LIST */}
            {['orders', 'active', 'completed', 'returns'].includes(activeTab) && (
              <div className="space-y-4">
                
                {/* Header for Tab */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-900 capitalize">
                      {activeTab === 'orders' && 'All My Orders'}
                      {activeTab === 'active' && 'Active Orders (In Production / Transit)'}
                      {activeTab === 'completed' && 'Completed Orders'}
                      {activeTab === 'returns' && 'Return Requests'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isCustomerLoggedIn
                        ? `Only showing orders placed under ${currentUser?.email}.`
                        : 'Showing orders placed from this browser.'}
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Shop More</span>
                  </Link>
                </div>

                {/* Orders List Rendering */}
                {(() => {
                  const targetList =
                    activeTab === 'active'
                      ? activeOrders
                      : activeTab === 'completed'
                      ? completedOrders
                      : activeTab === 'returns'
                      ? returnOrders
                      : allOrders;

                  if (targetList.length === 0) {
                    return (
                      <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                        <Package className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="font-display font-bold text-base text-slate-800">
                          No orders found under this category
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          When you place a T-shirt order or receive a delivery, it will appear here in real-time.
                        </p>
                        <Link
                          to="/shop"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span>Explore T-Shirt Range</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  }

                  return targetList.map((order) => {
                    const eligibleForReturn = isReturnEligible(order);

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-sm text-slate-900">
                              #{order.id}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 flex items-center gap-3">
                            <span>
                              Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                            </span>
                            <span>·</span>
                            <span className="font-bold text-slate-900">
                              Total: ₹{order.total}
                            </span>
                          </div>
                        </div>

                        {/* Items inside this order */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-xs">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[11px]">
                                  <span>Selected Size: <strong className="text-slate-900">{item.size}</strong></span>
                                  <span>·</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-bold font-display text-sm text-slate-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Return Request CTA */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 text-slate-500">
                            <span>Payment: <strong className="text-slate-900 capitalize">{order.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Bank Transfer'}</strong></span>
                            <span>·</span>
                            <span>Status: <strong className="text-slate-900">{order.paymentStatus}</strong></span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Return Button */}
                            {eligibleForReturn && (
                              <button
                                type="button"
                                onClick={() => handleOpenReturnModal(order)}
                                className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Request Return (48h Window)</span>
                              </button>
                            )}

                            {order.returnRequest && (
                              <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold text-[11px] flex items-center gap-1">
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Return: {order.returnRequest.status}</span>
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  });
                })()}

              </div>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-900">
                      My Wishlist ({wishlistedProducts.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your saved T-shirts ready for quick size selection and purchase.
                    </p>
                  </div>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-display font-bold text-base text-slate-800">
                      Your Wishlist is Empty
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the heart icon on any T-shirt card while shopping to save it here for later.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Browse T-Shirts</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlistedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    My Profile & Saved Address
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage your personal details and default shipping destination for express checkout.
                  </p>
                </div>

                {profileSavedToast && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Profile details updated successfully.</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        disabled={Boolean(currentUser?.email)}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
                      />
                      {currentUser?.email && (
                        <span className="text-[10px] text-slate-400">Authenticated via {currentUser.provider}.</span>
                      )}
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                      />
                    </div>
                  </div>

                  {savedAddress && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <span className="text-xs font-bold text-slate-900 block">
                        Saved Delivery Address:
                      </span>
                      <p className="text-xs text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        {savedAddress.doorNo}, {savedAddress.street}, {savedAddress.city}, {savedAddress.district}, {savedAddress.state} - {savedAddress.pinCode}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Return Request Modal */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setReturnModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-purple-600">
                  Return Verification Request
                </span>
                <h3 className="font-display text-lg font-black text-slate-900 mt-0.5">
                  Order #{selectedOrderForReturn.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Valid Return Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden bg-white"
                >
                  <option value="Wrong product received">Wrong product received</option>
                  <option value="Wrong size received">Wrong size received</option>
                  <option value="Manufacturing defect or stitching fault">Manufacturing defect or stitching fault</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Describe the Issue in Detail <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Please describe why this item is being returned so our team can approve replacement..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                />
              </div>

              {/* Strict Policy Conditions Notice */}
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
                <p className="font-bold">Mandatory Return Conditions:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-purple-800">
                  <li>Returned product must have all <strong>original packaging</strong> and <strong>original tags intact</strong>.</li>
                  <li>Request must be submitted within <strong>48 hours of delivery</strong>.</li>
                  <li>Return eligibility will be verified before replacement dispatch or store credit.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returnSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {returnSubmitting ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
