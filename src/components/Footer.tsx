import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../data/company';
import { Phone, MessageCircle, Mail, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      
      {/* Top Banner inside Footer */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Perfectly Aligned Brand Header */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-base shadow-sm">
              BLJ
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-2xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">
                {COMPANY_INFO.name}
              </span>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold mt-0.5 leading-tight">
                {COMPANY_INFO.tagline}
              </span>
            </div>
          </Link>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call: {COMPANY_INFO.phone}</span>
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About & Leadership */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              {COMPANY_INFO.name}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              International Sourcing Experts based in Tiruppur, India. Specialists in plain T-shirt procurement, custom job-work printing, and reliable delivery to brands, retailers, and institutions.
            </p>
            <div className="pt-2 text-xs text-slate-300">
              <span className="text-slate-500 block">Founder & CEO:</span>
              <strong className="text-white">{COMPANY_INFO.founder}</strong>
            </div>
          </div>

          {/* Col 2: Multi-Page Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  About BLJ APPEX GLOBAL
                </Link>
              </li>
              <li>
                <Link to="/sourcing-process" className="hover:text-indigo-400 transition-colors">
                  Sourcing & Supply Process
                </Link>
              </li>
              <li>
                <Link to="/apparel-range" className="hover:text-indigo-400 transition-colors">
                  Apparel & T-Shirt Catalog
                </Link>
              </li>
              <li>
                <Link to="/printing-job-work" className="hover:text-indigo-400 transition-colors">
                  Printing Job-Work Options
                </Link>
              </li>
              <li>
                <Link to="/inquiry" className="hover:text-indigo-400 transition-colors">
                  Build Sourcing Inquiry
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Apparel Services */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              Sourcing Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Plain T-Shirts in bulk form</li>
              <li>• Screen & DTF Job-Work Printing</li>
              <li>• Oversized Streetwear & Heavyweight Blanks</li>
              <li>• Polo / Collar T-Shirts</li>
              <li>• Hoodies & Sweatshirts</li>
              <li>• Courier & Pay on Delivery Fulfillment</li>
            </ul>
          </div>

          {/* Col 4: Registered Office */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              Head Office
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
              <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p>{COMPANY_INFO.address.line1}</p>
                <p>{COMPANY_INFO.address.line2}</p>
                <p>{COMPANY_INFO.address.city}</p>
                <p className="text-slate-300 font-medium">{COMPANY_INFO.address.stateCountry}</p>
              </div>
            </div>
            <div className="pt-2 text-xs space-y-1">
              <p className="text-slate-400">
                Phone:{' '}
                <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="text-white hover:text-emerald-400">
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p className="text-slate-400">
                Email:{' '}
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-white hover:text-indigo-400">
                  {COMPANY_INFO.email}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. Tiruppur, Tamil Nadu, India.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">{COMPANY_INFO.tagline}</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
