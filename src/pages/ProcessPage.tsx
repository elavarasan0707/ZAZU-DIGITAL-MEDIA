import React from 'react';
import {
  Search,
  Compass,
  Rocket,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const ProcessPage: React.FC<{
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}> = ({ onNavigate, onOpenBooking }) => {
  const roadmap = [
    {
      step: 'Sprint 01',
      title: 'Technical & Commercial Discovery',
      duration: 'Week 1',
      description:
        'We immerse ourselves in your data, dissecting historical ad account performance, technical SEO search console logs, customer feedback, and rival competitor messaging.',
      deliverables: [
        'Comprehensive 45-point technical site & SEO audit',
        'Competitor ad spend & creative hook breakdown',
        'Customer journey & friction points analysis',
        'Baseline conversion tracking & pixel audit',
      ],
    },
    {
      step: 'Sprint 02',
      title: 'Growth Architecture & Creative Blueprint',
      duration: 'Week 2',
      description:
        'We architect your customized growth blueprint: semantic search keyword maps, paid media audience segments, ad creative angles, and CRO wireframes.',
      deliverables: [
        'Quarterly revenue & ROAS forecast model',
        'Keyword priority cluster matrix',
        'Ad creative concept boards & hooks',
        'Landing page wireframes & value proposition',
      ],
    },
    {
      step: 'Sprint 03',
      title: 'High-Impact Production & Campaign Deployment',
      duration: 'Week 3',
      description:
        'Our copywriters, visual designers, and front-end developers deploy campaign assets. High-converting landing pages go live alongside segmented ad sets.',
      deliverables: [
        'High-converting landing pages built & tested',
        'Search & Google Performance Max campaign launch',
        'Meta, TikTok, and LinkedIn ad sets activated',
        'Direct WhatsApp sprint notification setup',
      ],
    },
    {
      step: 'Sprint 04',
      title: 'Algorithmic Optimization & Hyper-Scaling',
      duration: 'Continuous / Ongoing',
      description:
        'We eliminate low-performing variations and aggressively scale proven winners, compound organic backlink authority, and unlock secondary audience cohorts.',
      deliverables: [
        'Weekly conversion rate (CRO) A/B testing',
        'Budget reallocation to highest ROAS sets',
        'SEO link velocity & authority building',
        'Executive live dashboard & bi-weekly syncs',
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Engineered Execution
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
            How We Deliver Predictable Scaled Growth
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
            Our step-by-step roadmap eliminates ambiguity. We execute in transparent weekly sprints
            so you always know what is being built, tested, and scaled.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {roadmap.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black font-['Outfit'] bg-[#1E252D] text-white px-3 py-1 rounded-lg uppercase tracking-wider">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D]">
                    {item.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#1E56A0] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
                  {item.duration}
                </span>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                {item.description}
              </p>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Sprint Deliverables:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.deliverables.map((del, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-stone-800 font-medium">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 text-center max-w-4xl mx-auto shadow-sm">
          <h3 className="text-2xl font-black font-['Outfit'] text-stone-900 mb-2">
            Ready to Begin Sprint 01 for Your Brand?
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Reserve your strategic consultation. We limit monthly client onboarding to guarantee
            exceptional executive attention.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              Book Strategy Session
            </button>
            <WhatsAppButton variant="button" className="px-5 py-3 text-xs sm:text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
