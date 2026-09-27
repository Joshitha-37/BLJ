import { useState } from 'react';
import { getInquiryById, InquiryData } from '../lib/firebase';
import { Search, Database, CheckCircle2, Clock, Truck, Layers, MessageCircle, AlertCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

export default function InquiryTracker() {
  const [refInput, setRefInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = refInput.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setInquiry(null);

    try {
      const data = await getInquiryById(trimmed);
      if (data) {
        setInquiry(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatched via Courier</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Job-Work / Finishing in Progress</span>
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Sourcing Review</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Received by Tiruppur Desk</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-indigo-600 mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Cloud Firestore Registry</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            Track Order Inquiry
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
          Live Database Lookup
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 mt-3 mb-5">
        Enter your reference number (e.g. <strong className="font-mono text-slate-900">BLJ-INQ-1234</strong>) to check the real-time sourcing and coordination status recorded in the database.
      </p>

      {/* Track Form */}
      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            placeholder="Enter Reference (e.g. BLJ-INQ-1234)"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-hidden focus:border-indigo-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Searching Database...' : 'Lookup Status'}
        </button>
      </form>

      {/* Result Display */}
      {searched && (
        <div className="mt-6 pt-5 border-t border-slate-200">
          {inquiry ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-slate-900 text-base">
                  #{inquiry.id}
                </span>
                {getStatusBadge(inquiry.status)}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-slate-700">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Garment Style</span>
                  <strong className="font-semibold text-slate-900">{inquiry.garmentType}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Production Format</span>
                  <strong className="font-semibold text-slate-900">{inquiry.printMethod || inquiry.isPrinted}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Quantity</span>
                  <strong className="font-semibold text-slate-900">{inquiry.quantity}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Delivery</span>
                  <strong className="font-semibold text-slate-900">{inquiry.deliveryType}</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <span className="text-slate-500">
                  Customer: <strong className="text-slate-800">{inquiry.customerName}</strong>
                </span>
                <a
                  href={`https://wa.me/919095120925?text=${encodeURIComponent(
                    `Hello Balaji, checking update on inquiry ref: #${inquiry.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact Desk regarding #{inquiry.id}</span>
                </a>
              </div>
            </div>
          ) : notFound ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Reference Not Found in Database</strong>
                <p className="mt-0.5 text-amber-800">
                  We could not locate an active inquiry matching &ldquo;{refInput.toUpperCase()}&rdquo;. Please verify the code or contact Balaji Thiruvengadam at {COMPANY_INFO.phone}.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
