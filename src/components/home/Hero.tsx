import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Logo } from '../common/Logo';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface HeroProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-32 bg-gradient-to-b from-[#FAF8F5]/70 via-[#F4EFE6]/60 to-[#FAF8F5]/80 backdrop-blur-xs">
      {/* 3D Dynamic Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-[0.05] select-none">
        <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M 50 18 C 36 6 18 10 14 18 C 12 28 14 36 10 44 C 7 50 8 57 14 62 C 22 70 34 68 44 56 C 47 52 49 53 50 56 C 51 53 53 52 56 56 C 66 68 78 70 86 62 C 92 57 93 50 90 44 C 86 36 88 28 86 18 C 82 10 64 6 50 18 Z"
            fill="#1E252D"
          />
          <circle cx="34" cy="44" r="14" fill="#1E252D" />
          <circle cx="66" cy="44" r="14" fill="#1E252D" />
        </svg>
      </div>

      {/* Decorative blurred color halos */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/80 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-stone-700 font-['Plus_Jakarta_Sans']">
                Next-Gen Digital Marketing & Brand Acceleration
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] text-[#1E252D] tracking-tight leading-[1.1]">
              Transforming Brands Into Market Leaders With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E56A0] via-blue-600 to-[#103770]">
                Precision Marketing.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl">
              ZaZu Digital Media is a performance-driven agency. We engineer exponential brand
              growth through technical SEO, high-ROAS paid media, bespoke visual branding, and
              conversion-optimized web architecture.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-900/15 hover:shadow-xl hover:shadow-blue-900/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/90 hover:bg-white text-stone-800 font-bold rounded-2xl text-sm border border-stone-300/80 shadow-xs hover:border-stone-400 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Services
              </button>

              <WhatsAppButton
                variant="button"
                className="px-5 py-3.5 rounded-2xl text-sm"
                label="WhatsApp Us"
              />
            </div>

            {/* Guarantee / Value bullets */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-stone-300/60 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E56A0] shrink-0" />
                <span className="font-semibold text-stone-800">Zero Vanity Metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E56A0] shrink-0" />
                <span className="font-semibold text-stone-800">Direct WhatsApp Sprints</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E56A0] shrink-0" />
                <span className="font-semibold text-stone-800">Custom Growth Roadmap</span>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase: 3D Logo Sculpture & Metrics */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Backing Ambient Frame */}
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-stone-300/50 overflow-hidden group">
                {/* 3D Visual Asset Display */}
                <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner aspect-square flex items-center justify-center">
                  <img
                    src="/images/zazu-logo.jpg"
                    alt="ZaZu Digital Media 3D Brand"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      // fallback if image tag cannot reach
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/80 shadow-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-bold text-stone-800">ZaZu Creative Labs</span>
                  </div>
                </div>

                {/* Floating Micro Metric Pill 1 */}
                <div className="absolute -bottom-3 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E56A0] flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Average ROAS</p>
                    <p className="text-base font-black text-stone-900 font-['Outfit']">6.8x Return</p>
                  </div>
                </div>

                {/* Floating Micro Metric Pill 2 */}
                <div className="absolute -top-3 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Organic Growth</p>
                    <p className="text-base font-black text-stone-900 font-['Outfit']">+420% Surge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
