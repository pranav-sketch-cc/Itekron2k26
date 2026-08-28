import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const exchangeAttempted = useRef<boolean>(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent React StrictMode duplicate execution
      if (exchangeAttempted.current) return;
      exchangeAttempted.current = true;

      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      // 1. Check for error parameters in URL query/hash
      const errorDescription = params.get('error_description') || hashParams.get('error_description');
      if (errorDescription) {
        setError(decodeURIComponent(errorDescription));
        return;
      }

      // 2. Handle PKCE Code Exchange Flow (code in query string)
      const code = params.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        setSuccess(true);
        setTimeout(() => setLocation('/my-registrations'), 1500);
        return;
      }

      // 3. Fallback: Check existing session or implicit hash token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (session) {
        setSuccess(true);
        setTimeout(() => setLocation('/my-registrations'), 1500);
      } else if (sessionError) {
        setError(sessionError.message);
      } else {
        // If hash parameters exist, subscribe briefly for session state change
        if (window.location.hash.includes('access_token')) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (newSession) {
              setSuccess(true);
              setTimeout(() => setLocation('/my-registrations'), 1500);
            }
          });

          setTimeout(() => {
            subscription.unsubscribe();
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                setSuccess(true);
                setTimeout(() => setLocation('/my-registrations'), 1500);
              } else {
                setError('Verification link expired or session could not be established.');
              }
            });
          }, 2000);
        } else {
          setError('Invalid or missing verification parameters.');
        }
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <div className="spider-card p-8 rounded-3xl text-center max-w-md w-full">
        {error ? (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-red-950/40 p-3 rounded-xl border border-red-900/40">
              {error}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setLocation('/login')}
                className="spider-button-primary inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-bold"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : success ? (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-white">Account Verified!</h2>
            <p className="text-xs text-slate-300">
              Your email has been confirmed. Redirecting to your registrations...
            </p>
          </div>
        ) : (
          <LoadingSpinner message="Verifying authentication session..." />
        )}
      </div>
    </div>
  );
};

export default AuthCallback;