import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SidebarNav from './components/SidebarNav';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import { testFirestoreConnection } from './lib/firebase';
import { ShopProvider } from './context/ShopContext';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import AdminPage from './pages/AdminPage';

// Retained informational pages for full brand continuity
import AboutPage from './pages/AboutPage';
import SourcingProcessPage from './pages/SourcingProcessPage';
import PrintingPage from './pages/PrintingPage';
import InquiryPage from './pages/InquiryPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  return (
    <ShopProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
          <ScrollToTop />
          
          {/* Left Side Menu Bar (Preserved Visual Design with Real Ecommerce Counts) */}
          <SidebarNav />

          {/* Main Page Area - Offset to accommodate Left Menu Bar on Desktop */}
          <div className="lg:pl-72 flex flex-col min-h-screen">
            {/* Top Quick Contact Strip */}
            <TopBar />

            {/* Multi-Page Routes */}
            <main className="flex-1">
              <Routes>
                {/* Core Ecommerce Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/category/:category" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmed/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/return-policy" element={<ReturnPolicyPage />} />
                <Route path="/admin" element={<AdminPage />} />

                {/* Additional Company & Sourcing Information Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/sourcing-process" element={<SourcingProcessPage />} />
                <Route path="/apparel-range" element={<ShopPage />} />
                <Route path="/printing-job-work" element={<PrintingPage />} />
                <Route path="/inquiry" element={<InquiryPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Fallback */}
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
    </ShopProvider>
  );
}
