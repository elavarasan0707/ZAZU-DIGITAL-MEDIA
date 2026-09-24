import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Could not send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-[#FAF8F5] min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-left">
        <div className="text-center mb-8">
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer inline-block mb-3"
          >
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-black font-['Outfit'] text-[#1E252D]">
            Reset Password
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            We will send a secure password reset link to your email address
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-['Outfit'] text-stone-900">
              Reset Link Dispatched
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              We’ve dispatched instructions to <span className="font-semibold text-stone-800">{email}</span>. Please verify your inbox and spam folders.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 bg-[#1E56A0] text-white font-bold rounded-xl text-xs hover:bg-[#164280] transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Sending Link...' : 'Send Recovery Email'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
