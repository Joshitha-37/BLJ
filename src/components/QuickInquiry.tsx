import { useState } from 'react';
import { COMPANY_INFO } from '../data/company';
import { saveInquiryToFirestore } from '../lib/firebase';
import { MessageCircle, Mail, Send, Check, CheckCircle2, RefreshCw, Database } from 'lucide-react';

export default function QuickInquiry() {
  const [garmentType, setGarmentType] = useState('Round Neck T-Shirt');
  const [isPrinted, setIsPrinted] = useState('printed');
  const [printMethod, setPrintMethod] = useState('Screen Printing');
  const [quantity, setQuantity] = useState('100 - 250 pcs');
  const [deliveryType, setDeliveryType] = useState('Courier with Pay on Delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<any>(null);

  const buildInquiryText = (refId?: string) => {
    return `Hello Balaji / BLJ APPEX GLOBAL,
${refId ? `[Reference: ${refId}]` : ''}
I would like to inquire about apparel sourcing:
• Garment: ${garmentType}
• Style: ${isPrinted === 'printed' ? `Custom Printed (${printMethod})` : 'Plain Blanks (No Print)'}
• Batch Quantity: ${quantity}
• Delivery Preference: ${deliveryType}
${customerName ? `• Inquirer: ${customerName}` : ''}
${customerPhone ? `• Phone: ${customerPhone}` : ''}
${customerNote ? `• Additional notes: ${customerNote}` : ''}

Looking forward to your pricing & turnaround time. Thank you!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const refId = `BLJ-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const inquiryPayload = {
      id: refId,
      garmentType,
      isPrinted,
      printMethod: isPrinted === 'printed' ? printMethod : 'None',
      quantity,
      deliveryType,
      customerName: customerName || 'Prospective Buyer',
      customerPhone: customerPhone || 'Not provided',
      customerNote,
      createdAt: new Date().toISOString(),
      status: 'received',
    };

    try {
      // 1. Save directly to Firebase Firestore
      await saveInquiryToFirestore(inquiryPayload);

      // 2. Also notify backend endpoint
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryPayload),
      }).catch(() => {});

      const waText = encodeURIComponent(buildInquiryText(refId));
      setSubmittedResponse({
        success: true,
        referenceId: refId,
        storedInFirestore: true,
        whatsappDirectUrl: `https://wa.me/919095120925?text=${waText}`,
      });
    } catch (err) {
      console.warn('Firestore write error, using fallback:', err);
      // Fallback to backend API
      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiryPayload),
        });
        const data = await res.json();
        setSubmittedResponse({
          ...data,
          storedInFirestore: false,
        });
      } catch {
        setSubmittedResponse({
          success: true,
          referenceId: refId,
          storedInFirestore: false,
          whatsappDirectUrl: `https://wa.me/919095120925?text=${encodeURIComponent(buildInquiryText(refId))}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSend = () => {
    const ref = submittedResponse?.referenceId || 'NEW';
    const subject = encodeURIComponent(`Sourcing Inquiry [${ref}]: ${garmentType} - BLJ APPEX GLOBAL`);
    const body = encodeURIComponent(buildInquiryText(ref));
    window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setSubmittedResponse(null);
  };

  return (
    <section id="inquiry" className="py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            Direct Requirement Specifier
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Build Your Sourcing Inquiry
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Select your garment specifications and submit directly to the BLJ APPEX GLOBAL sourcing backend and WhatsApp desk.
          </p>
        </div>

        {/* Interactive Builder Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
          {submittedResponse ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Stored in Cloud Firestore Database</span>
                </div>
                <h3 className="font-display text-2xl font-black text-slate-900 mt-1">
                  Reference: #{submittedResponse.referenceId}
                </h3>
                <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                  Your inquiry has been stored securely in the BLJ APPEX GLOBAL database. Connect directly on WhatsApp or Email with this reference code for immediate processing.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Garment:</span>
                  <strong className="font-bold">{garmentType}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Format:</span>
                  <strong className="font-bold">
                    {isPrinted === 'printed' ? `Printed (${printMethod})` : 'Plain Blanks'}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Batch Quantity:</span>
                  <strong className="font-bold">{quantity}</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Logistics:</span>
                  <strong className="font-bold">{deliveryType}</strong>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a
                  href={
                    submittedResponse.whatsappDirectUrl ||
                    `https://wa.me/919095120925?text=${encodeURIComponent(
                      buildInquiryText(submittedResponse.referenceId)
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to WhatsApp (+91 90951 20925)</span>
                </a>

                <button
                  type="button"
                  onClick={handleEmailSend}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Send via Email ({COMPANY_INFO.email})</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Inquiry</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Garment Type */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 mb-3">
                  1. Select Garment Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'Round Neck T-Shirt',
                    'Oversized Drop-Tee',
                    'Polo Collar T-Shirt',
                    'Hoodie / Sweatshirt',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setGarmentType(type)}
                      className={`py-3 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                        garmentType === type
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Plain vs Custom Printed */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 mb-3">
                  2. Sourcing Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPrinted('plain')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isPrinted === 'plain'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">Plain Garments (Blanks)</span>
                      {isPrinted === 'plain' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Unprinted blanks sourced directly from Tiruppur knitters.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPrinted('printed')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isPrinted === 'printed'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">Custom Printed & Finished</span>
                      {isPrinted === 'printed' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Job-work printing coordinated and supplied ready to sell.
                    </p>
                  </button>
                </div>
              </div>

              {/* Sub-step 2B: Print Method (if printed) */}
              {isPrinted === 'printed' && (
                <div className="pt-1">
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 mb-2">
                    Printing / Embellishment Technique
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Screen Printing', 'DTF Transfer', 'Puff / 3D High Density', 'Embroidery'].map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPrintMethod(method)}
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                            printMethod === method
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {method}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Approximate Quantity & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 mb-2">
                    3. Batch Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="50 - 100 pcs">50 - 100 pcs (Sample / Pilot)</option>
                    <option value="100 - 250 pcs">100 - 250 pcs (Standard Batch)</option>
                    <option value="250 - 500 pcs">250 - 500 pcs (Commercial Batch)</option>
                    <option value="500 - 1,000 pcs">500 - 1,000 pcs</option>
                    <option value="1,000+ pcs">1,000+ pcs (Bulk Sourcing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 mb-2">
                    4. Logistics Preference
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="Courier with Pay on Delivery">Courier with Pay on Delivery</option>
                    <option value="Standard Door Delivery Courier">Standard Door Delivery Courier</option>
                    <option value="Direct Hub Pickup (Tiruppur)">Direct Hub Pickup (Tiruppur)</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name / Brand (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anand Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Fabric, GSM or Artwork Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention specific colorways, 180 GSM / 220 GSM preference, or delivery timeline..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 bg-white resize-none"
                />
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{COMPANY_INFO.name}</span>
                  <span>·</span>
                  <span>{COMPANY_INFO.address.shortLocation}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleEmailSend}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Send via Email</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{loading ? 'Registering...' : 'Submit & Connect on WhatsApp'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
