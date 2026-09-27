import PageHeader from '../components/PageHeader';
import ContactSection from '../components/ContactSection';
import { COMPANY_INFO } from '../data/company';
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Contact BLJ APPEX GLOBAL"
        subtitle="Reach out directly to Balaji Thiruvengadam for apparel sourcing, plain T-shirt lots, job-work printing, and reliable courier delivery."
        breadcrumb="Contact"
      />

      {/* Main Contact Section */}
      <ContactSection />

      {/* Quick Office Directions / Coordinates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block">
                Office Location
              </span>
              <h4 className="font-display text-lg font-bold">Tiruppur Knitwear Hub</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {COMPANY_INFO.address.line1} {COMPANY_INFO.address.line2}, {COMPANY_INFO.address.city} {COMPANY_INFO.address.stateCountry}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block">
                Direct Communication
              </span>
              <h4 className="font-display text-lg font-bold">Fast Turnaround Desk</h4>
              <p className="text-xs text-slate-300">
                Direct mobile line: <strong className="text-white">{COMPANY_INFO.phone}</strong><br />
                WhatsApp: Available 7 days a week for inquiries and sample photos.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block">
                Fulfillment Logistics
              </span>
              <h4 className="font-display text-lg font-bold">Courier & Delivery</h4>
              <p className="text-xs text-slate-300">
                Dispatched directly from Tiruppur via insured courier services with Pay on Delivery arrangements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
