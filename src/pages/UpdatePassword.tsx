import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';

export const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session && mounted) {
          setError(
            'This password reset link is invalid or has expired. Please request a new reset link.'
          );
        }
      } catch (err: any) {
        console.error('Recovery session error:', err);
        if (mounted) {
          setError(
            err?.message ||
              'Unable to verify the password reset session. Please request a new link.'
          );
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY' && session) {
        setError(null);
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          'Your reset session is no longer active. Please request a new reset link.'
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setUpdated(true);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err?.message || 'Unable to update your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="spider-card max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-red-950/50 border border-red-800 text-red-500 mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create New Password</h1>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Choose a new password for your I-TEKRON 2K26 participant account.
          </p>
        </div>

        {checkingSession ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Verifying your reset link...
          </div>
        ) : updated ? (
          <div className="rounded-2xl border border-emerald-800/70 bg-emerald-950/30 p-6 text-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-white font-bold text-sm">Password Updated Successfully</h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Your new password is active. You can now sign in with your updated
              credentials.
            </p>
            <button
              type="button"
              onClick={() => setLocation('/login')}
              className="mt-5 text-red-400 text-xs font-bold hover:underline"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {!error && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full px-4 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full px-4 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full spider-button-primary py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}

            {error && (
              <button
                type="button"
                onClick={() => setLocation('/forgot-password')}
                className="w-full text-red-400 text-xs font-bold hover:underline"
              >
                Request a New Reset Link
              </button>
            )}
          </>
        )}

        <div className="mt-7 pt-5 border-t border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your password is securely handled by Supabase Authentication. Never
            share your reset link or password with anyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
