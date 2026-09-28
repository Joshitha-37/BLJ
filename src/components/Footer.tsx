import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../data/company';
import { Phone, MessageCircle, Mail, MapPin, ArrowUp, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-left">
      
      {/* Top Banner inside Footer */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Header */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-black text-base shadow-sm">
              BLJ
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-2xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">
                {COMPANY_INFO.name}
              </span>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold mt-0.5 leading-tight">
                Online T-Shirt Store · Tiruppur
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
              Online T-shirt clothing store based in Tiruppur, India. 100% super-combed cotton, heavyweight 180-240 GSM tees, bio-washed finishing, with convenient Pay on Delivery and a 48-Hour Return Guarantee.
            </p>
            <div className="pt-2 text-xs text-slate-300">
              <span className="text-slate-500 block">Founder & CEO:</span>
              <strong className="text-white">{COMPANY_INFO.founder}</strong>
            </div>
          </div>

          {/* Col 2: Online Store Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              Store Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-indigo-400 transition-colors">
                  Shop All T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/category/t-shirts" className="hover:text-indigo-400 transition-colors">
                  T-Shirts Collection
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-indigo-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-indigo-400 transition-colors">
                  My Customer Account & Orders
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-indigo-400 transition-colors font-bold text-indigo-400">
                  48-Hour Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Garment Specifications & Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              Apparel Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Heavyweight Oversized Boxy Tees (240 GSM)</li>
              <li>• Everyday Bio-Washed Crewneck Tees (180 GSM)</li>
              <li>• Pique Knit Athletic Collar Polos (220 GSM)</li>
              <li>• Mineral Acid-Wash Streetwear Drops (220 GSM)</li>
              <li>• Shirts & Tops (Expanding Soon)</li>
              <li>• Hoodies & Sweatshirts (Expanding Soon)</li>
            </ul>
          </div>

          {/* Col 4: Registered Office */}
          <div className="space-y-3">
            <h4 className="text-white font-display text-sm font-bold uppercase tracking-wider">
              Tiruppur Hub Office
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
            <Link to="/return-policy" className="hover:text-white transition-colors">
              Return Policy (48h)
            </Link>
            <Link to="/admin" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Portal (Restricted)</span>
            </Link>
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
