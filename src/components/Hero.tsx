import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, ArrowRight, ShieldCheck, Truck, Sparkles, Layers } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Subtle Textile Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy with Perfect Alignment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{COMPANY_INFO.address.shortLocation} · Tiruppur Knitwear Hub</span>
            </div>

            {/* Brand Title & Tagline - Crisp Alignment */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-sm sm:text-base tracking-wider shrink-0 shadow-md">
                  BLJ
                </div>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  {COMPANY_INFO.name}
                </h1>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-indigo-400 tracking-wide pl-0 sm:pl-1 mt-2">
                {COMPANY_INFO.tagline}
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Specialized T-shirt and apparel sourcing from Tiruppur. We procure premium plain garments, coordinate professional job-work printing, and supply finished orders directly to your doorstep with convenient Pay on Delivery arrangements.
            </p>

            {/* Direct Working Action Buttons (Prompt requested) */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
              {/* CALL NOW */}
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 hover:text-indigo-600 transition-all shadow-md group"
              >
                <Phone className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>CALL NOW</span>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  {COMPANY_INFO.phone}
                </span>
              </a>

              {/* WHATSAPP */}
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>WHATSAPP</span>
              </a>

              {/* EMAIL US */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white transition-all group"
              >
                <Mail className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>EMAIL US</span>
              </a>
            </div>

            {/* Multi-Page Navigation Jump Links */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
              <span className="text-slate-500 uppercase tracking-wider text-[11px]">Explore Pages:</span>
              <Link
                to="/sourcing-process"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white hover:underline transition-colors"
              >
                <span>Sourcing Process</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                to="/apparel-range"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white hover:underline transition-colors"
              >
                <span>Apparel Range</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                to="/inquiry"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white hover:underline transition-colors"
              >
                <span>Quick Inquiry</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick Sourcing Assurance Items - Strictly grounded, no invented claims */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plain Blanks</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Sourced in plain form</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Job-Work Print</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Custom print coordination</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Courier Supply</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Direct to customer</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pay on Delivery</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Safe delivery options</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side Visual Panel - Apparel & Sourcing Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700 p-6 sm:p-7 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                <div>
                  <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Tiruppur Direct</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Apparel Sourcing Model</h3>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Active Sourcing Desk" />
              </div>

              {/* Core Workflow List */}
              <div className="mt-5 space-y-3.5 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-md bg-indigo-900/80 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">Plain T-Shirts Sourced</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Direct procurement of plain knitwear garments from Tiruppur manufacturers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-md bg-indigo-900/80 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">Job-Work Printing Coordination</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Transferred to dedicated printing specialists for screen, DTF, puff, or embroidery.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-md bg-indigo-900/80 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">Finished Garment Delivery</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Supplied to customers via verified courier with convenient Pay on Delivery arrangements.</p>
                  </div>
                </div>
              </div>

              {/* Founder Signature Bar & Page Links */}
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Founder & CEO</span>
                  <span className="font-semibold text-white">{COMPANY_INFO.founder}</span>
                </div>
                <Link
                  to="/sourcing-process"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                >
                  <span>Sourcing Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
