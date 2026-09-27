import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { SOURCING_PROCESS, COMPANY_INFO } from '../data/company';
import { Package, Printer, CheckCircle2, Truck, ShieldCheck, ArrowRight, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function SourcingProcessPage() {
  const stepIcons = [Package, Printer, CheckCircle2, Truck];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Sourcing & Supply Workflow"
        subtitle="The transparent operational pipeline from plain knitwear procurement in Tiruppur to finished garment delivery at your doorstep."
        breadcrumb="Sourcing Process"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Intro Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 mb-14 shadow-xs">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              The Tiruppur Pipeline
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Direct Coordination from India’s Knitwear Capital
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              At <strong className="text-slate-900">{COMPANY_INFO.name}</strong>, our sourcing model connects you directly with the textile infrastructure of Tiruppur, Tamil Nadu. By sourcing plain garments in raw form and managing dedicated job-work printing, we ensure superior material quality, sharp print precision, and streamlined delivery for all orders.
            </p>
          </div>
        </div>

        {/* Detailed 4-Step Breakdown */}
        <div className="space-y-8 mb-16">
          {SOURCING_PROCESS.map((item, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            return (
              <div
                key={item.step}
                className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs hover:border-indigo-300 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-4 flex items-center lg:items-start gap-4">
                    <span className="font-display text-4xl sm:text-5xl font-black text-indigo-600">
                      {item.step}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="lg:hidden">
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="hidden lg:block font-display text-2xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-1">
                      <strong className="text-slate-900 block mb-1">Key Operational Highlights:</strong>
                      <p>{item.details}</p>
                    </div>

                    {index === 0 && (
                      <p className="text-xs text-slate-500">
                        • Verified knitting mills in Tiruppur • 100% combed cotton & customized blends • Ready availability of standard colors & GSMs.
                      </p>
                    )}
                    {index === 1 && (
                      <p className="text-xs text-slate-500">
                        • Screen printing, DTF transfers, puff/3D prints, high-density & embroidery • Vetted job-work units with strict ink curing standards.
                      </p>
                    )}
                    {index === 2 && (
                      <p className="text-xs text-slate-500">
                        • Strict piece-by-piece inspection • Dimensional stability & print wash-durability verification • Protective individual polybag packing.
                      </p>
                    )}
                    {index === 3 && (
                      <p className="text-xs text-slate-500">
                        • Reliable regional & nationwide courier dispatch • Convenient Pay on Delivery arrangements • Real-time parcel tracking to final delivery.
                      </p>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Courier & Pay On Delivery Deep Dive */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Customer Security & Delivery Process</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Courier & Pay on Delivery Arrangements
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We believe in hassle-free, secure fulfillment. With our established courier partners, customers can opt for convenient Pay on Delivery arrangements where payment is completed safely through the courier delivery process upon order arrival.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>Dispatched from Tiruppur, India</span>
                </span>
                <span>·</span>
                <span>Doorstep Delivery Tracking</span>
                <span>·</span>
                <span>Transparent Delivery Settlement</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>
              <Link
                to="/inquiry"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
              >
                <span>Build Order Spec</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Working Action Buttons Strip */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Ready to Initiate Your Garment Sourcing Batch?
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Contact Balaji Thiruvengadam directly to discuss your plain T-shirt lots or custom printed requirements.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>CALL NOW: {COMPANY_INFO.phone}</span>
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP SOURCING</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>EMAIL US</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
