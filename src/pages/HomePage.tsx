import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { StatsBanner } from '../components/home/StatsBanner';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProcessSection } from '../components/home/ProcessSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_PRICING } from '../firebase/seed';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ServiceItem, Project, PricingPlan } from '../types';
import { WhatsAppButton, getWhatsAppUrl } from '../components/common/WhatsAppButton';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
  onSelectService: (serviceName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onSelectService,
}) => {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [pricing, setPricing] = useState<PricingPlan[]>(INITIAL_PRICING);

  useEffect(() => {
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        const list: ServiceItem[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ServiceItem));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setServices(list);
      }
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        const list: Project[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Project));
        setProjects(list);
      }
    });

    const unsubPricing = onSnapshot(collection(db, 'pricing'), (snap) => {
      if (!snap.empty) {
        const list: PricingPlan[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as PricingPlan));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setPricing(list);
      }
    });

    return () => {
      unsubServices();
      unsubProjects();
      unsubPricing();
    };
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <Hero onNavigate={onNavigate} onOpenBooking={onOpenBooking} />

      {/* STATS BANNER */}
      <StatsBanner />

      {/* 2. ABOUT AGENCY PREVIEW */}
      <section className="py-20 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl overflow-hidden group">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src="/images/zazu-logo.jpg"
                    alt="ZaZu Digital Media Brand Craft"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-stone-800">ZaZu Creative Excellence</span>
                  <span className="text-[#1E56A0] font-semibold">Bespoke Strategic Roadmaps</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#1E252D] tracking-tight leading-tight">
                An Elite Digital Agency Focused Exclusively on Exponential ROI
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                At ZaZu Digital Media, we reject vanity impressions and empty promises. We combine
                rigorous algorithmic precision, deep technical SEO, hyper-targeted multi-channel ad
                funnels, and bespoke visual branding to transform modern businesses into category
                titans.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-stone-800 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data-Backed Conversion Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent Weekly Sprint Cadence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Executive WhatsApp Comms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Client Asset Ownership</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E56A0] hover:bg-[#164280] text-white text-xs font-bold shadow-md transition-all"
                >
                  <span>Learn More About ZaZu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <WhatsAppButton variant="button" className="px-4 py-3 text-xs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES HIGHLIGHT */}
      <section className="py-20 bg-white/40 backdrop-blur-xs relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="text-left max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-2 tracking-tight">
                Strategic Services That Drive Measurable Scale
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                From organic search dominance to high-converting ad creative and next-gen web
                architecture.
              </p>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold shadow-2xs self-start md:self-auto transition-all"
            >
              <span>View All 10 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {services.slice(0, 6).map((svc) => (
              <div
                key={svc.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group card-3d"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                    <img
                      src={svc.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-[#1E56A0] flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold font-['Outfit'] text-[#1E252D] mb-2 group-hover:text-[#1E56A0] transition-colors">
                      {svc.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
                      {svc.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectService(svc.name)}
                    className="text-xs font-bold text-[#1E56A0] hover:underline flex items-center gap-1"
                  >
                    <span>Book Strategy Call</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    Full Practice
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <WhyChooseUs onNavigate={onNavigate} />

      {/* 5. PROCESS SECTION */}
      <ProcessSection onNavigate={onNavigate} />

      {/* 6. PROJECTS SHOWCASE */}
      <section className="py-20 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="text-left max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
                Proven Track Record
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-2 tracking-tight">
                Featured Agency Projects & Case Studies
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                Explore quantifiable results and scalable success stories built by ZaZu Digital Media.
              </p>
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold shadow-2xs self-start md:self-auto transition-all"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onNavigate('projects')}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col justify-between card-3d"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-stone-100">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E252D]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                      {proj.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-[#1E56A0] font-semibold mb-1">{proj.clientName}</p>
                    <h3 className="text-lg font-bold font-['Outfit'] text-[#1E252D] group-hover:text-[#1E56A0] transition-colors line-clamp-1 mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>

                    {proj.metrics && (
                      <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center gap-2 text-xs font-bold text-[#1E56A0]">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{proj.metrics}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#1E56A0]">
                  <span>View Project Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 9. CONTACT CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-[#1E252D] via-[#151B22] to-[#11151A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Accelerate Your Market Share</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to Partner With ZaZu Digital Media and Scale Your Bottom Line?
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Stop leaving revenue on the table. Speak with our principal growth engineers today to
            claim your comprehensive digital audit and tailored roadmap.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-[#1E56A0] hover:bg-blue-600 text-white font-bold rounded-2xl text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Start Your Free Discovery Audit
            </button>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Direct WhatsApp Hotline</span>
            </a>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-center gap-8 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#1E56A0]" />
              digitalmediazazu@gmail.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#1E56A0]" />
              +91 97895 04702
            </span>
            <span>⚡ Response time: under 4 business hours</span>
          </div>
        </div>
      </section>
    </div>
  );
};
