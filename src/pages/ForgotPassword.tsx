import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const redirectTo = `${window.location.origin}/update-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        { redirectTo }
      );

      if (resetError) {
        throw resetError;
      }

      setSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(
        err?.message || 'Unable to send the reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="spider-card max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setLocation('/login')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-7"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-red-950/50 border border-red-800 text-red-500 mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            No worries. Enter the email you used for your I-TEKRON 2K26 account
            and we&apos;ll send you a secure password reset link.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/30 p-5 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-white font-bold text-sm">Reset Email Sent</h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Check <span className="text-white font-semibold">{email}</span>{' '}
              for the password reset link. Please check Spam or Junk if you
              don&apos;t see it in your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full spider-button-primary py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-7 pt-5 border-t border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            For your security, the reset link is sent only through your registered
            email address and can be used to choose a new password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
