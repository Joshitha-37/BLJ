import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Info,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DeliveryAddress, PaymentMethod } from '../types/ecommerce';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    savedAddress,
    placeOrder,
    storeSettings,
    currentUser,
    isCustomerLoggedIn,
    openLoginModal,
    openSignUpModal,
    loginWithGoogle,
  } = useShop();

  // Step 1: Delivery form state
  const [formData, setFormData] = useState<DeliveryAddress>(() => ({
    fullName: currentUser?.fullName || savedAddress?.fullName || '',
    phone: currentUser?.phone || savedAddress?.phone || '',
    email: currentUser?.email || savedAddress?.email || '',
    doorNo: currentUser?.address?.doorNo || savedAddress?.doorNo || '',
    street: currentUser?.address?.street || savedAddress?.street || '',
    city: currentUser?.address?.city || savedAddress?.city || '',
    district: currentUser?.address?.district || savedAddress?.district || '',
    state: currentUser?.address?.state || savedAddress?.state || '',
    pinCode: currentUser?.address?.pinCode || savedAddress?.pinCode || '',
    landmark: currentUser?.address?.landmark || savedAddress?.landmark || '',
  }));

  // Auto-sync form when customer logs in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        fullName: prev.fullName || currentUser.fullName || '',
        phone: prev.phone || currentUser.phone || '',
        email: currentUser.email || prev.email || '',
        doorNo: prev.doorNo || currentUser.address?.doorNo || '',
        street: prev.street || currentUser.address?.street || '',
        city: prev.city || currentUser.address?.city || '',
        district: prev.district || currentUser.address?.district || '',
        state: prev.state || currentUser.address?.state || '',
        pinCode: prev.pinCode || currentUser.address?.pinCode || '',
        landmark: prev.landmark || currentUser.address?.landmark || '',
      }));
    }
  }, [currentUser]);

  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [utrNumber, setUtrNumber] = useState('');

  // Mandatory Policy agreement checkbox
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto text-center">
        <h2 className="font-display text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-600 mt-2 text-sm">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          <span>Shop T-Shirts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Mandatory Customer Account Gate
    if (!isCustomerLoggedIn || !currentUser) {
      setErrorMessage('Account required: Please log in or create an account before placing your order.');
      openLoginModal('Please log in or create an account to finalize your order.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 1. Validate Delivery Information
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.doorNo.trim() ||
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.district.trim() ||
      !formData.state.trim() ||
      !formData.pinCode.trim()
    ) {
      setErrorMessage('Please fill in all mandatory delivery address fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Phone validation
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    // Email validation
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please enter a valid email address for order confirmation.');
      return;
    }

    // 2. Validate Payment Choice
    if (paymentMethod === 'bank_transfer' && !utrNumber.trim()) {
      setErrorMessage('Please enter your Bank Transfer Transaction Reference / UTR Number.');
      return;
    }

    // 3. Validate Agreement Checkbox
    if (!agreedToPolicies) {
      setErrorMessage(
        'You must acknowledge and agree to the Terms & Conditions, Delivery Policy, and 48-Hour Return Policy to proceed.'
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const res = await placeOrder(
      formData,
      paymentMethod,
      paymentMethod === 'bank_transfer' ? utrNumber : undefined
    );

    if (res.success && res.order) {
      navigate(`/order-confirmed/${res.order.id}`, { state: { order: res.order } });
    } else {
      setErrorMessage(res.error || 'Failed to process order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/cart" className="hover:text-slate-900 transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Checkout</span>
          </nav>
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            Secure Order Finalization
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Complete Your T-Shirt Order
          </h1>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Attention Required:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: STEP 1 (Address) & STEP 3 (Payment) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* ==================================================
                  STEP 1: DELIVERY INFORMATION
              ================================================== */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-slate-900">
                        Delivery Information
                      </h2>
                      <p className="text-xs text-slate-500">
                        Where should we courier your Tiruppur T-shirts?
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Doorstep Delivery
                  </span>
                </div>

                {/* Customer Account Gate & Status Banner */}
                {isCustomerLoggedIn && currentUser ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {currentUser.fullName}
                          </span>
                          <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                            Verified Customer
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          Account: <strong>{currentUser.email}</strong> • Your order will be placed and linked to your account for live tracking & invoice history.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-300 rounded-2xl shadow-xs space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-black text-slate-900 text-sm sm:text-base">
                            Account Required to Place Order
                          </h3>
                          <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Anyone can browse, add to wishlist, and view cart freely. However, to complete and dispatch your order, you must log in or create an account. If you already have an account, please log in below.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => openLoginModal('Please log in to finalize your order.')}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Log In to Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openSignUpModal('Please create an account to finalize your order.')}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Create New Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await loginWithGoogle();
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>1-Click Google Sign In</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Phone Number (For Delivery Partner) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Email Address (For Order Confirmation & Invoice) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* House / Flat / Door Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      House / Flat / Door Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 302, Green Apartments / Door No. 16"
                      value={formData.doorNo}
                      onChange={(e) => handleInputChange('doorNo', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* Street / Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Street / Area / Colony <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2nd Cross, Seeyaan Kaadu"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      City / Town <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tiruppur / Coimbatore / Chennai"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tiruppur District"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tamil Nadu, Karnataka, Maharashtra"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* PIN Code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit postal code"
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Landmark (Optional, helps courier partner)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Karumaram Palayam Temple / Opposite Bus Stand"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================
                  STEP 3: PAYMENT OPTIONS (TWO OPTIONS ONLY)
              ================================================== */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-sm">
                      3
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-slate-900">
                        Payment Selection
                      </h2>
                      <p className="text-xs text-slate-500">
                        Choose your preferred mode of settlement (₹ INR)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* OPTION 2 — PAY ON DELIVERY (FIRST FOR QUICK BUYING) */}
                  <label
                    className={`block p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>OPTION 2 — Pay on Delivery</span>
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            Cash / UPI on Arrival
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Customer pays the order amount (<strong>₹{cartTotal}</strong>) to the delivery partner before receiving the ordered items.
                        </p>
                        <div className="pt-2 text-[11px] text-slate-500">
                          Payment Status: <strong className="text-amber-600">Pending</strong> (settled upon courier delivery).
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* OPTION 1 — BANK TRANSFER */}
                  <label
                    className={`block p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                            <Building className="w-4 h-4 text-indigo-600" />
                            <span>OPTION 1 — Direct Bank Transfer</span>
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                            NEFT / IMPS / RTGS
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Customer can pay the order amount (<strong>₹{cartTotal}</strong>) through direct bank transfer using the account details below.
                        </p>

                        {/* Configured Editable Placeholders for Bank Details */}
                        {paymentMethod === 'bank_transfer' && (
                          <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2.5 text-xs font-mono">
                            <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-sans pb-1.5 border-b border-slate-800">
                              <span>Official Beneficiary Account</span>
                              <span className="text-amber-400 font-bold">Transfer ₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Account Name:</span>
                              <span className="font-bold text-white">{storeSettings.bankDetails.accountName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Bank Name:</span>
                              <span className="font-bold text-white">{storeSettings.bankDetails.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Account Number:</span>
                              <span className="font-bold text-amber-300">{storeSettings.bankDetails.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">IFSC Code:</span>
                              <span className="font-bold text-white">{storeSettings.bankDetails.ifscCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Branch:</span>
                              <span className="font-bold text-white">{storeSettings.bankDetails.branch}</span>
                            </div>

                            {/* UTR Input Field */}
                            <div className="pt-3 border-t border-slate-800 space-y-1 font-sans">
                              <label className="text-[11px] font-bold text-slate-200 block">
                                Enter Transaction Reference / UTR Number <span className="text-rose-400">*</span>
                              </label>
                              <input
                                type="text"
                                required={paymentMethod === 'bank_transfer'}
                                placeholder="e.g. 238910293812 or UPI Ref ID"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-400 outline-hidden font-mono"
                              />
                              <p className="text-[10px] text-slate-400 pt-0.5">
                                Order status will be set to: <strong>Bank Transfer – Verification Pending</strong>.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* ==================================================
                  MANDATORY POLICIES & TERMS CHECKBOX
              ================================================== */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToPolicies}
                    onChange={(e) => {
                      setAgreedToPolicies(e.target.checked);
                      if (e.target.checked) setErrorMessage(null);
                    }}
                    className="mt-1 w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">
                      I have read and agree to the Terms & Conditions, Delivery Policy and Return Policy.
                    </span>
                    <p className="text-slate-500 mt-1">
                      I understand that returns are accepted within <strong>48 hours of delivery</strong> only for valid reasons (wrong product or wrong size received) with original packaging and tags intact. Eligibility is verified prior to replacement.
                    </p>
                  </div>
                </label>
              </div>

            </div>

            {/* Right Column: STEP 2 (Order Review) & Final CTA */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* ==================================================
                  STEP 2: ORDER REVIEW
              ================================================== */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 text-left sticky top-20">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-display font-black text-xs">
                    2
                  </div>
                  <h2 className="font-display font-bold text-base text-slate-900">
                    Order Review ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
                  </h2>
                </div>

                {/* Products Items List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                            Size: {item.selectedSize}
                          </span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <span className="text-[11px] text-slate-700 font-semibold">
                          ₹{item.price} each
                        </span>
                      </div>
                      <div className="text-right font-display font-bold text-slate-900">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-slate-800">₹{cartSubtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Courier Delivery:</span>
                    <span className="font-bold text-slate-800">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 uppercase font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <div>
                      <span className="font-display font-black text-base text-slate-900 block">
                        Final Total:
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Currency: Indian Rupee (₹ INR)
                      </span>
                    </div>
                    <span className="font-display text-2xl font-black text-indigo-600">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>

                {/* Final Submit / Account Required CTA Button */}
                <div className="pt-2 space-y-2">
                  {!isCustomerLoggedIn || !currentUser ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(
                            'Account required: Please log in or create an account to finalize your order.'
                          );
                          openLoginModal('Please log in or create an account to finalize your order.');
                        }}
                        className="w-full py-4 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-slate-950" />
                        <span>LOG IN OR SIGN UP TO ORDER (₹{cartTotal})</span>
                      </button>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 text-center font-medium">
                        A verified customer account is required before placing your order.
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        {submitting ? (
                          <span>Placing Your Order...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>CONFIRM & PLACE ORDER (₹{cartTotal})</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-slate-400 mt-2">
                        Confirmation email will be dispatched to <strong>{formData.email || currentUser.email}</strong> upon placement.
                      </p>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
