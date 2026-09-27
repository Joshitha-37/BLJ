import PageHeader from '../components/PageHeader';
import QuickInquiry from '../components/QuickInquiry';
import InquiryTracker from '../components/InquiryTracker';
import { COMPANY_INFO } from '../data/company';
import { Phone, MessageCircle, Mail } from 'lucide-react';

export default function InquiryPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Quick Sourcing Inquiry"
        subtitle="Configure your garment preference, choose plain blanks or custom print options, and send directly to Balaji Thiruvengadam."
        breadcrumb="Quick Inquiry"
      />

      <div className="py-8">
        <QuickInquiry />
      </div>

      {/* Real-Time Database Tracking Desk */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <InquiryTracker />
      </div>

      {/* Support Strip */}
      <div className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Prefer Direct Communication?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            You can call or text Balaji Thiruvengadam directly to discuss urgent lots, specific fabric knit requirements, or courier logistics.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
