import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { handleFirestoreError, OperationType } from '../../firebase/errors';
import { WHATSAPP_RAW } from './WhatsAppButton';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService = '',
}) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    service: preselectedService || 'Digital Marketing Strategy',
    preferredDate: '',
    timeSlot: '11:00 AM - 12:00 PM',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        clientName: formData.clientName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
        timeSlot: formData.timeSlot,
        notes: formData.notes.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'bookings'), payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Booking submission error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'bookings');
      } catch (e: any) {
        setErrorMsg('Failed to record consultation booking. Please reach out via WhatsApp or email directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  const servicesList = [
    'Digital Marketing Strategy',
    'Search Engine Optimization (SEO)',
    'Social Media Marketing',
    'Social Media Management',
    'Google Ads / PPC',
    'Branding & Visual Identity',
    'Graphic Design',
    'Website Development',
    'Lead Generation',
    'Content Marketing',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-['Outfit'] text-stone-900 mb-2">
              Discovery Call Requested!
            </h3>
            <p className="text-stone-600 text-sm mb-6 max-w-sm mx-auto">
              Thank you, <span className="font-semibold text-stone-800">{formData.clientName}</span>.
              Our growth strategists will review your request and confirm your appointment slot via email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
                  `Hi ZaZu Digital Media, I just requested a strategy call for ${formData.service} for ${formData.clientName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#20ba59] transition-all"
              >
                Fast-Track on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[#1E56A0] font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Free 30-Min Strategy Call</span>
            </div>
            <h3 className="text-2xl font-black font-['Outfit'] text-[#1E252D] mb-1">
              Book a Growth Consultation
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Connect with senior digital strategists to uncover untapped revenue channels.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 / +1 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Focus Service *</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent"
                >
                  {servicesList.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1E56A0]" /> Preferred Date
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1E56A0]" /> Time Window
                    </span>
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent"
                  >
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM IST</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM IST</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM IST</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM IST</option>
                    <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM IST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Project Goals or Questions</label>
                <textarea
                  rows={2}
                  placeholder="Share any background, website URL, or target KPIs..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Confirming Availability...' : 'Confirm Strategy Session'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
