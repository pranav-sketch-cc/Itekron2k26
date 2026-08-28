import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { Registration } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { Ticket, QrCode, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const MyRegistrations: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }
    fetchUserRegistrations();
  }, [user]);

  const fetchUserRegistrations = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (*)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError('Failed to fetch your registration passes.');
    } else {
      setRegistrations(data || []);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen pt-24"><LoadingSpinner message="Fetching your event passes..." /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
          Digital Entry Passes
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
          My <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Registrations</span>
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Present your QR pass at event venues for instant check-in.
        </p>
      </div>

      {error && (
        <div className="spider-card max-w-md mx-auto p-4 rounded-2xl text-center text-red-300 text-xs mb-6">
          {error}
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="spider-card max-w-md mx-auto p-8 rounded-3xl text-center space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Event Passes Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't registered for any symposium events yet. Explore events and register to claim your passes.
          </p>
          <Link href="/events" className="spider-button-primary inline-block px-6 py-2.5 rounded-full text-xs font-bold">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div key={reg.id} className="spider-card p-6 rounded-3xl space-y-5 flex flex-col justify-between hover:border-red-500/40 transition">
              <div className="space-y-3">
                {/* Header Status Bar */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-red-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
                    {reg.registration_id}
                  </span>
                  <StatusBadge status={reg.checked_in_at ? 'checked_in' : 'confirmed'} type="checkin" />
                </div>

                {/* Event Name */}
                <h2 className="text-xl font-bold text-white">
                  {reg.events?.name || 'Symposium Event'}
                </h2>

                {/* Event Metadata */}
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{formatDate(reg.events?.date_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{reg.events?.venue || 'TBA'}</span>
                  </div>
                </div>
              </div>

              {/* View Pass Action Button */}
              <Link
                href={`/pass/${reg.registration_id}`}
                className="spider-button-secondary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition"
              >
                <QrCode className="w-4 h-4 text-red-400" />
                <span>View Digital Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};