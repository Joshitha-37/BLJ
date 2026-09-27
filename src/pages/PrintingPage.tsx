import PageHeader from '../components/PageHeader';
import { PRINTING_CAPABILITIES, COMPANY_INFO } from '../data/company';
import { Sparkles, MessageCircle, Phone, Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function PrintingPage() {
  const printDetails = [
    {
      title: 'Precision Screen Printing',
      bestFor: 'High-volume orders, corporate wear, bold graphic tees & merchandise',
      inks: 'Plastisol, Water-Based, Discharge, and Non-PVC Eco Inks',
      durability: 'Extreme wash-durability tested for 50+ wash cycles',
      description:
        'The gold standard for T-shirt surface embellishment. We coordinate with dedicated screen print units in Tiruppur using multi-station automatic presses and precision exposure units for razor-sharp halftones and vibrant spot colors.',
    },
    {
      title: 'Direct-to-Film (DTF) Transfers',
      bestFor: 'Intricate multi-color designs, photorealistic graphics, gradients, and short-to-medium runs',
      inks: 'High-density pigment inks with elastic TPU powder backing',
      durability: 'High stretch resistance without cracking or peeling',
      description:
        'Ideal for complex artwork requiring limitless colors. DTF enables vibrant, photo-grade clarity on 100% cotton, cotton-poly blends, and dark tees with soft-touch feel and clean borders.',
    },
    {
      title: 'Puff & 3D High Density Prints',
      bestFor: 'Streetwear labels, oversized drops, premium typographic logos & tactile branding',
      inks: 'Foaming expandable puff plastisol and sharp silicone high-density compounds',
      durability: 'Resilient 3D shape retention after regular washing',
      description:
        'Elevate your brand with tactile dimension. We manage precise puff heat expansion and sharp-edged high-density screen printing to create sculptural, premium streetwear aesthetics.',
    },
    {
      title: 'Computerized Precision Embroidery',
      bestFor: 'Collar polo shirts, corporate uniforms, chest badges, fleece hoodies & sleeve accents',
      inks: 'High-tensile polyester & rayon threads in exact Pantone matches',
      durability: 'Permanent stitch longevity lasting the lifetime of the garment',
      description:
        'Coordinated across multi-head Tajima and Barudan embroidery machinery for tight stitch density, crisp small-lettering definition, and flawless backing finishes.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader
        title="Job-Work Printing Coordination"
        subtitle="Specialized surface embellishment for plain sourced T-shirts — handled by vetted printing facilities in Tiruppur."
        breadcrumb="Printing Job-Work"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Intro Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 mb-14 shadow-xs">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
              Job-Work Management
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Flawless Execution from Plain Blank to Finished Apparel
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Once plain garments are procured, <strong className="text-slate-900">{COMPANY_INFO.name}</strong> transfers the goods directly to specialized job-work printers across Tiruppur. We oversee screen exposure, ink mixing, sample strike-offs, and final heat-curing before dispatch.
            </p>
          </div>
        </div>

        {/* Detailed Print Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {printDetails.map((print, i) => (
            <div
              key={print.title}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Method 0{i + 1}
                  </span>
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>

                <h3 className="font-display text-xl font-bold text-slate-900">
                  {print.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {print.description}
                </p>

                <div className="pt-2 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-800">Best For:</strong> {print.bestFor}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-800">Inks / Compounds:</strong> {print.inks}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-800">Durability:</strong> {print.durability}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Job-work coordinated</span>
                <a
                  href={`https://wa.me/919095120925?text=${encodeURIComponent(
                    `Hello Balaji, I want to discuss ${print.title} for our apparel order.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <span>Discuss Method</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Artwork Submission Consultation Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
              Artwork & Sampling
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Have Artwork Ready? Send It to Balaji Thiruvengadam
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              We accept vector files (.AI, .EPS, .CDR, .PDF) as well as high-resolution PNGs (300 DPI with transparent background). We will review the file, advise on the best printing process, and coordinate sample strike-offs.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Artwork on WhatsApp (+91 90951 20925)</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                'Artwork Submission for Job-Work Printing - BLJ APPEX GLOBAL'
              )}`}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-sm transition-colors"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Email Artwork ({COMPANY_INFO.email})</span>
            </a>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Sourcing Desk</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
