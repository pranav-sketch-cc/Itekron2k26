import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Registration, Participant } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, ArrowLeft, Download, CheckCircle2, Calendar, MapPin, Users } from 'lucide-react';

export const DigitalPass: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const passId = params?.id;

  useEffect(() => {
    if (passId) {
      fetchPassData(passId);
    }
  }, [passId]);

  const fetchPassData = async (id: string) => {
    setLoading(true);
    try {
      const { data: reg, error: regErr } = await supabase
        .from('registrations')
        .select(`
          *,
          events (*)
        `)
        .eq('registration_id', id)
        .maybeSingle();

      if (regErr || !reg) {
        setError('Digital Pass record not found.');
        setLoading(false);
        return;
      }

      setRegistration(reg as any);

      const { data: parts } = await supabase
        .from('participants')
        .select('*')
        .eq('registration_id', id);

      if (parts) {
        setParticipants(parts);
      }
    } catch (err) {
      setError('Failed to retrieve Digital Pass.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <LoadingSpinner message="Generating your official digital pass..." />
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-8 rounded-3xl space-y-4">
          <p className="text-xs text-slate-300">{error || 'Pass not found.'}</p>
          <Link href="/my-registrations" className="spider-button-secondary inline-block px-4 py-2 rounded-xl text-xs">
            Return to My Passes
          </Link>
        </div>
      </div>
    );
  }

  const primaryParticipant = participants[0];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      <Link href="/my-registrations" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Passes</span>
      </Link>

      {/* OFFICIAL DIGITAL PASS BADGE */}
      <div className="spider-card rounded-3xl overflow-hidden border-2 border-red-900/60 shadow-2xl relative">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 p-6 text-center space-y-2 border-b border-red-900/40">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="text-sm font-black text-white tracking-wider">ITEKRON 2K26</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 bg-black/50 px-3 py-1 rounded-full border border-red-900/50 block w-fit mx-auto">
            OFFICIAL ENTRY DELEGATE PASS
          </span>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">PASS ID</span>
            <span className="text-2xl font-mono font-black text-red-400 tracking-wider block">{registration.registration_id}</span>
          </div>

          {/* QR CODE CONTAINER */}
          <div className="p-4 bg-white rounded-2xl max-w-[200px] mx-auto shadow-xl border-4 border-slate-800">
            <QRCodeSVG
              value={registration.registration_id}
              size={160}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* EVENT & DELEGATE DETAILS */}
          <div className="space-y-3 pt-2 text-left bg-slate-950 p-4 rounded-2xl border border-slate-900">
            <div className="border-b border-slate-900 pb-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Event Name</span>
              <span className="text-sm font-bold text-white block">{registration.events?.name}</span>
            </div>

            {primaryParticipant && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Delegate</span>
                  <span className="text-white font-semibold">{primaryParticipant.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">College</span>
                  <span className="text-slate-300 truncate block">{primaryParticipant.college}</span>
                </div>
              </div>
            )}

            {registration.team_name && (
              <div className="pt-2 border-t border-slate-900 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Team Name</span>
                <span className="text-blue-400 font-bold">{registration.team_name} ({participants.length} Members)</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Show this QR code at the desk scanner for entry validation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalPass;