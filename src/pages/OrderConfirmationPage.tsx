import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Mail,
  Truck,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types/ecommerce';
import { getOrderById } from '../lib/firebase';
import { COMPANY_INFO } from '../data/company';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { customerOrders } = useShop();

  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );
  const [loading, setLoading] = useState(!order);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!order && orderId) {
      // First check local customerOrders
      const localMatch = customerOrders.find((o) => o.id === orderId);
      if (localMatch) {
        setOrder(localMatch);
        setLoading(false);
      } else {
        // Fetch from Firestore
        getOrderById(orderId).then((remoteOrder) => {
          setOrder(remoteOrder);
          setLoading(false);
        });
      }
    }
  }, [orderId, order, customerOrders]);

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-sm">Fetching your order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto">
        <h2 className="font-display text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-slate-600 mt-2 text-sm">
          We could not locate this order. Please verify your order number or check My Orders.
        </p>
        <Link
          to="/account"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          <span>Go to My Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const fullAddress = `${order.customer.doorNo}, ${order.customer.street}, ${order.customer.city}, ${order.customer.district}, ${order.customer.state} - ${order.customer.pinCode} (Landmark: ${order.customer.landmark || 'N/A'})`;

  return (
    <div className="py-8 sm:py-16 bg-slate-50 min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Order Confirmed Success Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xs animate-bounce-short">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            ORDER CONFIRMED
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Thank you, {order.customer.fullName}!
          </h1>

          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
            Your T-shirt order has been received and registered directly with our Tiruppur operations hub.
          </p>

          {/* Email Notification Alert Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 max-w-xl mx-auto">
            <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>
              Your order confirmation has been sent to your email (<strong>{order.customer.email}</strong>).
            </span>
          </div>

          {/* Order ID Pill with Copy */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-mono font-bold">
            <span className="text-slate-400 font-sans text-xs">Order Number:</span>
            <span className="text-amber-300 font-black">{order.id}</span>
            <button
              type="button"
              onClick={copyOrderNumber}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/account?tab=orders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-md group"
            >
              <span>VIEW MY ORDERS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Order Specifications
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </span>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Size: {item.size}
                      </span>
                      <span>·</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-slate-900 block">
                    ₹{item.price * item.quantity}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ₹{item.price} each
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Delivery Summary Grid */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Delivery Destination */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Delivery Address
              </span>
              <p className="font-bold text-slate-900">{order.customer.fullName}</p>
              <p className="text-slate-600 leading-relaxed">{fullAddress}</p>
              <p className="text-slate-500 pt-1">
                Phone: <strong>{order.customer.phone}</strong>
              </p>
            </div>

            {/* Payment Mode & Status */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Payment Breakdown
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span className="font-bold text-slate-900">
                  {order.paymentMethod === 'cod' ? 'Pay on Delivery (COD)' : 'Direct Bank Transfer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {order.paymentStatus}
                </span>
              </div>
              {order.utrNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Transaction UTR:</span>
                  <span className="font-mono font-bold text-slate-900">{order.utrNumber}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-display text-sm font-black text-slate-900">
                <span>Total Amount Paid / Payable:</span>
                <span className="text-indigo-600">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Delivery & 48-Hour Return Policy Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>48-Hour Return Policy Reminder:</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Returns are accepted within <strong>48 hours of delivery</strong> only for valid reasons (wrong product or wrong size received). The garment must retain its <strong>original packaging</strong> and <strong>original tags intact</strong>. Return eligibility will be verified by our team.
            </p>
          </div>

          {/* Support Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <span>Need assistance regarding your shipment?</span>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
