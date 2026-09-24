import React from 'react';
import { Target, Zap, Shield, BarChart, Rocket, Check } from 'lucide-react';

export const WhyChooseUs: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const differentiators = [
    {
      icon: Target,
      title: 'Obsession With Net Revenue, Not Vanity Clicks',
      description:
        'Most agencies deliver flashy impressions and zero sales. At ZaZu, we map every rupee and dollar spent directly to bottom-line pipeline and revenue.',
    },
    {
      icon: Zap,
      title: 'Full-Stack Execution Speed',
      description:
        'From high-speed React web development to high-converting ad creative sprints, we execute campaigns without bureaucratic bottlenecks.',
    },
    {
      icon: BarChart,
      title: '100% Real-Time Transparency',
      description:
        'No hidden markups or ambiguous monthly summaries. You get live dashboards, raw platform access, and weekly direct WhatsApp updates.',
    },
    {
      icon: Shield,
      title: 'Bespoke Strategy, Zero Cookie-Cutter Formulas',
      description:
        'Your brand is unique. We tailor custom semantic keyword maps, audience matrices, and creative hooks calibrated for your ideal buyers.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            The ZaZu Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
            Why Visionary Brands Partner With ZaZu Digital Media
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
            We don’t act like an outsourced vendor. We integrate seamlessly as your dedicated elite
            growth wing, deploying data-backed strategies that outpace your competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md border border-stone-200/90 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-6 group-hover:bg-[#1E56A0] group-hover:text-white transition-colors duration-300 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] mb-3 group-hover:text-[#1E56A0] transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Agency pledge banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-[#1E252D] to-[#11151A] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-left">
            <h4 className="text-xl font-bold font-['Outfit']">Ready to experience what real growth feels like?</h4>
            <p className="text-stone-300 text-xs sm:text-sm">
              Schedule your confidential growth audit. We will analyze your search rankings and paid media efficiency.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 bg-[#1E56A0] hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap shadow-md"
          >
            Claim Free Growth Audit
          </button>
        </div>
      </div>
    </section>
  );
};
