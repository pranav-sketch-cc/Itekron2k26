import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [, setLocation] = useLocation();
  const auth = useAuth() as any;
  
  // Support whichever method name exists in AuthContext
  const loginFn = auth.signIn || auth.login || auth.signInWithPassword;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginFn(email.trim(), password);
      if (result?.error) throw result.error;

      setLocation('/events');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <div className="spider-card p-8 rounded-3xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-red-950/60 border border-red-900/50 text-red-500 mb-1">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Participant Login</h1>
          <p className="text-xs text-slate-400">Enter your credentials to access registrations and pass details.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full spider-button-primary py-3 rounded-2xl text-xs font-bold shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link href="/signup" className="text-red-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;