import { Phone, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
      {/* Quick WhatsApp Float */}
      <a
        href={COMPANY_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          WhatsApp Desk
        </span>
      </a>

      {/* Quick Call Float (mobile especially) */}
      <a
        href={`tel:${COMPANY_INFO.phoneRaw}`}
        aria-label="Call Balaji Thiruvengadam"
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group border border-slate-700 sm:hidden"
      >
        <Phone className="w-5 h-5 text-indigo-400" />
      </a>
    </div>
  );
}
