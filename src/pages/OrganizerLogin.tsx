import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { ShieldCheck, AlertCircle, Lock, Mail } from 'lucide-react';

export const OrganizerLogin: React.FC = () => {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrganizerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Invalid email or password.');
      }

      // 2. Fetch role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle();

      const userRole = (profile?.role || '').toLowerCase();

      if (profileError || userRole !== 'organizer') {
        // Sign out unauthorized user session
        await supabase.auth.signOut();
        throw new Error('Access Denied: This account does not have organizer permissions.');
      }

      // 3. Authorized -> Redirect to Organizer Dashboard
      setLocation('/organizer');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <div className="spider-card p-8 rounded-3xl max-w-md w-full space-y-6 border-red-900/50">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-red-950/60 border border-red-900/50 text-red-500 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Organizer Portal</h1>
          <p className="text-xs text-slate-400">Restricted access for event coordinators and desk staff.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleOrganizerLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Organizer Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@itekronofficial.online"
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
            {loading ? 'Verifying Authorization...' : 'Authenticate Organizer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerLogin;