import React from 'react';
import { Search, Compass, Rocket, TrendingUp, CheckCircle2 } from 'lucide-react';

export const ProcessSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Discovery & Deep Technical Audit',
      icon: Search,
      tag: 'Phase 1: Diagnosis',
      desc: 'We tear down your current search footprints, conversion leaks, competitor ad strategies, and technical bottlenecks to establish baseline benchmarks.',
      points: ['Full site architecture audit', 'Competitor keyword conquesting', 'Pixel & CRM funnel verification'],
    },
    {
      num: '02',
      title: 'Omnichannel Strategy & Blueprint',
      icon: Compass,
      tag: 'Phase 2: Architecture',
      desc: 'We map out a custom growth roadmap targeting high-intent buyers, defining exact creative angles, budget allocation, and SEO content clusters.',
      points: ['Budget & ROAS projection model', 'Audience segmentation matrix', 'Brand messaging guidelines'],
    },
    {
      num: '03',
      title: 'Creative Production & Campaign Launch',
      icon: Rocket,
      tag: 'Phase 3: Execution',
      desc: 'Our designers, copywriters, and media buyers bring campaigns to life with scroll-stopping ad creatives, search campaigns, and landing pages.',
      points: ['Rapid A/B creative variants', 'High-performance landing pages', 'Real-time campaign telemetry'],
    },
    {
      num: '04',
      title: 'Algorithmic Optimization & Scaling',
      icon: TrendingUp,
      tag: 'Phase 4: Multiplier',
      desc: 'We double down on winning hooks, eliminate unprofitable ad sets, expand organic keyword dominance, and systematically scale bottom-line revenue.',
      points: ['Weekly conversion rate tuning', 'Budget scaling on proven ROAS', 'Direct WhatsApp sprint syncs'],
    },
  ];

  return (
    <section className="py-20 bg-[#F4EFE6]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Our Proven Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
            The ZaZu Four-Stage Growth Engine
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
            Eliminating guesswork with a battle-tested roadmap engineered to take brands from
            obscurity to industry dominance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group text-left relative overflow-hidden"
              >
                {/* Step indicator watermark */}
                <span className="absolute top-4 right-4 text-4xl font-black font-['Outfit'] text-stone-200/60 select-none group-hover:text-blue-100 transition-colors">
                  {step.num}
                </span>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-5 group-hover:bg-[#1E56A0] group-hover:text-white transition-colors duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md inline-block mb-2">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold font-['Outfit'] text-[#1E252D] mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2">
                  {step.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1E56A0] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
