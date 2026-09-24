import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  variant?: 'floating' | 'button' | 'badge';
  className?: string;
  label?: string;
}

export const WHATSAPP_NUMBER = '+91 97895 04702';
export const WHATSAPP_RAW = '919789504702';
export const AGENCY_EMAIL = 'digitalmediazazu@gmail.com';
export const INSTAGRAM_URL = 'https://www.instagram.com/zazudigitalmedia/';
export const LINKEDIN_URL = 'https://www.linkedin.com/company/zazu-digital-media/';

export const getWhatsAppUrl = (customMessage?: string) => {
  const defaultText =
    customMessage ||
    'Hello ZaZu Digital Media! I would like to discuss elevating our brand with your digital marketing, SEO, and growth services.';
  return `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(defaultText)}`;
};

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  variant = 'button',
  className = '',
  label = 'Chat on WhatsApp',
}) => {
  const url = getWhatsAppUrl(message);

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group font-medium text-sm"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-semibold tracking-wide">Chat on WhatsApp</span>
      </a>
    );
  }

  if (variant === 'badge') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-2.5 py-1 rounded-full transition-colors ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>+91 97895 04702</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span>{label}</span>
    </a>
  );
};
