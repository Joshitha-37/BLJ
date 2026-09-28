import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizeChart = [
    { size: 'XS', chestIn: '36"', chestCm: '91 cm', lengthIn: '26.5"', lengthCm: '67 cm', shoulderIn: '17"' },
    { size: 'S', chestIn: '38"', chestCm: '96 cm', lengthIn: '27.5"', lengthCm: '70 cm', shoulderIn: '18"' },
    { size: 'M', chestIn: '40"', chestCm: '102 cm', lengthIn: '28.5"', lengthCm: '72 cm', shoulderIn: '19"' },
    { size: 'L', chestIn: '42"', chestCm: '107 cm', lengthIn: '29.5"', lengthCm: '75 cm', shoulderIn: '20"' },
    { size: 'XL', chestIn: '44"', chestCm: '112 cm', lengthIn: '30.5"', lengthCm: '77 cm', shoulderIn: '21"' },
    { size: 'XXL', chestIn: '46"', chestCm: '117 cm', lengthIn: '31.5"', lengthCm: '80 cm', shoulderIn: '22"' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">
              Measurement Chart
            </span>
            <h3 className="font-display text-lg font-black text-slate-900 mt-0.5">
              Standard Indian T-Shirt Sizing
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          All measurements are taken with the garment laid flat. For oversized fits, we recommend choosing your regular size for an intended relaxed drape, or size down for a standard look.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest (Around)</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-indigo-600">{row.size}</td>
                  <td className="py-2.5 px-3 text-slate-800">{row.chestIn} ({row.chestCm})</td>
                  <td className="py-2.5 px-3 text-slate-800">{row.lengthIn} ({row.lengthCm})</td>
                  <td className="py-2.5 px-3 text-slate-800">{row.shoulderIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
          <p className="font-bold">Need a custom measurement or fit guidance?</p>
          <p className="text-indigo-700">
            Reach out directly on WhatsApp at <strong>+91 90951 20925</strong> for instant sizing recommendations before purchasing.
          </p>
        </div>

        <div className="mt-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
