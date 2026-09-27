import { PRINTING_CAPABILITIES, COMPANY_INFO } from '../data/company';
import { Sparkles, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';

export default function PrintingJobWork() {
  return (
    <section id="printing" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
            Surface Embellishment
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Job-Work Printing Coordination
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg">
            We partner with skilled job-work printing units across Tiruppur to deliver durable, wash-resistant, and high-impact custom prints onto plain sourced garments.
          </p>
        </div>

        {/* 4 Printing Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRINTING_CAPABILITIES.map((item, idx) => (
            <div
              key={item.name}
              className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-indigo-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-700/80 text-indigo-300 flex items-center justify-center font-bold text-sm mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-indigo-300 font-semibold flex items-center justify-between">
                <span>Job-work coordinated</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Direct Printing Consultation Banner */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900/60 to-slate-800 rounded-2xl border border-indigo-700/50 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h4 className="font-display text-xl font-bold text-white">
              Have existing artwork or need a specific printing effect?
            </h4>
            <p className="text-sm text-slate-300 max-w-2xl">
              Send your design file to Balaji Thiruvengadam. We will coordinate directly with the right printing specialist in Tiruppur for sampling and bulk execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share Artwork on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Call Sourcing Desk</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
