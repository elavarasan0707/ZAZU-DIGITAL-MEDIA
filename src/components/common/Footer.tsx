import React from 'react';
import { Mail, Phone, MessageCircle, Instagram, Linkedin, ArrowUpRight, Heart } from 'lucide-react';
import { Logo } from './Logo';
import {
  AGENCY_EMAIL,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  getWhatsAppUrl,
} from './WhatsAppButton';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const servicesList = [
    { name: 'Search Engine Optimization (SEO)', id: 'services' },
    { name: 'Social Media Marketing', id: 'services' },
    { name: 'Google Ads / PPC', id: 'services' },
    { name: 'Branding & Visual Identity', id: 'services' },
    { name: 'Website Development', id: 'services' },
    { name: 'Lead Generation', id: 'services' },
    { name: 'Digital Marketing Strategy', id: 'services' },
  ];

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Agency', id: 'about' },
    { name: 'Services Directory', id: 'services' },
    { name: 'Execution Process', id: 'process' },
    { name: 'Agency Projects', id: 'projects' },
    { name: 'Blog & Insights', id: 'blog' },
    { name: 'Contact Us', id: 'contact' },
    { name: 'Client Portal / Login', id: 'login' },
    { name: 'Create Account / Sign Up', id: 'signup' },
  ];

  return (
    <footer className="relative bg-[#11151A] text-stone-300 pt-16 pb-12 border-t border-stone-800 overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-stone-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-block"
            >
              <Logo size="md" />
            </div>

            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              ZaZu Digital Media is a premier full-service digital marketing agency. We engineer
              exponential brand growth through technical SEO, high-ROAS paid media, bespoke visual
              branding, and conversion-optimized web architecture.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-700/80 flex items-center justify-center text-stone-300 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-700/80 flex items-center justify-center text-stone-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-700/80 flex items-center justify-center text-stone-300 hover:text-white hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold font-['Outfit'] text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.slice(0, 6).map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <span className="text-[#1E56A0] opacity-0 group-hover:opacity-100 transition-opacity">
                      ›
                    </span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold font-['Outfit'] text-sm uppercase tracking-wider mb-4">
              Core Services
            </h4>
            <ul className="space-y-2 text-sm">
              {servicesList.map((svc) => (
                <li key={svc.name}>
                  <button
                    onClick={() => onNavigate(svc.id)}
                    className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <span className="text-[#1E56A0] opacity-0 group-hover:opacity-100 transition-opacity">
                      ›
                    </span>
                    <span className="truncate">{svc.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="text-white font-bold font-['Outfit'] text-sm uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3.5 text-sm">
              <a
                href={`mailto:${AGENCY_EMAIL}`}
                className="flex items-start gap-2.5 text-stone-400 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#1E56A0] shrink-0 mt-0.5" />
                <span className="break-all">{AGENCY_EMAIL}</span>
              </a>

              <a
                href="tel:+919789504702"
                className="flex items-center gap-2.5 text-stone-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#1E56A0] shrink-0" />
                <span>{WHATSAPP_NUMBER}</span>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {currentYear} ZaZu Digital Media. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-stone-300 transition-colors"
            >
              Terms of Engagement
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#1E56A0] hover:underline font-semibold"
            >
              Agency Management
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
