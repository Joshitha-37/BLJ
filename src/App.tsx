import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SidebarNav from './components/SidebarNav';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import { testFirestoreConnection } from './lib/firebase';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SourcingProcessPage from './pages/SourcingProcessPage';
import ApparelRangePage from './pages/ApparelRangePage';
import PrintingPage from './pages/PrintingPage';
import InquiryPage from './pages/InquiryPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  useEffect(() => {
    testFirestoreConnection();
  }, []);
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
        <ScrollToTop />
        
        {/* Left Side Menu Bar */}
        <SidebarNav />

        {/* Main Page Area - Offset to accommodate Left Menu Bar on Desktop */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          {/* Top Quick Contact Strip */}
          <TopBar />

          {/* Multi-Page Routes */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sourcing-process" element={<SourcingProcessPage />} />
              <Route path="/apparel-range" element={<ApparelRangePage />} />
              <Route path="/printing-job-work" element={<PrintingPage />} />
              <Route path="/inquiry" element={<InquiryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>

        {/* Floating Action Controls */}
        <FloatingContact />
      </div>
    </HashRouter>
  );
}
