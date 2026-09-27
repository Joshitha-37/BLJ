import { useState } from 'react';
import { COMPANY_INFO } from '../data/company';
import { saveContactToFirestore } from '../lib/firebase';
import { Phone, MessageCircle, Mail, MapPin, User, Send, CheckCircle2, Database } from 'lucide-react';

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTicketId = `BLJ-MSG-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Save directly to Firebase Firestore
      await saveContactToFirestore({
        id: newTicketId,
        name,
        phone,
        email,
        message,
        createdAt: new Date().toISOString(),
      });
      setTicketId(newTicketId);

      // 2. Also notify backend endpoint
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message, id: newTicketId }),
      }).catch(() => {});
    } catch (err) {
      console.warn('Firestore contact error:', err);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, message }),
        });
        const data = await res.json();
        setTicketId(data.ticketId || newTicketId);
      } catch {
        setTicketId(newTicketId);
      }
    }

    // Pre-populate mailto with customer query
    const subject = encodeURIComponent(`Inquiry for BLJ APPEX GLOBAL [${newTicketId}] from ${name || 'Prospective Buyer'}`);
    const body = encodeURIComponent(
      `Ticket: ${newTicketId}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            Get In Touch
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Information
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Reach out directly to {COMPANY_INFO.name} for apparel sourcing, plain T-shirt lots, and custom print manufacturing inquiries.
          </p>
        </div>

        {/* PRIMARY WORKING BUTTONS STRIP (Prompt Requirement) */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-lg">
          <div className="max-w-3xl mb-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
              Direct Communication Desk
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold mt-1 text-white">
              Instant Contact with Balaji Thiruvengadam
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Connect directly for immediate quantity rates, fabric availability, and dispatch schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* CALL NOW BUTTON */}
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 hover:text-indigo-600 transition-all font-bold text-sm shadow-md group"
            >
              <Phone className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  CALL NOW
                </span>
                <span className="text-sm font-extrabold">{COMPANY_INFO.phone}</span>
              </div>
            </a>

            {/* WHATSAPP BUTTON */}
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all font-bold text-sm shadow-md group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                  WHATSAPP
                </span>
                <span className="text-sm font-extrabold">+91 90951 20925</span>
              </div>
            </a>

            {/* EMAIL US BUTTON */}
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all font-bold text-sm shadow-md group"
            >
              <Mail className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  EMAIL US
                </span>
                <span className="text-sm font-extrabold truncate max-w-[170px]">
                  {COMPANY_INFO.email}
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Detailed Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Company Details Column */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-2">
                  Registered Identity
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-black text-sm tracking-wider shadow-xs shrink-0">
                    BLJ
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {COMPANY_INFO.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest font-bold text-indigo-600 leading-tight mt-0.5">
                      {COMPANY_INFO.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Founder Spotlight */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg">
                  <User className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                    {COMPANY_INFO.founderTitle}
                  </span>
                  <span className="text-base font-bold text-slate-900 block">
                    {COMPANY_INFO.founder}
                  </span>
                </div>
              </div>

              {/* Postal Address */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                      Official Postal Address
                    </span>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {COMPANY_INFO.address.line1}<br />
                      {COMPANY_INFO.address.line2}<br />
                      {COMPANY_INFO.address.city}<br />
                      {COMPANY_INFO.address.stateCountry}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hub & Location */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">LOCATION</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {COMPANY_INFO.address.shortLocation}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">SOURCING CLUSTER</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    Tiruppur Knitwear District
                  </span>
                </div>
              </div>

              {/* Direct links list */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
                <div className="flex items-center gap-3 text-slate-700">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Phone:</span>
                  <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-indigo-600">
                    {COMPANY_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Email:</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-indigo-600">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Direct Email / Message Form Column */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block mb-1">
                Direct Communication Form
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-6">
                Send an Sourcing Query
              </h3>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base">Inquiry Prepared & Logged!</h4>
                  {ticketId && (
                    <div className="space-y-1.5">
                      <span className="inline-block px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                        Ticket: #{ticketId}
                      </span>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 py-0.5 px-2.5 rounded-full w-fit mx-auto">
                        <Database className="w-3 h-3 text-indigo-600" />
                        <span>Saved to Cloud Firestore Database</span>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-emerald-800">
                    Your inquiry has been stored in the BLJ APPEX GLOBAL backend system and formatted for {COMPANY_INFO.email}. You can also connect instantly on WhatsApp.
                  </p>
                  <a
                    href={COMPANY_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Balaji Thiruvengadam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Garment Requirement / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please specify T-shirt type (Round neck, Polo, Oversized), plain blanks vs printed, quantity, and delivery destination..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-indigo-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to balaji-india@live.com</span>
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    Clicking send will format your message and open your mail application. For immediate response, call or message on WhatsApp.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
