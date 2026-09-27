import PageHeader from '../components/PageHeader';
import { COMPANY_INFO } from '../data/company';
import { Building2, User, MapPin, CheckCircle2, Phone, MessageCircle, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title={`About ${COMPANY_INFO.name}`}
        subtitle={`${COMPANY_INFO.tagline} based in Tiruppur, Tamil Nadu — providing dedicated T-shirt sourcing, custom printing coordination, and reliable supply.`}
        breadcrumb="About Us"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Story Column */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-5">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
                Company Profile
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Rooted in Tiruppur’s Knitwear Capital
              </h2>
              <p className="text-slate-700 text-base leading-relaxed">
                <strong className="text-slate-900">{COMPANY_INFO.name}</strong> was founded by <strong className="text-slate-900">{COMPANY_INFO.founder}</strong> with a clear vision: to provide transparent, reliable, and premium T-shirt and apparel sourcing directly from the production hub of Tiruppur, Tamil Nadu.
              </p>
              <p className="text-slate-700 text-base leading-relaxed">
                Rather than treating sourcing as a hands-off middleman operation, BLJ APPEX GLOBAL operates on the ground in Tiruppur. We inspect and procure plain garments directly from knitwear manufacturers, oversee specialized job-work printing with vetted printing partners, and supply finished, inspected products straight to your doorstep.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-5">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
                Operational Ethics
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Honest, Real-World Sourcing Standards
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We believe in authentic partnership. We do not make inflated claims or fictitious marketing promises. What we deliver is tangible:
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Genuine Tiruppur Knitwear Quality</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Direct access to combed yarn, compacting, biowash baths, and heavy GSM knits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Personal Sourcing Supervision</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Every batch is physically coordinated and checked by Balaji Thiruvengadam and team.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Dependable Delivery & Pay on Delivery Options</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Secure courier dispatches with payment collected through the delivery process for complete client confidence.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Leadership & Location Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Founder Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
              <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-2xl shadow-sm shrink-0">
                  BT
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 block">
                    Leadership
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                    {COMPANY_INFO.founder}
                  </h3>
                  <p className="text-sm font-medium text-slate-600">
                    {COMPANY_INFO.founderTitle} · {COMPANY_INFO.name}
                  </p>
                </div>
              </div>

              {/* Office Address */}
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Official Registered Office
                  </span>
                  <div className="flex items-start gap-2.5 text-slate-800">
                    <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p>{COMPANY_INFO.address.line1}</p>
                      <p>{COMPANY_INFO.address.line2}</p>
                      <p>{COMPANY_INFO.address.city}</p>
                      <p className="text-slate-900 font-semibold">{COMPANY_INFO.address.stateCountry}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Direct Contacts
                  </span>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-indigo-600 font-semibold">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-indigo-600 font-semibold">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Action */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>Call {COMPANY_INFO.phone}</span>
                </a>
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Balaji Thiruvengadam</span>
                </a>
              </div>
            </div>

            {/* Tiruppur Cluster Advantage */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Building2 className="w-4 h-4" />
                <span>Geographic Advantage</span>
              </div>
              <h4 className="font-display text-lg font-bold">
                Tiruppur Textile Ecosystem
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tiruppur contributes a major portion of India’s knitwear production. Sourcing with BLJ APPEX GLOBAL ensures direct factory connection without distant intermediaries.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
