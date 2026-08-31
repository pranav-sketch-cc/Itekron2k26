import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const Signup: React.FC = () => {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    setLoading(true);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signupError } = await signUp(
        cleanEmail,
        password,
        cleanName
      );

      if (signupError) {
        throw signupError;
      }

      /*
       * Supabase may return a user/session depending on
       * whether email confirmation is enabled.
       *
       * We don't assume either behaviour here.
       */
      if (data) {
        setSuccess(true);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('SIGNUP ERROR:', err);

      setError(
        err?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <div className="spider-card p-8 rounded-3xl max-w-md w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-red-950/60 border border-red-900/50 text-red-500 mb-1">
            <Shield className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-white">
            Create Account
          </h1>

          <p className="text-xs text-slate-400">
            Register as a participant for ITEKRON 2K26.
          </p>
        </div>

        {/* Success */}
        {success ? (
          <div className="p-6 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-center space-y-3 text-xs">

            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />

            <h3 className="font-bold text-white text-sm">
              Account Created Successfully
            </h3>

            <p className="text-slate-300">
              Your account has been created using
              <strong className="text-white">
                {' '}
                {email}
              </strong>
              .
            </p>

            <p className="text-slate-400">
              If email verification is enabled, please check your
              inbox and verify your email before signing in.
            </p>

            <Link
              href="/login"
              className="spider-button-primary inline-block px-6 py-2.5 rounded-xl font-bold mt-2"
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Error */}
            {error && (
              <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />

                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                Full Name
              </label>

              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                Email Address
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  autoComplete="email"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full spider-button-primary py-3 rounded-2xl text-xs font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}

        {/* Login */}
        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}

          <Link
            href="/login"
            className="text-red-400 font-bold hover:underline"
          >
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;