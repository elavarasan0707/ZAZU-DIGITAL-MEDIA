import React from 'react';
import { ShieldCheck, Target, Award, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="py-12 sm:py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 text-left">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              The ZaZu Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] tracking-tight leading-tight">
              Architecting Market Dominance for Forward-Thinking Enterprises
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Founded on the belief that modern marketing must be an exact science, ZaZu Digital
              Media converges algorithmic data engineering with emotive creative storytelling. We
              exist to liberate founders and CMOs from ambiguous agency retainers by delivering
              tangible, bankable business growth.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 bg-[#1E56A0] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-[#164280] transition-all"
              >
                Schedule Consultation
              </button>
              <WhatsAppButton variant="button" />
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl overflow-hidden text-center group">
              <div className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 mb-6 aspect-square flex items-center justify-center">
                <img
                  src="/images/zazu-logo.jpg"
                  alt="ZaZu Digital Media Brand Identity"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-black font-['Outfit'] text-[#1E252D]">
                Precision. Vigilance. Mastery.
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                The ZaZu Owl signifies 360° strategic clarity across every digital medium.
              </p>
            </div>
          </div>
        </div>

        {/* Agency Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-[#1E252D]">
              Our Guiding Principles
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              How our agency operates every single day for our partner brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-5 font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] mb-2">
                1. Data-First Integrity
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We never execute on gut feelings alone. Every ad budget allocation, keyword priority,
                and CRO tweak is substantiated by real conversion telemetry.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-5 font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] mb-2">
                2. Sprint-Based Execution
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Digital algorithms move at breakneck speed. Our weekly execution sprints ensure your
                campaigns capitalize on emerging trends ahead of sluggish competitors.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E56A0] flex items-center justify-center mb-5 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] mb-2">
                3. Total Ownership & Access
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                You retain complete, unencumbered ownership of your ad accounts, pixel data, code,
                and creative collateral. Complete transparency is our cornerstone.
              </p>
            </div>
          </div>
        </div>

        {/* Agency Capability Matrix */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E56A0]">
                Engineered For Scale
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D] mt-1 mb-4">
                A Unified Team Across All Growth Verticals
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Instead of hiring disparate freelancers or multiple siloed agencies, ZaZu brings your
                SEO strategists, media buyers, copywriters, and front-end developers under one
                disciplined roof.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-stone-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Technical SEO Engineers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Google Ads & PMax Specialists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Meta & TikTok Creative Directors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-Converting React Developers</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
              <h4 className="text-base font-bold text-stone-900 font-['Outfit']">Agency Quick Facts</h4>
              <div className="divide-y divide-stone-200 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Official Brand:</span>
                  <span className="font-bold text-stone-800">ZaZu Digital Media</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Direct Contact:</span>
                  <span className="font-bold text-[#1E56A0]">digitalmediazazu@gmail.com</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Official WhatsApp:</span>
                  <span className="font-bold text-emerald-700">+91 97895 04702</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Client Footprint:</span>
                  <span className="font-bold text-stone-800">India, US, UK, UAE & Global</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
