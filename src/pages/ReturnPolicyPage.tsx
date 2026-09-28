import { Link } from 'react-router-dom';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Package,
  Tag,
  Clock,
  ShieldCheck,
  ChevronRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

export default function ReturnPolicyPage() {
  return (
    <div className="py-8 sm:py-16 bg-slate-50 min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Return Policy</span>
          </nav>
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            Transparent Sourcing & Fulfillment Guidelines
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Customer Return & Replacement Policy
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            At <strong>{COMPANY_INFO.name}</strong>, our garments are manufactured and inspected with strict quality controls in Tiruppur. We maintain a fair, transparent return policy to protect our buyers while ensuring genuine handling of product concerns.
          </p>
        </div>

        {/* 3 Core Rules Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            <h3 className="font-display font-bold text-base text-slate-900">
              48 Hours of Delivery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All return or replacement requests must be registered through your account within <strong>48 hours</strong> of courier delivery.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <Tag className="w-6 h-6 text-indigo-600" />
            <h3 className="font-display font-bold text-base text-slate-900">
              Original Tags & Packaging
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Garments must be unworn, unwashed, and retained with all original brand tags, labels, and protective polybag packaging intact.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-display font-bold text-base text-slate-900">
              Eligibility Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every request is manually reviewed by our quality team before reverse pickup or replacement dispatch is scheduled.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          {/* Section 1: Valid Reasons */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>1. Valid Reasons for Returns</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To prevent misuse, returns and size-replacements are accepted exclusively for valid and verifiable reasons:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <strong className="text-slate-900 block">Wrong Product Received</strong>
                <p className="text-slate-600">The delivered garment differs in design, colorway, or specification from the confirmed order.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <strong className="text-slate-900 block">Wrong Size Received</strong>
                <p className="text-slate-600">The delivered garment label differs from the size selected (XS / S / M / L / XL / XXL) during checkout.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <strong className="text-slate-900 block">Manufacturing or Stitching Defect</strong>
                <p className="text-slate-600">Visible fabric tears, uneven hemline, or stitching unravelling identified immediately upon opening.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <strong className="text-slate-900 block">Transit Damage</strong>
                <p className="text-slate-600">Parcel or polybag opened or punctured during courier transit, affecting garment condition.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Non-Eligible Conditions */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>2. Non-Eligible Items & Conditions</span>
            </h2>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-2">
              <li>Requests submitted later than <strong>48 hours</strong> following verified courier delivery confirmation.</li>
              <li>Garments showing signs of wear, body odor, perfume, deodorant stains, or washing.</li>
              <li>Garments missing their original hang tags, neck labels, or inner packaging.</li>
              <li>Items purchased under final clearance or customized print-on-demand job works.</li>
            </ul>
          </div>

          {/* Section 3: Verification & Settlement */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>3. Verification & Replacement Process</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Once your request is submitted via <strong>My Account → Completed Orders</strong>:
            </p>
            <ol className="list-decimal pl-5 text-xs sm:text-sm text-slate-600 space-y-2">
              <li>Our Tiruppur operations desk inspects your submitted order details and reason.</li>
              <li>Upon approval (usually within 24-48 hours), reverse courier pickup is arranged.</li>
              <li>Once the returned item is received and physically verified for intact tags and packaging, a replacement garment is dispatched or store credit is provided as agreed.</li>
              <li><em>Note:</em> In accordance with standard apparel guidelines, refunds are issued strictly upon physical verification of eligibility.</li>
            </ol>
          </div>

          {/* Section 4: How to Initiate a Return */}
          <div className="pt-6 border-t border-slate-100 p-5 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-3">
            <h3 className="font-display font-bold text-sm text-indigo-950">
              How to Submit a Return Request:
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed">
              1. Log into your account and open the <strong>COMPLETED ORDERS</strong> tab.<br />
              2. Click <strong>"Request Return (48h Window)"</strong> next to the delivered order.<br />
              3. Choose your reason, describe the discrepancy, and submit.<br />
              4. You will receive email updates and an acknowledgment directly from our desk.
            </p>
            <div className="pt-2">
              <Link
                to="/account?tab=completed"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                <span>Go to Completed Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
