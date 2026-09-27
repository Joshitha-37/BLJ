import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  tag?: string;
  breadcrumb: string;
}

export default function PageHeader({ title, subtitle, tag = 'BLJ APPEX GLOBAL', breadcrumb }: PageHeaderProps) {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 py-12 sm:py-16 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-medium">
          <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-indigo-400 font-semibold">{breadcrumb}</span>
        </nav>

        {/* Tag & Heading */}
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 block mb-2">
            {tag}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
