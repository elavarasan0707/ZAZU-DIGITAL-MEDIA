import React, { useEffect, useState } from 'react';

export const ThreeDBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax offsets based on mouse tracking
  const offsetX = mousePos.x * 32;
  const offsetY = mousePos.y * 32;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ perspective: '1400px' }}
      aria-hidden="true"
    >
      {/* 1. Base Warm Luxury Background */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* 2. Interactive Isometric 3D Grid Plane */}
      <div
        className="absolute inset-0 opacity-[0.25] transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30, 86, 160, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 86, 160, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
          transform: `perspective(1000px) rotateX(${52 + mousePos.y * 6}deg) rotateZ(${mousePos.x * 4}deg) scale(1.7) translateY(${offsetY * 0.5}px)`,
          transformOrigin: 'top center',
          maskImage: 'radial-gradient(ellipse at 50% 35%, black 25%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 35%, black 25%, transparent 85%)',
        }}
      />

      {/* 3. Volumetric Glowing Ambient Lights (Breathing Aura) */}
      {/* Royal Blue Halo */}
      <div
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full blur-3xl opacity-60 transition-transform duration-1000 ease-out animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(30,86,160,0.24) 0%, rgba(74,132,206,0.12) 45%, transparent 75%)',
          transform: `translate3d(${offsetX * 0.8}px, ${offsetY * 0.8}px, -120px)`,
        }}
      />

      {/* Warm 24K Gold Ambient Glow */}
      <div
        className="absolute top-1/4 -right-28 w-[720px] h-[720px] rounded-full blur-3xl opacity-50 transition-transform duration-1000 ease-out animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(226,201,161,0.32) 0%, rgba(196,155,93,0.18) 50%, transparent 80%)',
          transform: `translate3d(${-offsetX * 0.9}px, ${-offsetY * 0.9}px, -140px)`,
          animationDelay: '1.5s',
        }}
      />

      {/* Deep Indigo/Cyan Base Highlight */}
      <div
        className="absolute -bottom-48 left-1/3 w-[800px] h-[800px] rounded-full blur-3xl opacity-45 transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(30,86,160,0.18) 0%, rgba(240,230,215,0.4) 65%, transparent 85%)',
          transform: `translate3d(${offsetX * 0.6}px, ${offsetY * 0.6}px, -60px)`,
        }}
      />

      {/* 4. Hero 3D Metallic ZaZu Gold Wing Ring (Upper Right) */}
      <div
        className="absolute top-12 right-[10%] w-80 h-80 opacity-[0.38] transition-transform duration-500 ease-out animate-float-3d"
        style={{
          transform: `
            translate3d(${-offsetX * 1.3}px, ${-offsetY * 1.3}px, 80px)
            rotateX(${20 - mousePos.y * 22}deg)
            rotateY(${-30 + mousePos.x * 28}deg)
            rotateZ(-8deg)
          `,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 30px 45px rgba(30, 86, 160, 0.18))',
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="zazuGoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#F5DFB8" />
              <stop offset="65%" stopColor="#C49B5D" />
              <stop offset="100%" stopColor="#7A521E" />
            </linearGradient>
            <linearGradient id="zazuCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6BA3E8" />
              <stop offset="50%" stopColor="#1E56A0" />
              <stop offset="100%" stopColor="#0B2344" />
            </linearGradient>
            <filter id="goldBevel" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor="#1E252D" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#goldBevel)">
            {/* Outer Orbit Ring */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#zazuGoldMetallic)"
              strokeWidth="9"
              opacity="0.9"
            />
            {/* Sculpted Wing Sweep */}
            <path
              d="M 35 100 C 45 55, 95 35, 148 40 C 168 44, 180 60, 172 80 C 160 62, 130 50, 95 62 C 58 74, 42 95, 35 100 Z"
              fill="url(#zazuGoldMetallic)"
            />
            {/* Secondary Inner Crescent */}
            <path
              d="M 50 115 C 65 145, 115 155, 155 135 C 140 142, 105 145, 80 130 C 65 120, 55 110, 50 115 Z"
              fill="url(#zazuGoldMetallic)"
              opacity="0.85"
            />
            {/* Center Sapphire Core */}
            <circle cx="100" cy="95" r="24" fill="url(#zazuCoreGlow)" />
            <circle cx="93" cy="88" r="7" fill="#FFFFFF" opacity="0.9" />
          </g>
        </svg>
      </div>

      {/* 5. 3D Floating Sapphire Sphere with Realistic Specular Highlight (Left Midground) */}
      <div
        className="absolute top-[42%] left-[5%] w-48 h-48 rounded-full opacity-[0.42] transition-transform duration-500 ease-out animate-float-reverse-3d"
        style={{
          background: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E1ECFA 20%, #76A6E0 55%, #1E56A0 90%, #0F2D54 100%)',
          boxShadow: 'inset -14px -14px 28px rgba(15, 45, 84, 0.45), 20px 30px 50px rgba(30, 86, 160, 0.22)',
          transform: `
            translate3d(${offsetX * 1.25}px, ${offsetY * 1.25}px, 60px)
            scale(${1 + Math.abs(mousePos.x) * 0.06})
          `,
        }}
      />

      {/* 6. Orbiting 3D Metallic Gold Torus Ring (Bottom Right) */}
      <div
        className="absolute bottom-20 right-[7%] w-60 h-60 opacity-[0.32] transition-transform duration-600 ease-out animate-rotate-slow-3d"
        style={{
          transform: `
            translate3d(${-offsetX * 1.1}px, ${-offsetY * 1.1}px, 40px)
            rotateX(${38 + mousePos.y * 20}deg)
            rotateY(${-20 + mousePos.x * 25}deg)
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="w-full h-full rounded-full border-[18px] border-transparent"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF, #E2C9A1, #C49B5D, #8A652E, #5C3E14) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            boxShadow: '0 25px 50px rgba(196, 155, 93, 0.3)',
          }}
        />
      </div>

      {/* 7. Floating 3D Frosted Glass Diamond / Prism (Bottom Left) */}
      <div
        className="absolute bottom-[22%] left-[14%] w-32 h-32 opacity-[0.35] transition-transform duration-600 ease-out animate-float-3d"
        style={{
          transform: `
            translate3d(${offsetX * 0.9}px, ${offsetY * 0.9}px, 50px)
            rotateX(${28 - mousePos.y * 25}deg)
            rotateY(${50 + mousePos.x * 30}deg)
            rotateZ(45deg)
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/95 via-blue-50/60 to-amber-100/40 border-2 border-white/90 shadow-2xl backdrop-blur-md" />
      </div>

      {/* 8. Luminous Particle Constellation Nodes (Cyber Sparks & Golden Dust) */}
      <div
        className="absolute top-[18%] left-[42%] w-3.5 h-3.5 rounded-full bg-blue-500 opacity-70 blur-[0.4px] animate-pulse"
        style={{
          boxShadow: '0 0 16px 4px rgba(30, 86, 160, 0.55)',
          transform: `translate3d(${offsetX * 1.8}px, ${offsetY * 1.8}px, 90px)`,
        }}
      />
      <div
        className="absolute top-[32%] right-[28%] w-4 h-4 rounded-full bg-amber-400 opacity-75 blur-[0.4px] animate-pulse"
        style={{
          boxShadow: '0 0 18px 5px rgba(226, 201, 161, 0.65)',
          transform: `translate3d(${-offsetX * 1.6}px, ${-offsetY * 1.6}px, 110px)`,
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute top-[58%] right-[40%] w-3 h-3 rounded-full bg-blue-400 opacity-65 blur-[0.4px] animate-pulse"
        style={{
          boxShadow: '0 0 14px 4px rgba(74, 132, 206, 0.5)',
          transform: `translate3d(${offsetX * 1.4}px, ${offsetY * 1.4}px, 75px)`,
          animationDelay: '2.2s',
        }}
      />
      <div
        className="absolute bottom-[28%] left-[38%] w-4.5 h-4.5 rounded-full bg-amber-500 opacity-60 blur-[0.5px] animate-pulse"
        style={{
          boxShadow: '0 0 20px 6px rgba(196, 155, 93, 0.5)',
          transform: `translate3d(${-offsetX * 1.5}px, ${-offsetY * 1.5}px, 100px)`,
          animationDelay: '3.1s',
        }}
      />
      <div
        className="absolute bottom-[12%] right-[22%] w-3 h-3 rounded-full bg-blue-600 opacity-60 blur-[0.4px] animate-pulse"
        style={{
          boxShadow: '0 0 12px 3px rgba(30, 86, 160, 0.45)',
          transform: `translate3d(${offsetX * 1.3}px, ${offsetY * 1.3}px, 60px)`,
          animationDelay: '1.8s',
        }}
      />

      {/* 9. Light Beams / Sun Rays Accent */}
      <div
        className="absolute top-0 right-1/4 w-[2px] h-[400px] opacity-15"
        style={{
          background: 'linear-gradient(to bottom, rgba(226, 201, 161, 0.8), transparent)',
          transform: `rotate(35deg) translate3d(${-offsetX * 0.5}px, 0, 0)`,
        }}
      />
      <div
        className="absolute top-0 right-1/3 w-[2px] h-[550px] opacity-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(30, 86, 160, 0.7), transparent)',
          transform: `rotate(35deg) translate3d(${offsetX * 0.4}px, 0, 0)`,
        }}
      />
    </div>
  );
};
