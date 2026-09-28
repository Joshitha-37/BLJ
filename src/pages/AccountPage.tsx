import { useState, useMemo } from 'react';
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
  } = useShop();

  // Return Modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Wrong size received');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string | null>(null);

  // Profile Edit state
  const [profileName, setProfileName] = useState(savedAddress?.fullName || 'Valued Customer');
  const [profileEmail, setProfileEmail] = useState(savedAddress?.email || '');
  const [profilePhone, setProfilePhone] = useState(savedAddress?.phone || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

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
        `Return request for ${selectedOrderForReturn.id} has been submitted. Our team will verify eligibility within 24 hours.`
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Customer Account</span>
          </nav>
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            Self-Service Customer Desk
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Account & Orders
          </h1>
        </div>

        {/* Global Success Notification */}
        {returnSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{returnSuccessMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs Bar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              
              {/* User Identity Chip */}
              <div className="p-3 mb-2 rounded-xl bg-slate-900 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-display font-black text-sm">
                  {profileName.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="truncate">
                  <span className="font-display font-bold text-sm block truncate">
                    {profileName}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {profileEmail || 'Customer Account'}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <button
                type="button"
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                      {activeTab === 'orders' && 'All Customer Orders'}
                      {activeTab === 'active' && 'Active Orders (In Production / Transit)'}
                      {activeTab === 'completed' && 'Completed Orders'}
                      {activeTab === 'returns' && 'Return Requests'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing orders tied to your account session.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
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
                          When you place a T-shirt order or receive a delivery, it will appear here.
                        </p>
                        <Link
                          to="/shop"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
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

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                                />
                                <div>
                                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                                  <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                                    <span className="font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                                      Size: {item.size}
                                    </span>
                                    <span>·</span>
                                    <span>Qty: {item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="font-display font-bold text-slate-800">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Actions */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                          <div className="text-slate-500 text-[11px]">
                            <span>Payment: <strong>{order.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Bank Transfer'}</strong> ({order.paymentStatus})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Request Return button (only for completed orders within 48h) */}
                            {eligibleForReturn && (
                              <button
                                type="button"
                                onClick={() => handleOpenReturnModal(order)}
                                className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition-colors text-xs"
                              >
                                Request Return (48h Window)
                              </button>
                            )}

                            {order.returnRequest && (
                              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                                Return Requested: {order.returnRequest.reason}
                              </span>
                            )}

                            <Link
                              to={`/order-confirmed/${order.id}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-xs"
                            >
                              View Invoice
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })
                })()}

              </div>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-900">
                      Saved Wishlist ({wishlistedProducts.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your favorite T-shirts saved for later.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    <span>Browse More</span>
                  </Link>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-display font-bold text-base text-slate-800">
                      Your wishlist is empty
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the heart icon on any T-shirt card to save it to your wishlist.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                    >
                      <span>Explore T-Shirts</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    My Customer Profile
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage your contact details and default delivery address.
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
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                      />
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
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs"
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returnSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs"
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
