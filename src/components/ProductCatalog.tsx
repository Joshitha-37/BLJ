import { useState } from 'react';
import { PRODUCT_CATEGORIES, COMPANY_INFO } from '../data/company';
import { MessageCircle, Check, ArrowRight } from 'lucide-react';

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories =
    selectedCategory === 'all'
      ? PRODUCT_CATEGORIES
      : PRODUCT_CATEGORIES.filter((c) => c.id === selectedCategory);

  return (
    <section id="garments" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              Garment Portfolio
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Apparel & T-Shirt Range
            </h2>
            <p className="mt-2 text-slate-600 max-w-xl text-base">
              Available as plain blanks for your own processing or as fully finished, custom-printed garments delivered directly to you.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Garments
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((product) => (
            <div
              key={product.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col group hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              {/* Product Visual */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs font-semibold text-indigo-300 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    {product.fabric.split(' ')[0]} {product.fabric.split(' ')[1]}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <p>
                      <strong className="text-slate-700">Fabric:</strong> {product.fabric}
                    </p>
                    <p>
                      <strong className="text-slate-700">Suited for:</strong> {product.idealFor}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inquiry Link */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={`https://wa.me/919095120925?text=${encodeURIComponent(
                      `Hello Balaji, I am interested in sourcing ${product.title} from BLJ APPEX GLOBAL.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire Batch</span>
                  </a>
                  <a
                    href="#inquiry"
                    className="text-xs text-slate-400 hover:text-slate-700 font-medium inline-flex items-center gap-0.5"
                  >
                    <span>Spec Sheet</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Requirements Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-base font-bold text-slate-900">
              Looking for a custom fabric weave, GSM or specific silhouette?
            </h4>
            <p className="text-sm text-slate-600 mt-0.5">
              Operating right from Tiruppur gives us direct access to mills, yarn spinners, and knitters to source your exact requirement.
            </p>
          </div>
          <a
            href={`tel:${COMPANY_INFO.phoneRaw}`}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
          >
            Call {COMPANY_INFO.phone}
          </a>
        </div>

      </div>
    </section>
  );
}
