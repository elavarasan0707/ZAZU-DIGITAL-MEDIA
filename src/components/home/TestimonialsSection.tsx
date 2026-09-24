import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { INITIAL_TESTIMONIALS } from '../../firebase/seed';
import { Testimonial } from '../../types';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'testimonials'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Testimonial[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Testimonial);
          });
          setTestimonials(list);
        }
      },
      (err) => {
        console.warn('Realtime testimonials note:', err);
      }
    );
    return () => unsub();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials.length) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-[#F4EFE6]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Validated Partner Endorsements
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
            Loved By Ambitious Founders & Marketing Leaders
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            Real feedback from enterprise leaders who scaled their pipeline and organic reach with ZaZu Digital Media.
          </p>
        </div>

        {/* Featured Testimonial Hero Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-left">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-blue-100/60 pointer-events-none" />

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < current.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                  }`}
                />
              ))}
              <span className="text-xs font-extrabold text-stone-700 ml-2">5.0 / 5.0 Rating</span>
            </div>

            {/* Content */}
            <p className="text-base sm:text-xl font-medium text-stone-800 leading-relaxed italic mb-8">
              "{current.content}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
              <div className="flex items-center gap-4">
                <img
                  src={
                    current.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={current.clientName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#1E56A0]/20"
                />
                <div>
                  <h4 className="text-base font-bold font-['Outfit'] text-stone-900">
                    {current.clientName}
                  </h4>
                  <p className="text-xs text-[#1E56A0] font-semibold">
                    {current.clientRole} • <span className="text-stone-600">{current.company}</span>
                  </p>
                </div>
              </div>

              {/* Slider arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous Testimonial"
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-[#1E56A0] hover:text-white hover:border-[#1E56A0] text-stone-700 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next Testimonial"
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-[#1E56A0] hover:text-white hover:border-[#1E56A0] text-stone-700 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail quick cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                idx === currentIndex
                  ? 'bg-white border-[#1E56A0] shadow-md ring-1 ring-[#1E56A0]'
                  : 'bg-white/60 border-stone-200/80 hover:bg-white text-stone-600'
              }`}
            >
              <p className="text-xs font-bold text-stone-900 truncate">{t.clientName}</p>
              <p className="text-[11px] text-[#1E56A0] truncate">{t.company}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
