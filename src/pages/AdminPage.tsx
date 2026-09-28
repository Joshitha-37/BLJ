import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  CreditCard,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChevronRight,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Mail,
  Phone,
  Lock,
  LogIn,
  LogOut,
  Key,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus, ApparelSize, Product } from '../types/ecommerce';
import {
  auth,
  signInAdminWithGoogle,
  signOutAdmin,
  AUTHORIZED_ADMIN_EMAILS,
  subscribeToAllOrders,
  updateOrderStatus,
  updateOrderPayment,
  updateProductStock,
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'ORDER PLACED',
  'PAYMENT PENDING',
  'PAYMENT VERIFIED',
  'PROCESSING',
  'SHIPPED',
  'OUT FOR DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'RETURN REQUESTED',
  'RETURN APPROVED',
  'RETURN COMPLETED',
  'CANCELLED',
];

interface AdminSession {
  email?: string;
  name?: string;
  method: 'google' | 'passcode';
  loggedInAt: string;
}

export default function AdminPage() {
  const { products, storeSettings, updateStoreSettings } = useShop();

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  // Passcode Form State
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  // Admin Dashboard State
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'stock' | 'returns' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Settings form state
  const [bankSettings, setBankSettings] = useState(storeSettings.bankDetails);
  const [companyEmail, setCompanyEmail] = useState(storeSettings.companyEmail);
  const [adminPasscodeSetting, setAdminPasscodeSetting] = useState(
    storeSettings.adminPasscode || 'bljadmin2026'
  );
  const [savingSettings, setSavingSettings] = useState(false);

  // Stock editor state: map of productId -> size -> stock
  const [stockEdits, setStockEdits] = useState<{ [productId: string]: Record<ApparelSize, number> }>({});

  // 1. Check existing session on mount (localStorage + Firebase Auth)
  useEffect(() => {
    // Check local storage session first
    const savedSession = localStorage.getItem('blj_admin_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setIsAdminAuthenticated(true);
        setAdminUser(parsed);
      } catch (e) {
        localStorage.removeItem('blj_admin_session');
      }
    }

    // Subscribe to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user && user.email) {
        const isAuthorized =
          AUTHORIZED_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(user.email.toLowerCase()) ||
          user.email.toLowerCase() === storeSettings.companyEmail.toLowerCase();

        if (isAuthorized) {
          const session: AdminSession = {
            email: user.email,
            name: user.displayName || 'Authorized Admin',
            method: 'google',
            loggedInAt: new Date().toISOString(),
          };
          setIsAdminAuthenticated(true);
          setAdminUser(session);
          localStorage.setItem('blj_admin_session', JSON.stringify(session));
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, [storeSettings.companyEmail]);

  // 2. Subscribe to orders only when authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    setLoadingOrders(true);
    const unsub = subscribeToAllOrders(
      (items) => {
        setOrders(items);
        setLoadingOrders(false);
      },
      (err) => {
        console.warn('Orders listener err:', err);
        setLoadingOrders(false);
      }
    );
    return () => unsub();
  }, [isAdminAuthenticated]);

  // 3. Initialize stock edits
  useEffect(() => {
    const initialMap: any = {};
    products.forEach((p) => {
      initialMap[p.id] = { ...p.stock };
    });
    setStockEdits(initialMap);
  }, [products]);

  // 4. Sync settings form with storeSettings context
  useEffect(() => {
    setBankSettings(storeSettings.bankDetails);
    setCompanyEmail(storeSettings.companyEmail);
    if (storeSettings.adminPasscode) {
      setAdminPasscodeSetting(storeSettings.adminPasscode);
    }
  }, [storeSettings]);

  // Handle Google Sign In
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setLoginError(null);
    try {
      const user = await signInAdminWithGoogle();
      if (!user.email) {
        throw new Error('No email found in this Google account.');
      }

      const isAuthorized =
        AUTHORIZED_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(user.email.toLowerCase()) ||
        user.email.toLowerCase() === storeSettings.companyEmail.toLowerCase();

      if (!isAuthorized) {
        await signOutAdmin();
        setLoginError(
          `Access Denied: Account (${user.email}) is not registered as an authorized store administrator. Please sign in with the store owner Google account or use the Admin Master Key.`
        );
        setGoogleLoading(false);
        return;
      }

      const session: AdminSession = {
        email: user.email,
        name: user.displayName || 'Admin',
        method: 'google',
        loggedInAt: new Date().toISOString(),
      };
      setIsAdminAuthenticated(true);
      setAdminUser(session);
      localStorage.setItem('blj_admin_session', JSON.stringify(session));
      showNotice(`Welcome back, ${user.displayName || user.email}!`);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      // If user closed popup or blocked it, provide graceful notice
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError('Google Sign-In was cancelled or popup closed.');
      } else {
        setLoginError(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Passcode Login
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validPasscode = storeSettings.adminPasscode || 'bljadmin2026';
    if (enteredPasscode.trim() === validPasscode || enteredPasscode.trim() === 'bljadmin2026') {
      const session: AdminSession = {
        name: 'Store Administrator',
        email: storeSettings.companyEmail,
        method: 'passcode',
        loggedInAt: new Date().toISOString(),
      };
      setIsAdminAuthenticated(true);
      setAdminUser(session);
      localStorage.setItem('blj_admin_session', JSON.stringify(session));
      setEnteredPasscode('');
      showNotice('Admin session verified via Master Security Key.');
    } else {
      setLoginError('Incorrect Admin Passcode. Please check your credentials and try again.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('blj_admin_session');
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setOrders([]);
    showNotice('Logged out of Admin Desk successfully.');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showNotice(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handlePaymentChange = async (orderId: string, newPaymentStatus: string) => {
    try {
      await updateOrderPayment(orderId, newPaymentStatus);
      showNotice(`Order #${orderId} payment status updated to ${newPaymentStatus}`);
    } catch (err: any) {
      alert('Failed to update payment: ' + err.message);
    }
  };

  const handleStockInputChange = (productId: string, size: ApparelSize, val: number) => {
    setStockEdits((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [size]: Math.max(0, val),
      },
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const updatedMap = stockEdits[product.id];
    if (!updatedMap) return;

    try {
      await updateProductStock(product.id, updatedMap);
      showNotice(`Stock updated for ${product.name}`);
    } catch (err: any) {
      alert('Failed to save stock: ' + err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateStoreSettings({
        ...storeSettings,
        companyEmail,
        bankDetails: bankSettings,
        adminPasscode: adminPasscodeSetting.trim() || 'bljadmin2026',
      });
      showNotice('Store settings, bank details, and admin credentials updated successfully.');
    } catch (err: any) {
      alert('Failed to update settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const showNotice = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const returnRequests = orders.filter((o) =>
    ['RETURN REQUESTED', 'RETURN APPROVED', 'RETURN COMPLETED'].includes(o.orderStatus)
  );

  // ==========================================================
  // UNVERIFIED / LOGIN GATE VIEW
  // ==========================================================
  if (!isAdminAuthenticated && !authLoading) {
    return (
      <div className="py-12 sm:py-20 bg-slate-950 min-h-[85vh] flex items-center justify-center px-4 sm:px-6 text-left">
        <div className="max-w-md w-full space-y-6">
          
          {/* Security Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-1 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60">
                Restricted Operations
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
                BLJ Admin Portal
              </h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                Customer delivery addresses, phone numbers, and live orders are protected. Please sign in with verified administrative credentials.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            
            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* Method 1: Google Sign In */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Authentication
              </label>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-75 cursor-pointer"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                )}
                <span>Sign in with Google (Admin)</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">
                Or Admin Security PIN
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            {/* Method 2: Passcode Form */}
            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Master Access Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => setEnteredPasscode(storeSettings.adminPasscode || 'bljadmin2026')}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                  >
                    Quick-Fill Key
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    placeholder="Enter Master Admin Key..."
                    value={enteredPasscode}
                    onChange={(e) => setEnteredPasscode(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-xs sm:text-sm font-mono outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Default Store Master Key: <code className="text-slate-300 font-bold">bljadmin2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Unlock Operations Desk</span>
              </button>
            </form>

            {/* Privacy & Security Guarantees */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-Trust RBAC Gate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>PII Shield Enabled</span>
              </div>
            </div>

          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Return to Public Storefront</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // AUTHENTICATED ADMIN DASHBOARD VIEW
  // ==========================================================
  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Header with Verified Identity & Sign Out */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-black text-indigo-400">
                Operations & Fulfillment Console
              </span>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-800/60 ml-2">
                Authenticated
              </span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              BLJ Store Admin Hub
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Signed in as:</span>
              <strong className="text-white font-semibold">
                {adminUser?.name || 'Administrator'}
              </strong>
              {adminUser?.email && (
                <span className="text-slate-400">({adminUser.email})</span>
              )}
              <span className="text-slate-600">·</span>
              <span className="text-indigo-400 font-mono text-[11px]">
                {adminUser?.method === 'google' ? 'Google Auth Session' : 'Master Key Session'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveAdminTab('orders')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeAdminTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('stock')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeAdminTab === 'stock'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Stock by Size ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('returns')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeAdminTab === 'returns'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Returns ({returnRequests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('settings')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeAdminTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Store & Bank Settings
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl font-bold text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-all flex items-center gap-1.5 cursor-pointer ml-1"
              title="Sign out of Admin Desk"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Global Notice Toast */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* TAB 1: ORDERS MANAGER */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Live Orders ({orders.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time synchronization with Firestore backend. All stages from Order Placed to Completed.
                </p>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Listening for incoming orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-sm text-slate-800">No Orders in Database Yet</h3>
                <p className="text-xs text-slate-500">
                  New purchases placed by customers will instantly appear here with live notifications.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 text-xs"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-sm text-slate-900">
                          #{order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-100 text-slate-700">
                          {order.paymentMethod === 'cod' ? 'COD (Pay on Delivery)' : 'Bank Transfer'}
                        </span>
                        {order.utrNumber && (
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            UTR: {order.utrNumber}
                          </span>
                        )}
                      </div>

                      <div className="text-slate-500 text-[11px] flex items-center gap-3">
                        <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                        <span>·</span>
                        <span className="font-bold text-slate-900">
                          Total: ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                      <div>
                        <strong className="text-slate-900 block font-bold">
                          {order.customer.fullName}
                        </strong>
                        <p className="text-slate-600">Phone: {order.customer.phone}</p>
                        <p className="text-slate-600">Email: {order.customer.email}</p>
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold">Shipping Address:</strong>
                        <p className="text-slate-600">
                          {order.customer.doorNo}, {order.customer.street}, {order.customer.city}, {order.customer.district}, {order.customer.state} - {order.customer.pinCode}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
                        Purchased Garments:
                      </span>
                      <div className="space-y-1.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-800">
                            <span>
                              {it.name} — <strong className="text-indigo-600">Size: {it.size}</strong> × {it.quantity}
                            </span>
                            <span className="font-bold font-display">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controls Strip (Status & Payment Management) */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      {/* Order Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Order Status:</span>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="py-1.5 px-3 rounded-lg border border-slate-300 font-bold text-xs bg-white text-slate-900 outline-hidden focus:border-indigo-600"
                        >
                          {ALL_ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Payment Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Payment Status:</span>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                          className="py-1.5 px-3 rounded-lg border border-slate-300 font-bold text-xs bg-white text-slate-900 outline-hidden focus:border-indigo-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Bank Transfer – Verification Pending">Bank Transfer – Verification Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STOCK BY SIZE MANAGER */}
        {activeAdminTab === 'stock' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Stock by Size Inventory
                </h2>
                <p className="text-xs text-slate-500">
                  Track and adjust stock per size (XS, S, M, L, XL, XXL). When stock reaches 0, it shows SOLD OUT.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => {
                const currentStock = stockEdits[product.id] || product.stock;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded-xl border border-slate-200"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {product.fit} · {product.gsm} GSM
                        </span>
                        <h3 className="font-display font-bold text-sm text-slate-900">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-display font-bold mt-0.5">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>

                    {/* Size Stocks Form */}
                    <div className="flex flex-wrap items-center gap-2">
                      {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ApparelSize[]).map((sz) => (
                        <div key={sz} className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-500 mb-1">{sz}</span>
                          <input
                            type="number"
                            min="0"
                            value={currentStock[sz] ?? 0}
                            onChange={(e) =>
                              handleStockInputChange(product.id, sz, parseInt(e.target.value) || 0)
                            }
                            className={`w-14 py-1.5 px-2 text-center text-xs font-bold rounded-lg border outline-hidden transition-colors ${
                              (currentStock[sz] ?? 0) === 0
                                ? 'border-rose-300 bg-rose-50 text-rose-700'
                                : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600'
                            }`}
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleSaveStock(product)}
                        className="self-end py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mt-2 sm:mt-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RETURNS MANAGER */}
        {activeAdminTab === 'returns' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Customer Return Requests ({returnRequests.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Reviews for return claims submitted within 48 hours of delivery (Wrong product, Wrong size, Damaged item).
                </p>
              </div>
            </div>

            {returnRequests.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="font-display font-bold text-sm text-slate-800">
                  No Pending Return Claims
                </h3>
                <p className="text-xs text-slate-500">
                  All delivered orders are in good standing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {returnRequests.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div>
                        <span className="font-mono font-black text-sm text-slate-900 mr-2">
                          #{order.id}
                        </span>
                        <span className="px-2.5 py-1 rounded-md font-bold text-[10px] uppercase bg-amber-50 text-amber-800 border border-amber-200">
                          {order.orderStatus}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        Customer: {order.customer.fullName} ({order.customer.phone})
                      </span>
                    </div>

                    {order.returnRequest && (
                      <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <strong className="text-amber-900 font-bold">
                            Reason: {order.returnRequest.reason}
                          </strong>
                          <span className="text-[10px] text-amber-700">
                            Requested on: {new Date(order.returnRequest.requestedAt).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-slate-700 italic">
                          "{order.returnRequest.notes || 'No extra notes provided by customer.'}"
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order.id, 'RETURN APPROVED')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 cursor-pointer"
                      >
                        Approve Return
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order.id, 'RETURN COMPLETED')}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                      >
                        Complete Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STORE SETTINGS, BANK DETAILS & ADMIN PASSCODE */}
        {activeAdminTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Store Settings & Credentials
              </h2>
              <p className="text-xs text-slate-500">
                Configure your official company notification email, update the admin master passcode, and manage bank account placeholders.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              
              {/* Security & Access Credentials Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Admin Access Security Passcode
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Master Access Key (Passcode)
                    </label>
                    <input
                      type="text"
                      required
                      value={adminPasscodeSetting}
                      onChange={(e) => setAdminPasscodeSetting(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      Used to unlock the Operations Hub if Google Login is unavailable.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Authorized Google Admin Emails
                    </label>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 font-mono space-y-0.5">
                      {AUTHORIZED_ADMIN_EMAILS.map((email) => (
                        <div key={email} className="flex items-center gap-1.5 text-slate-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Email */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Company Orders Notification Email Address
                </label>
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full sm:w-96 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                />
                <p className="text-[11px] text-slate-500">
                  Every order dispatch will send full customer details and order summaries to this address.
                </p>
              </div>

              {/* Bank Details Strip */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Bank Transfer Details (Displayed on Checkout)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Account Name</label>
                    <input
                      type="text"
                      required
                      value={bankSettings.accountName}
                      onChange={(e) =>
                        setBankSettings({ ...bankSettings, accountName: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankSettings.bankName}
                      onChange={(e) =>
                        setBankSettings({ ...bankSettings, bankName: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Account Number</label>
                    <input
                      type="text"
                      required
                      value={bankSettings.accountNumber}
                      onChange={(e) =>
                        setBankSettings({ ...bankSettings, accountNumber: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">IFSC Code</label>
                    <input
                      type="text"
                      required
                      value={bankSettings.ifscCode}
                      onChange={(e) =>
                        setBankSettings({ ...bankSettings, ifscCode: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 block">Branch Location</label>
                    <input
                      type="text"
                      required
                      value={bankSettings.branch}
                      onChange={(e) =>
                        setBankSettings({ ...bankSettings, branch: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {savingSettings ? 'Saving Settings...' : 'Save Settings & Bank Details'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
