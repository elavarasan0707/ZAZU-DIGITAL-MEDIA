import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Instagram,
  Linkedin,
  Sparkles,
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  AGENCY_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_RAW,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  getWhatsAppUrl,
} from '../components/common/WhatsAppButton';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Search Engine Optimization (SEO)',
    projectTopic: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const services = [
    'Search Engine Optimization (SEO)',
    'Social Media Marketing',
    'Social Media Management',
    'Content Marketing',
    'Google Ads / PPC',
    'Branding & Visual Identity',
    'Graphic Design',
    'Website Development',
    'Lead Generation',
    'Digital Marketing Strategy',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        service: formData.service,
        projectTopic: formData.projectTopic.trim() || 'General Growth Inquiry',
        message: formData.message.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'inquiries'), payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Inquiry submission error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      } catch (e: any) {
        setErrorMessage(
          'Could not record inquiry automatically. Please message us directly via WhatsApp or email.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Let's Build Something Exceptional
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
            Connect With Our Growth Specialists
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed">
            Whether you need a technical SEO roadmap, multi-million dollar ad management, or a total
            rebrand, we are here to craft your victory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-['Outfit'] text-[#1E252D] mb-2">
                  Direct Agency Channels
                </h3>
                <p className="text-stone-500 text-sm">
                  We reply within 4 business hours to all enterprise inquiries.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <a
                  href={`mailto:${AGENCY_EMAIL}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-blue-50/60 border border-stone-100 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#1E56A0] flex items-center justify-center shrink-0 group-hover:bg-[#1E56A0] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                      Email Us Directly
                    </p>
                    <p className="text-sm font-bold text-stone-800 break-all group-hover:text-[#1E56A0] transition-colors">
                      {AGENCY_EMAIL}
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                      Instant WhatsApp Chat
                    </p>
                    <p className="text-sm font-bold text-emerald-950">
                      {WHATSAPP_NUMBER}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Fastest response for urgent campaigns
                    </p>
                  </div>
                </a>

                {/* Working hours */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-11 h-11 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                      Operating Hours
                    </p>
                    <p className="text-sm font-bold text-stone-800">
                      Monday – Saturday: 9:00 AM – 7:30 PM IST
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">Global clients supported 24/7</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-11 h-11 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                      Headquarters
                    </p>
                    <p className="text-sm font-bold text-stone-800">
                      Chennai, Tamil Nadu, India (Worldwide Reach)
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Follow Our Social Channels
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-pink-50 border border-stone-200 text-stone-700 hover:text-pink-600 text-xs font-bold transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-blue-50 border border-stone-200 text-stone-700 hover:text-[#1E56A0] text-xs font-bold transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-left relative overflow-hidden">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black font-['Outfit'] text-stone-900">
                    Message Received!
                  </h3>
                  <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-stone-800">{formData.name}</span>.
                    Your project details have been logged in our secure system. An agency director will
                    connect with you shortly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={getWhatsAppUrl(
                        `Hi ZaZu Digital Media, I just submitted an inquiry for ${formData.service} via your website contact form.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Follow Up on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          company: '',
                          service: 'Search Engine Optimization (SEO)',
                          projectTopic: '',
                          message: '',
                        });
                      }}
                      className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-stone-100 pb-4 mb-4">
                    <span className="text-xs font-bold text-[#1E56A0] uppercase tracking-wider">
                      Discovery Form
                    </span>
                    <h3 className="text-2xl font-bold font-['Outfit'] text-[#1E252D] mt-1">
                      Tell Us About Your Project
                    </h3>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Company Name / Brand
                      </label>
                      <input
                        type="text"
                        placeholder="Brand Co."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Required Service *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                      >
                        {services.map((svc) => (
                          <option key={svc} value={svc}>
                            {svc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Project Topic / Main Goal
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Scale E-Commerce Sales by 3x"
                        value={formData.projectTopic}
                        onChange={(e) => setFormData({ ...formData, projectTopic: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Detailed Message / Target KPIs *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your current challenges, target audience, monthly budget range, and timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Submitting Inquiry...' : 'Submit Growth Brief'}</span>
                    </button>

                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-sm transition-all shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
