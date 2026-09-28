import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { COMPANY_INFO } from '../data/company';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Phone,
  MessageCircle,
  Star,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const { products, loadingProducts } = useShop();

  const featuredTees = products.slice(0, 4);

  return (
    <div className="space-y-0 text-left">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Immediate T-Shirt Showcase Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Featured T-Shirt Drops</span>
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Authentic Tiruppur T-Shirts
              </h2>
              <p className="mt-1 text-slate-600 text-xs sm:text-sm max-w-xl">
                Knitted from 100% combed cotton, bio-washed for lasting softness, and fitted with non-sag ribbed collars.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 group shrink-0"
            >
              <span>View All T-Shirts ({products.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of Product Cards */}
          {loadingProducts ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading T-shirts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTees.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md group"
            >
              <span>Browse Complete T-Shirt Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Fits & Style Architecture */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600">
              Tailored Silhouettes
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Engineered For Every Occasion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From relaxed streetwear drop-shoulders to crisp athletic polos, our fits are calibrated for all-day comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Boxy Oversized */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                240g
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Heavyweight Oversized
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                240 GSM French Terry and combed cotton. Drop shoulder cut with wide boxy torso and dense neck ribbing.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
              >
                <span>Shop Oversized</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Everyday Bio-Wash */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                180g
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Classic Everyday Bio-Wash
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                180 GSM single jersey cotton. Feather-light, ultra-breathable, enzyme bio-washed for an effortless soft drape.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
              >
                <span>Shop Everyday</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Athletic Pique Polo */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                220g
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Honeycomb Pique Polo
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                220 GSM honeycomb pique knit. Structured anti-roll flat knit collar with reinforced buttons for smart casual attire.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
              >
                <span>Shop Polos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quality & Fulfillment Commitments */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600">
                Direct From The Hub
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Why Buy From BLJ APPEX GLOBAL?
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Located in Tiruppur, India's foremost knitwear hub, we source direct from spinning mills and knitting manufacturers. Every garment is cut, stitched, bio-washed, and checked before parcel dispatch.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">100% Super-Combed Cotton</h4>
                    <p className="text-xs text-slate-500">Long staple fibers with zero fabric piling and no skin irritation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">48-Hour Return Policy</h4>
                    <p className="text-xs text-slate-500">Wrong size or incorrect product? Return within 48 hours of delivery with original tags intact.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Pay on Delivery (COD) & Bank Transfer</h4>
                    <p className="text-xs text-slate-500">Pay safely upon courier arrival or transfer directly via verified banking.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Seal Box */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Tiruppur Quality Standard</span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">6-Point Garment Audit</h3>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Fabric Audit</span>
                  <span className="font-bold text-white">Pre-Shrunk Bio-Wash</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Seam Strength</span>
                  <span className="font-bold text-white">Twin-Needle Taping</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Collar Construction</span>
                  <span className="font-bold text-white">Lycra Rib Non-Sag</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Color Fastness</span>
                  <span className="font-bold text-white">4+ Grade Tested</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Founder & CEO</span>
                  <span className="font-bold text-white">{COMPANY_INFO.founder}</span>
                </div>
                <Link
                  to="/return-policy"
                  className="inline-flex items-center gap-1 font-bold text-indigo-300 hover:text-white underline"
                >
                  <span>Read Return Terms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Strip */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600">
              Verified Buyers
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Loved by Customers Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "The 240 GSM boxy tee has the exact heavy streetwear drop I was looking for. No collar sagging even after 5 washes. Best T-shirt out of Tiruppur!"
              </p>
              <div>
                <strong className="text-slate-900 block font-bold">Karthik S.</strong>
                <span className="text-slate-400 text-[11px]">Bangalore, Karnataka</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "Pay on Delivery was so smooth. Parcel arrived neatly packed with tags. The cotton feels like luxury brand tees that cost double. Highly recommended."
              </p>
              <div>
                <strong className="text-slate-900 block font-bold">Ananya R.</strong>
                <span className="text-slate-400 text-[11px]">Hyderabad, Telangana</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "Ordered size L, fits true to measurement chart. The bio-wash handfeel is silk-soft. Will definitely be purchasing other colors."
              </p>
              <div>
                <strong className="text-slate-900 block font-bold">Vignesh M.</strong>
                <span className="text-slate-400 text-[11px]">Coimbatore, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Direct Contact & Sourcing Support Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">
                Direct Founder Assistance
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white mt-1">
                Have questions regarding fabric, sizes, or bulk T-shirt orders?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Speak directly with Founder & CEO Balaji Thiruvengadam in Tiruppur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
