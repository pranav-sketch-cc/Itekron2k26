import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { Registration } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const DigitalPass: React.FC = () => {
  const params = useParams<{ registrationId: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const registrationCustomId = params?.registrationId;

  useEffect(() => {
    if (registrationCustomId) {
      fetchPassDetails(registrationCustomId);
    }
  }, [registrationCustomId]);

  const fetchPassDetails = async (regId: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (*),
        participants (*),
        teams (*, team_members (*))
      `)
      .eq('registration_id', regId)
      .single();

    if (error || !data) {
      setError('Digital pass record not found.');
    } else {
      setRegistration(data);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen pt-24"><LoadingSpinner message="Generating digital pass..." /></div>;

  if (error || !registration) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-6 rounded-2xl text-slate-300 space-y-4">
          <p>{error || 'Invalid Digital Pass'}</p>
          <Link href="/my-registrations" className="spider-button-secondary inline-block px-4 py-2 rounded-xl text-xs">
            Return to My Passes
          </Link>
        </div>
      </div>
    );
  }

  const isCheckedIn = Boolean(registration.checked_in_at);
  const isTeam = registration.registration_type === 'team';
  const participantName = isTeam 
    ? registration.teams?.[0]?.team_name 
    : registration.participants?.[0]?.name;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <Link href="/my-registrations" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Passes</span>
      </Link>

      {/* Ticket Container */}
      <div className="spider-card rounded-3xl overflow-hidden border border-red-500/30 shadow-2xl">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-blue-950/80 p-6 text-center border-b border-red-900/40">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-400 block mb-1">
            ITEKRON 2K26 OFFICIAL PASS
          </span>
          <h1 className="text-xl font-black text-white tracking-tight">
            {registration.events?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isTeam ? `Team: ${participantName}` : `Participant: ${participantName}`}
          </p>
        </div>

        {/* Real QR Code Display */}
        <div className="p-8 text-center bg-slate-950/90 space-y-4">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
            <QRCodeSVG
              value={registration.registration_id}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Registration ID</span>
            <span className="text-2xl font-mono font-black text-red-400 tracking-wider">
              {registration.registration_id}
            </span>
          </div>

          <div className="pt-2">
            <StatusBadge 
              status={isCheckedIn ? 'checked_in' : 'confirmed'} 
              type="checkin" 
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 bg-slate-900/60 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date & Time</span>
            <span className="font-semibold text-white">{formatDate(registration.events?.date_time)}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Venue</span>
            <span className="font-semibold text-white">{registration.events?.venue || 'TBA'}</span>
          </div>

          {isCheckedIn && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-center text-emerald-400 text-[11px] font-medium space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Checked-in at {formatDate(registration.checked_in_at!)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};