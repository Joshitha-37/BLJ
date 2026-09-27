import { Package, Printer, CheckCircle, Truck, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { SOURCING_PROCESS, COMPANY_INFO } from '../data/company';

export default function SourcingWorkflow() {
  const stepIcons = [Package, Printer, CheckCircle, Truck];

  return (
    <section id="workflow" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            End-to-End Workflow
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How We Source, Print & Deliver
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            A transparent and dependable operational process managed directly from Tiruppur.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOURCING_PROCESS.map((item, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-2xl font-black text-indigo-600">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  {item.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier & Pay On Delivery Highlight Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span>Customer Trust & Convenience</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Courier & Pay on Delivery Arrangements
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We organize reliable courier dispatches across regions. For convenient fulfillment, Pay on Delivery arrangements allow payment during the secure delivery process, ensuring full peace of mind for every batch received.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <span>Request Delivery Details</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium pt-1">
                <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                <span>Safe Delivery & Direct Payment</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
