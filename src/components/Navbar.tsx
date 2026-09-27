import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, Menu, X, ChevronRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  const mobileNavItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50 font-bold'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <>
      {/* Top Direct Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{COMPANY_INFO.address.shortLocation}</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Perfectly Aligned Brand Logo & Tagline */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              {/* Brand Geometric Monogram */}
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-extrabold text-sm tracking-wider shadow-sm group-hover:bg-indigo-600 transition-colors">
                BLJ
              </div>

              {/* Exact Aligned Text Hierarchy */}
              <div className="flex flex-col justify-center text-left">
                <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                  {COMPANY_INFO.name}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-indigo-600 leading-tight mt-0.5">
                  {COMPANY_INFO.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <NavLink to="/" end className={navItemClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navItemClass}>
                About Us
              </NavLink>
              <NavLink to="/sourcing-process" className={navItemClass}>
                Sourcing Process
              </NavLink>
              <NavLink to="/apparel-range" className={navItemClass}>
                Apparel Range
              </NavLink>
              <NavLink to="/printing-job-work" className={navItemClass}>
                Printing Job-Work
              </NavLink>
              <NavLink to="/inquiry" className={navItemClass}>
                Quick Inquiry
              </NavLink>
              <NavLink to="/contact" className={navItemClass}>
                Contact
              </NavLink>
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Call Now</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
            <nav className="flex flex-col space-y-1">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>About Us</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
              <NavLink
                to="/sourcing-process"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>Sourcing Process</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
              <NavLink
                to="/apparel-range"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>Apparel Range</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
              <NavLink
                to="/printing-job-work"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>Printing Job-Work</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
              <NavLink
                to="/inquiry"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>Quick Inquiry</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavItemClass}
              >
                <span>Contact</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            </nav>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold rounded-lg border border-slate-300 text-slate-800 bg-white"
              >
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>Call {COMPANY_INFO.phone}</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
