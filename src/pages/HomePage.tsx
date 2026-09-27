import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { SOURCING_PROCESS, PRODUCT_CATEGORIES, PRINTING_CAPABILITIES, COMPANY_INFO } from '../data/company';
import { ArrowRight, Package, Printer, CheckCircle, Truck, Phone, MessageCircle, Mail, MapPin, Sparkles } from 'lucide-react';

export default function HomePage() {
  const stepIcons = [Package, Printer, CheckCircle, Truck];

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* 1. About Teaser Section with Navigation */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
                Company Overview
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Authentic Apparel & T-Shirt Sourcing from Tiruppur
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                <strong className="text-slate-900">{COMPANY_INFO.name}</strong> operates under the direction of Founder & CEO <strong className="text-slate-900">{COMPANY_INFO.founder}</strong> in Tiruppur, Tamil Nadu. We specialize in procuring plain T-shirt lots directly from manufacturers, managing precision job-work printing, and supplying inspected garments straight to your business with convenient Pay on Delivery arrangements.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-xs"
              >
                <span>Read Full Company Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/sourcing-process"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-colors"
              >
                <span>View Sourcing Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sourcing Process Section with dedicated page link */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
                Operational Framework
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900 tracking-tight">
                How We Source, Print & Deliver
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
                A dependable multi-stage pipeline connecting Tiruppur manufacturing to your doorstep.
              </p>
            </div>
            <Link
              to="/sourcing-process"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group shrink-0"
            >
              <span>Explore Sourcing Process Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOURCING_PROCESS.map((item, index) => {
              const Icon = stepIcons[index % stepIcons.length];
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-xl font-black text-indigo-600">
                        {item.step}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    {item.details}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Courier & Pay On Delivery Highlight */}
          <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 block">
                Doorstep Courier Logistics
              </span>
              <h4 className="font-display text-base font-bold text-slate-900">
                Safe Delivery Process with Pay on Delivery Arrangements
              </h4>
              <p className="text-xs text-slate-500">
                Receive finished apparel shipments safely through verified courier networks across India.
              </p>
            </div>
            <Link
              to="/sourcing-process"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Apparel Range Preview with dedicated page link */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
                Garment Selection
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900 tracking-tight">
                Apparel Range & Styles
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
                Available as plain blanks or custom printed finished T-shirts in all popular knits.
              </p>
            </div>
            <Link
              to="/apparel-range"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group shrink-0"
            >
              <span>View Full Apparel Range Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_CATEGORIES.map((product) => (
              <div
                key={product.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md transition-all"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-[11px] font-semibold text-white bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded">
                      {product.fabric.split(' ')[0]} {product.fabric.split(' ')[1]}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {product.idealFor}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <Link
                      to="/apparel-range"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <a
                      href={COMPANY_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Printing Job-Work Teaser */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
                Surface Finishing
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                Job-Work Printing Coordination
              </h2>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
                Screen printing, DTF transfers, puff prints, and embroidery coordinated with specialized units.
              </p>
            </div>
            <Link
              to="/printing-job-work"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-white group shrink-0"
            >
              <span>Explore Printing Job-Work Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINTING_CAPABILITIES.map((item, idx) => (
              <div
                key={item.name}
                className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-indigo-400 transition-colors"
              >
                <div className="text-xs font-mono font-bold text-indigo-400 mb-2">0{idx + 1}</div>
                <h3 className="font-display text-base font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact & Action Strip */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
                Direct Contact Desk
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Connect Directly with {COMPANY_INFO.name}
              </h2>
              <p className="text-slate-300 text-sm mt-2">
                Founder & CEO: <strong className="text-white">{COMPANY_INFO.founder}</strong> · {COMPANY_INFO.address.shortLocation}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* CALL NOW */}
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 hover:text-indigo-600 transition-all font-bold text-sm shadow-md"
              >
                <Phone className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    CALL NOW
                  </span>
                  <span className="text-sm font-extrabold">{COMPANY_INFO.phone}</span>
                </div>
              </a>

              {/* WHATSAPP */}
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all font-bold text-sm shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                <div className="text-left">
                  <span className="block text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                    WHATSAPP
                  </span>
                  <span className="text-sm font-extrabold">+91 90951 20925</span>
                </div>
              </a>

              {/* EMAIL US */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all font-bold text-sm shadow-md"
              >
                <Mail className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    EMAIL US
                  </span>
                  <span className="text-sm font-extrabold truncate max-w-[170px]">
                    {COMPANY_INFO.email}
                  </span>
                </div>
              </a>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>No. 16, Second Street, Seeyaan Kaadu, Karumaram Palayam, Tiruppur – 641607, Tamil Nadu, India.</span>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-white font-bold"
              >
                <span>View Full Contact Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
