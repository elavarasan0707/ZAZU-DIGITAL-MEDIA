import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Instagram,
  Linkedin,
  User,
  ShieldCheck,
  Calendar,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { INSTAGRAM_URL, LINKEDIN_URL, WHATSAPP_RAW } from './WhatsAppButton';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
}) => {
  const { user, isAdmin, logout, adminDemoMode, setAdminDemoMode } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top micro-bar for quick contact and demo admin switch */}
      <div className="bg-[#1E252D] text-stone-300 text-xs py-1.5 px-4 hidden md:block border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-stone-300">Available for Q4 Client Onboarding</span>
            </span>
            <a
              href="mailto:digitalmediazazu@gmail.com"
              className="text-stone-400 hover:text-white transition-colors"
            >
              digitalmediazazu@gmail.com
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_RAW}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#25D366] transition-colors"
            >
              WhatsApp: +91 97895 04702
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-stone-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-stone-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F6F0]/90 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3'
            : 'bg-[#F8F6F0] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#1E56A0] bg-blue-50/70 font-bold'
                      : 'text-stone-700 hover:text-[#1E56A0] hover:bg-stone-200/40'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1E56A0] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1E56A0] bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-all shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Call</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  currentPage === 'dashboard'
                    ? 'bg-[#1E252D] text-white'
                    : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Admin CMS</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-[#1E56A0] flex items-center justify-center font-bold text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {user.displayName || 'Member'}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#1E56A0]" />
                      <span>Account Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-2 text-xs font-bold text-stone-700 hover:text-[#1E56A0] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1E56A0] hover:bg-[#164280] rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="p-2 text-[#1E56A0] bg-blue-50 rounded-xl"
              aria-label="Book Call"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-950 rounded-xl hover:bg-stone-200/50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === link.id
                        ? 'bg-[#1E56A0] text-white font-bold'
                        : 'text-stone-700 hover:bg-stone-200/50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 bg-blue-50/80 border border-blue-200 flex items-center justify-between mt-3"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1E56A0]" />
                      <span>Admin CMS Portal</span>
                    </span>
                    <span className="text-[10px] bg-[#1E56A0] text-white px-2 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  </button>
                )}
                {user && !isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 bg-stone-100 flex items-center justify-between mt-3"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#1E56A0]" />
                      <span>My Client Account</span>
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 bg-[#1E56A0] text-white font-bold rounded-xl text-sm shadow-md"
              >
                Book Strategy Call
              </button>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 hover:text-pink-600"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 hover:text-blue-600"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>

                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-red-600"
                  >
                    Log Out
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 rounded-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#1E56A0] rounded-lg"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
