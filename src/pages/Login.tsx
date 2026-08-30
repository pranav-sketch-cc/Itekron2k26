import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const auth = useAuth() as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Safely access whatever authentication function exists in AuthContext
      const loginFn = auth.signInWithPassword || auth.signIn || auth.login;

      if (typeof loginFn !== 'function') {
        throw new Error('Authentication method is not defined in AuthContext.');
      }

      const res = await loginFn(email, password);
      if (res?.error) {
        throw res.error;
      }

      setLocation('/events');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      <div className="spider-card max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-red-950/50 border border-red-800 text-red-500 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Participant Login</h1>
          <p className="text-slate-400 text-xs mt-2">Enter your credentials to access registrations and pass details.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full spider-button-primary py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account yet?{' '}
          <button onClick={() => setLocation('/signup')} className="text-red-400 font-bold hover:underline">
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;