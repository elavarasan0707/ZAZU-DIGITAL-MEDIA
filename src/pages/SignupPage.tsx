import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signupWithEmail, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signupWithEmail(email.trim(), password, name.trim());
      onNavigate('dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please sign in instead.');
      } else {
        setError(err.message || 'Could not complete registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onNavigate('dashboard');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-transparent relative z-10 min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-2xl text-left card-3d">
        <div className="text-center mb-8">
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer inline-block mb-3"
          >
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-[#1E252D]">
            Create ZaZu Portal Account
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Access campaign briefs, strategic reports, and direct agency updates
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-3 px-4 border border-stone-300 rounded-xl font-bold text-xs text-stone-700 bg-white hover:bg-stone-50 transition-all flex items-center justify-center gap-3 shadow-2xs mb-5 disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign Up with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
            Or Register With Email
          </span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Work Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Password (Min 6 Characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Registering Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-bold text-[#1E56A0] hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
