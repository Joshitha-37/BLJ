import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { PRODUCT_CATEGORIES, COMPANY_INFO } from '../data/company';
import { MessageCircle, Check, Phone, ArrowRight, Layers, SlidersHorizontal } from 'lucide-react';

export default function ApparelRangePage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProducts =
    selectedFilter === 'all'
      ? PRODUCT_CATEGORIES
      : PRODUCT_CATEGORIES.filter((p) => p.id === selectedFilter);

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Apparel Range & T-Shirt Catalog"
        subtitle="Explore knitwear garments sourced directly from Tiruppur — available in plain blank lots or with specialized custom printing."
        breadcrumb="Apparel Range"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Filter Navigation Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filter Categories:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Styles
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row"
            >
              <div className="md:w-5/12 relative aspect-4/3 md:aspect-auto overflow-hidden bg-slate-200 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-3 left-3 md:hidden">
                  <span className="text-xs font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded">
                    {item.fabric.split(' ')[0]} {item.fabric.split(' ')[1]}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      Tiruppur Sourced
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Plain & Printed
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                    {item.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <p>
                      <strong className="text-slate-800">Fabric Composition:</strong> {item.fabric}
                    </p>
                    <p>
                      <strong className="text-slate-800">Ideal Application:</strong> {item.idealFor}
                    </p>
                    <p>
                      <strong className="text-slate-800">Available Sizes:</strong> XS, S, M, L, XL, XXL, 3XL
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/919095120925?text=${encodeURIComponent(
                      `Hello Balaji, I would like to inquire about sourcing "${item.title}" with BLJ APPEX GLOBAL.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  <Link
                    to="/inquiry"
                    className="text-xs font-bold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1"
                  >
                    <span>Spec Sheet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fabric & Customization Note */}
        <div className="bg-indigo-950 text-white rounded-3xl p-8 sm:p-10 mb-14 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Layers className="w-4 h-4" />
                <span>Custom Knits & Milling</span>
              </div>
              <h3 className="font-display text-2xl font-bold">
                Need a Custom Weave, Blend or Specific Pantone Dye?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Operating directly from the Tiruppur knitwear cluster gives BLJ APPEX GLOBAL immediate access to spinning mills and dye houses to source your exact fabric specifications.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>
              <Link
                to="/inquiry"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
              >
                <span>Launch Sourcing Specifier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
