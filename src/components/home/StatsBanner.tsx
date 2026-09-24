import React from 'react';
import { Award, Users, TrendingUp, BarChart3 } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '+380%',
      label: 'Average Client Revenue Lift',
      detail: 'Across 12-month client partnerships',
    },
    {
      icon: Users,
      value: '2.4M+',
      label: 'Qualified Leads & Purchases',
      detail: 'Generated across Google & Meta ads',
    },
    {
      icon: BarChart3,
      value: '99.2%',
      label: 'Retention & Client Satisfaction',
      detail: 'Long-term retainers & transparent ROI',
    },
    {
      icon: Award,
      value: '150+',
      label: 'Successful Campaigns Scaled',
      detail: 'B2B SaaS, E-Commerce & Healthcare',
    },
  ];

  return (
    <div className="relative z-10 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-300/40 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`flex flex-col items-center text-center ${i > 0 ? 'pt-4 sm:pt-0' : ''}`}>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-2.5 shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#1E252D] tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-stone-800 mt-1">
                {stat.label}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5 hidden sm:block">
                {stat.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
