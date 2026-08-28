import React, { useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    // Dynamic redirect URL based on current host origin (production-safe, no hardcoded localhost)
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectUrl = `${origin}/auth/callback`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setLoading(false);

    if (signUpError) {
      // Handle actual existing account responses from Supabase API
      const errMsg = signUpError.message.toLowerCase();
      if (
        errMsg.includes('already registered') ||
        errMsg.includes('user already exists') ||
        errMsg.includes('email address is already registered')
      ) {
        setError('An account with this email already exists. Please try logging in.');
      } else {
        setError(signUpError.message);
      }
      return;
    }

    // Success response: session will be null if email confirmation is required by Supabase
    if (data?.user) {
      setSuccess(true);
    } else {
      setError('An unexpected error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Join ITEKRON 2K26 to register for events and manage your digital passes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="spider-card p-8 rounded-2xl shadow-xl">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white">Account Created Successfully</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Account created successfully. Please check your email (<span className="text-red-400 font-semibold">{email}</span>) to verify your account.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <Link href="/login" className="spider-button-primary inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-semibold">
                  <span>Go to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-center space-x-2 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full spider-button-primary py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <p className="text-center text-xs text-slate-400 pt-2">
                Already have an account?{' '}
                <Link href="/login" className="text-red-400 hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;