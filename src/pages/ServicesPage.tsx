import React, { useState, useEffect } from 'react';
import {
  Search,
  Share2,
  Instagram,
  FileText,
  Target,
  Sparkles,
  Palette,
  Code2,
  Zap,
  Compass,
  ArrowRight,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { INITIAL_SERVICES } from '../firebase/seed';
import { ServiceItem } from '../types';

interface ServicesPageProps {
  onSelectService: (serviceName: string) => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onSelectService,
  onNavigate,
}) => {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [activeFilter, setActiveFilter] = useState<'all' | 'organic' | 'paid' | 'creative' | 'dev'>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: ServiceItem[] = [];
          snapshot.forEach((d) => {
            fetched.push({ id: d.id, ...d.data() } as ServiceItem);
          });
          fetched.sort((a, b) => (a.order || 0) - (b.order || 0));
          setServices(fetched);
        }
      },
      (error) => {
        console.warn('Real-time services listener note:', error);
      }
    );
    return () => unsub();
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'Share2':
        return <Share2 className="w-6 h-6" />;
      case 'Instagram':
        return <Instagram className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Target':
        return <Target className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'Code2':
        return <Code2 className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Compass':
      default:
        return <Compass className="w-6 h-6" />;
    }
  };

  const filteredServices = services.filter((svc) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'organic') {
      return (
        svc.slug.includes('seo') ||
        svc.slug.includes('content') ||
        svc.slug.includes('management')
      );
    }
    if (activeFilter === 'paid') {
      return (
        svc.slug.includes('ppc') ||
        svc.slug.includes('marketing') ||
        svc.slug.includes('lead')
      );
    }
    if (activeFilter === 'creative') {
      return (
        svc.slug.includes('brand') ||
        svc.slug.includes('graphic')
      );
    }
    if (activeFilter === 'dev') {
      return (
        svc.slug.includes('web') ||
        svc.slug.includes('strategy')
      );
    }
    return true;
  });

  return (
    <div className="py-12 sm:py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Full-Spectrum Digital Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
            Comprehensive Growth Capabilities
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
            From technical SEO and scalable paid acquisition to brand architecture and modern web
            engineering, we execute with uncompromising craftsmanship.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Services (10)' },
            { id: 'organic', label: 'SEO & Organic Growth' },
            { id: 'paid', label: 'Paid Ads & PPC' },
            { id: 'creative', label: 'Branding & Design' },
            { id: 'dev', label: 'Web Dev & Strategy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#1E56A0] text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group card-3d"
            >
              <div>
                {/* Service Visual Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={svc.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Floating Icon Emblem */}
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md text-[#1E56A0] flex items-center justify-center shadow-lg group-hover:bg-[#1E56A0] group-hover:text-white transition-colors duration-300">
                    {getServiceIcon(svc.icon)}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 bg-[#1E56A0]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                      Specialized Practice
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] mb-2.5 group-hover:text-[#1E56A0] transition-colors leading-snug">
                    {svc.name}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                    {svc.shortDesc}
                  </p>

                  {svc.deliverables && svc.deliverables.length > 0 && (
                    <div className="space-y-1.5 mb-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                        Deliverables:
                      </p>
                      {svc.deliverables.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle className="w-3.5 h-3.5 text-[#1E56A0] shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-7 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                <button
                  onClick={() => setSelectedService(svc)}
                  className="text-xs font-bold text-[#1E56A0] hover:text-[#103770] flex items-center gap-1 group-hover:underline"
                >
                  <span>Detailed Scope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectService(svc.name)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-[#1E56A0] hover:text-white text-stone-800 text-xs font-bold transition-all shadow-2xs"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for detailed service overview */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-200 rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-left">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1E56A0] flex items-center justify-center">
                    {getServiceIcon(selectedService.icon)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-['Outfit'] text-[#1E252D]">
                      {selectedService.name}
                    </h3>
                    <p className="text-xs text-[#1E56A0] font-semibold">Service Blueprint</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 my-6 text-sm text-stone-700 leading-relaxed">
                <p className="font-medium text-stone-900">{selectedService.shortDesc}</p>
                <p>{selectedService.fullDesc}</p>

                <div className="pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                    Full Scope & Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.deliverables?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const name = selectedService.name;
                    setSelectedService(null);
                    onSelectService(name);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1E56A0] text-white font-bold text-xs hover:bg-[#164280] shadow-md"
                >
                  Inquire For This Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
