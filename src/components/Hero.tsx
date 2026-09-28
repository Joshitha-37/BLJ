import { Link } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  ShoppingBag,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
  Zap,
} from 'lucide-react';
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
          
          {/* Main Hero Copy with Approved Alignment */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Location & Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{COMPANY_INFO.address.shortLocation} · India’s Knitwear Capital</span>
            </div>

            {/* Brand Title & Tagline */}
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
                Online T-Shirt Clothing Store
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Direct-from-source Indian knitwear. Premium heavyweight oversized tees, classic bio-washed crewnecks, and pique polos spun from 100% super-combed cotton in Tiruppur. Dispatched with Pay on Delivery and a 48-Hour Return Guarantee.
            </p>

            {/* Direct Working Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
              {/* SHOP T-SHIRTS */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>EXPLORE T-SHIRTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

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
            </div>

            {/* Quick Assurance Items */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">180 - 240 GSM</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Heavyweight Combed Cotton</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tiruppur Knitted</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Bio-Washed Anti-Piling</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pay on Delivery</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Cash / UPI on Arrival</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">48-Hr Return</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Original Tags & Packaging</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side Visual Panel - Featured Flagship T-Shirt */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700 p-6 sm:p-7 shadow-2xl backdrop-blur-sm text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                <div>
                  <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Flagship Drop</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Heavyweight 240 GSM Boxy Tee</h3>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                  In Stock
                </span>
              </div>

              {/* Garment Image Preview */}
              <div className="mt-4 relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 group">
                <img
                  src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
                  alt="BLJ Heavyweight Oversized Tee"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-xs font-bold text-white">
                  Drop Shoulder · 240 GSM
                </div>
              </div>

              {/* Price & Size Pills */}
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-black text-white">₹799</span>
                    <span className="text-xs text-slate-400 line-through">₹1,399</span>
                    <span className="text-xs font-bold text-emerald-400">43% OFF</span>
                  </div>
                  <span className="text-xs text-slate-400">Pay on Delivery Available</span>
                </div>

                {/* Available Sizes */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                    Available Sizes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <span
                        key={sz}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Action Link */}
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Dispatch Origin</span>
                  <span className="text-xs font-bold text-white">Tiruppur Hub, Tamil Nadu</span>
                </div>
                <Link
                  to="/product/blj-heavyweight-oversized-boxy-tee-240-gsm"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Shop This Tee</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
