import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'badge' | '3d-render';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-xl', sub: 'text-[9px] tracking-[0.25em]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px] tracking-[0.28em]' },
    lg: { icon: 'w-14 h-14', text: 'text-4xl', sub: 'text-[12px] tracking-[0.32em]' },
    xl: { icon: 'w-24 h-24', text: 'text-6xl', sub: 'text-[16px] tracking-[0.35em]' },
  };

  const currentSize = sizeMap[size];

  // 3D Render Image Variant (uses generated high-res realistic 3D asset)
  if (variant === '3d-render') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <div className="relative group overflow-hidden rounded-2xl bg-white shadow-xl shadow-stone-200/60 border border-stone-200/80 p-2 transition-transform duration-500 hover:scale-[1.02]">
          <img
            src="/images/zazu-logo.jpg"
            alt="ZaZu Digital Media 3D Logo"
            className="w-full h-auto object-cover rounded-xl"
            onError={(e) => {
              // fallback if local path issue
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }

  // Precision 3D Vector Emblem replicating the uploaded owl brand identity
  const OwlIcon = ({ iconClass = currentSize.icon }: { iconClass?: string }) => (
    <div className={`relative ${iconClass} flex items-center justify-center shrink-0`}>
      <svg
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(22,27,34,0.22)]"
      >
        <defs>
          {/* 3D Dark Charcoal Matte Gradient */}
          <linearGradient id="charcoal3D" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#3A4048" />
            <stop offset="50%" stopColor="#1E232A" />
            <stop offset="100%" stopColor="#11151A" />
          </linearGradient>

          {/* 3D Metallic Royal Blue Gradient */}
          <linearGradient id="blue3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="45%" stopColor="#1E56A0" />
            <stop offset="100%" stopColor="#103770" />
          </linearGradient>

          {/* Soft Drop Shadow Filter */}
          <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Mask / Brow Curve */}
        <path
          d="M 50 18 C 36 6 18 10 14 18 C 12 28 14 36 10 44 C 7 50 8 57 14 62 C 22 70 34 68 44 56 C 47 52 49 53 50 56 C 51 53 53 52 56 56 C 66 68 78 70 86 62 C 92 57 93 50 90 44 C 86 36 88 28 86 18 C 82 10 64 6 50 18 Z"
          fill="url(#charcoal3D)"
          filter="url(#shadow3D)"
        />

        {/* Left Eye Cutout & Eyeball */}
        <circle cx="34" cy="44" r="14" fill="#F8F6F0" />
        <circle cx="34" cy="44" r="12" fill="url(#charcoal3D)" />
        <circle cx="34" cy="42" r="6.5" fill="#11151A" />
        <circle cx="36" cy="40" r="2.2" fill="#FFFFFF" />

        {/* Right Eye Cutout & Eyeball */}
        <circle cx="66" cy="44" r="14" fill="#F8F6F0" />
        <circle cx="66" cy="44" r="12" fill="url(#charcoal3D)" />
        <circle cx="66" cy="42" r="6.5" fill="#11151A" />
        <circle cx="68" cy="40" r="2.2" fill="#FFFFFF" />

        {/* Sleek Beak Point */}
        <polygon points="50,56 46,67 54,67" fill="url(#charcoal3D)" />
        <polygon points="50,60 48,68 52,68" fill="#103770" />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <OwlIcon />;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <OwlIcon />
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-tight ${currentSize.text} font-['Outfit'] flex items-center drop-shadow-sm`}>
          <span className="text-[#1E56A0] drop-shadow-[0_1px_1px_rgba(30,86,160,0.3)]">Za</span>
          <span className="text-[#1E252D] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">Zu</span>
        </div>
        {showSubtitle && (
          <div className={`font-bold font-['Plus_Jakarta_Sans'] ${currentSize.sub} uppercase mt-0.5 flex items-center gap-1`}>
            <span className="text-[#2B303A]">DIGITAL</span>
            <span className="text-[#1E56A0]">MEDIA</span>
          </div>
        )}
      </div>
    </div>
  );
};
