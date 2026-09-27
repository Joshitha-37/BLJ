import { Building2, User, MapPin, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            About Company
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {COMPANY_INFO.name}
          </h2>
          <p className="mt-2 text-lg font-medium text-slate-600">
            {COMPANY_INFO.tagline} · Based in {COMPANY_INFO.address.shortLocation}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Authentic Company Profile */}
          <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed">
            <p className="text-base sm:text-lg">
              <strong className="text-slate-900">{COMPANY_INFO.name}</strong> is a dedicated apparel and T-shirt sourcing enterprise established in Tiruppur, Tamil Nadu — the recognized textile and knitwear capital of India. Under the leadership of Founder & CEO <strong className="text-slate-900">{COMPANY_INFO.founder}</strong>, we manage the complete sourcing lifecycle for brands, businesses, retail programs, and promotional projects.
            </p>

            <p className="text-base">
              Our business model bridges the gap between premier garment manufacturers, specialized printing technicians, and direct customers. We source plain, high-quality knitwear garments directly from Tiruppur’s manufacturing network, coordinate specialized job-work printing (screen printing, DTF, puff, high-density, and embroidery), and supply the finished, inspected apparel directly to your doorstep.
            </p>

            <div className="pt-2">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-3">
                Core Sourcing & Coordination Competencies:
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Plain Garment Procurement:</strong> Direct sourcing of 100% combed cotton, biowashed, oversized, and blended blanks from verified Tiruppur knitters.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Specialized Job-Work Printing:</strong> Managing high-precision screen printing, vibrant DTF transfers, puff prints, and embroidery.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Quality Inspection & Packing:</strong> Batch checks for seam strength, dimensional consistency, color fastness, and secure packaging.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Dependable Logistics:</strong> Streamlined courier dispatches with Pay on Delivery arrangements for customer convenience.
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Action buttons within About */}
            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Sourcing on WhatsApp</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Founder & Head Office Profile Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              
              {/* Founder Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-2xl shadow-sm shrink-0">
                  BT
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 block">
                    Leadership
                  </span>
                  <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5">
                    {COMPANY_INFO.founder}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {COMPANY_INFO.founderTitle} · {COMPANY_INFO.name}
                  </p>
                </div>
              </div>

              {/* Verified Company Office Details */}
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Operating Office Address
                  </span>
                  <div className="flex items-start gap-2.5 text-slate-800 font-medium">
                    <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p>{COMPANY_INFO.address.line1}</p>
                      <p>{COMPANY_INFO.address.line2}</p>
                      <p>{COMPANY_INFO.address.city}</p>
                      <p className="text-slate-900 font-semibold">{COMPANY_INFO.address.stateCountry}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Direct Sourcing Desk
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                      <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-indigo-600 font-medium">
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800">
                      <User className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{COMPANY_INFO.founder}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800">
                      <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{COMPANY_INFO.hub}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Badge */}
              <div className="pt-4 border-t border-slate-200 bg-white -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 rounded-b-2xl border-t">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">Tiruppur Cluster Advantage</span>
                    <span className="text-slate-500">Fast turnaround from yarn to finished tees</span>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-md">
                    TN-641607
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
