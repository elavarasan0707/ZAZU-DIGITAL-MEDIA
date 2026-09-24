/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { BookingModal } from './components/common/BookingModal';
import { ThreeDBackground } from './components/common/ThreeDBackground';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProcessPage } from './pages/ProcessPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { seedInitialDataIfEmpty } from './firebase/seed';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  // Auto seed initial data once if Firestore collections are empty
  useEffect(() => {
    seedInitialDataIfEmpty(false).catch((err) => {
      console.warn('Auto seed check:', err);
    });
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) setPreselectedService(serviceName);
    setIsBookingOpen(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigateTo}
            onOpenBooking={() => handleOpenBooking()}
            onSelectService={(svc) => handleOpenBooking(svc)}
          />
        );
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'services':
        return (
          <ServicesPage
            onNavigate={navigateTo}
            onSelectService={(svc) => handleOpenBooking(svc)}
          />
        );
      case 'process':
        return (
          <ProcessPage
            onNavigate={navigateTo}
            onOpenBooking={() => handleOpenBooking()}
          />
        );
      case 'projects':
      case 'portfolio':
        return <PortfolioPage onNavigate={navigateTo} />;
      case 'pricing':
        return <ServicesPage onNavigate={navigateTo} onSelectService={(svc) => handleOpenBooking(svc)} />;
      case 'blog':
        return <BlogPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'signup':
        return <SignupPage onNavigate={navigateTo} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onOpenBooking={() => handleOpenBooking()}
            onSelectService={(svc) => handleOpenBooking(svc)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]/80 text-stone-800 selection:bg-[#1E56A0] selection:text-white relative">
      {/* Immersive 3D Background with Dynamic Depth & Ambient Lighting */}
      <ThreeDBackground />

      {/* Sticky Header Navigation */}
      <div className="relative z-40">
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenBooking={() => handleOpenBooking()}
        />
      </div>

      {/* Main Page Body */}
      <main className="flex-1 relative z-10">
        {renderCurrentPage()}
      </main>

      {/* Universal Footer */}
      <div className="relative z-10">
        <Footer onNavigate={navigateTo} />
      </div>

      {/* Floating 24/7 WhatsApp Quick-Chat Action */}
      <WhatsAppButton variant="floating" />

      {/* Consultation Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
