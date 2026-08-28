import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { Registration, Participant } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ShieldAlert, CheckCircle2, QrCode, Search, LogOut, Check, Users, Camera, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const OrganizerDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [activeReg, setActiveReg] = useState<Registration | null>(null);
  const [activeParticipants, setActiveParticipants] = useState<Participant[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  // Camera Scanner Modal State
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    verifyOrganizerRole();
  }, []);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          let cleanText = decodedText.trim();
          if (cleanText.includes('/pass/')) {
            cleanText = cleanText.split('/pass/').pop() || cleanText;
          }

          setSearchId(cleanText);
          setShowScanner(false);
          scanner?.clear();

          executeSearchPass(cleanText);
        },
        () => {}
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [showScanner]);

  const verifyOrganizerRole = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setLocation('/organizer/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle();

    const userRole = (profile?.role || '').toLowerCase();

    if (!profile || userRole !== 'organizer') {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);
    setLoading(false);
  };

  const executeSearchPass = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;

    setStatusMessage(null);
    setActiveReg(null);
    setActiveParticipants([]);

    const cleanId = idToSearch.trim().toUpperCase();

    const { data: reg, error: regErr } = await supabase
      .from('registrations')
      .select(`
        *,
        events (*)
      `)
      .eq('registration_id', cleanId)
      .maybeSingle();

    if (regErr || !reg) {
      setStatusMessage({ type: 'error', text: `Pass ID '${cleanId}' not found in database.` });
      return;
    }

    setActiveReg(reg as any);

    const { data: parts } = await supabase
      .from('participants')
      .select('*')
      .eq('registration_id', cleanId);

    if (parts) {
      setActiveParticipants(parts);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearchPass(searchId);
  };

  const handleConfirmCheckIn = async () => {
    if (!activeReg) return;

    setCheckingIn(true);
    setStatusMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // 1. Attempt standard update
      let { error: updateErr } = await supabase
        .from('registrations')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
          checked_in_by: session?.user?.id || null,
        })
        .eq('registration_id', activeReg.registration_id);

      // 2. Fallback: If checked_in_by or checked_in_at columns are structured differently, update just checked_in
      if (updateErr) {
        const { error: simpleErr } = await supabase
          .from('registrations')
          .update({
            checked_in: true,
          })
          .eq('registration_id', activeReg.registration_id);

        updateErr = simpleErr;
      }

      setCheckingIn(false);

      if (updateErr) {
        setStatusMessage({ type: 'error', text: 'Failed to update check-in status: ' + updateErr.message });
      } else {
        setActiveReg({ ...activeReg, checked_in: true });
        setStatusMessage({ type: 'success', text: `Successfully checked in Pass ${activeReg.registration_id}!` });
      }
    } catch (err: any) {
      setCheckingIn(false);
      setStatusMessage({ type: 'error', text: err.message || 'Check-in failed.' });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLocation('/organizer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <LoadingSpinner message="Verifying organizer session..." />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-8 rounded-3xl space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Unauthorized Access</h2>
          <p className="text-xs text-slate-300">You must be logged in with an organizer account to access this dashboard.</p>
          <button
            onClick={() => setLocation('/organizer/login')}
            className="spider-button-primary px-6 py-2.5 rounded-full text-xs font-bold"
          >
            Go to Organizer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-900/50">
            Desk Organizer
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Verification Desk</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Lookup Bar & Scanner Trigger */}
      <div className="spider-card p-6 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <QrCode className="w-4 h-4 text-red-400" />
            <span>Lookup Digital Pass</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="spider-button-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>
        </div>

        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter or paste Pass ID (e.g. ITK-2K26-XXXX)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            className="spider-button-secondary px-6 py-2.5 rounded-xl text-xs font-bold text-white"
          >
            Search
          </button>
        </form>

        {statusMessage && (
          <div className={`p-4 rounded-2xl flex items-center space-x-2 text-xs ${
            statusMessage.type === 'success' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300' : 'bg-red-950/80 border border-red-800 text-red-300'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* CAMERA SCANNER MODAL */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 text-center relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Camera className="w-4 h-4 text-red-400" />
                <span>Scan Participant Pass</span>
              </h3>
              <button
                onClick={() => setShowScanner(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="qr-reader" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"></div>

            <p className="text-[10px] text-slate-400">
              Point your camera at the QR code displayed on the participant's Digital Pass.
            </p>
          </div>
        </div>
      )}

      {/* Active Pass Record Details */}
      {activeReg && (
        <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-6 border-red-900/40">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-400">{activeReg.registration_id}</span>
              <h2 className="text-xl font-bold text-white">{activeReg.events?.name}</h2>
              <p className="text-xs text-slate-400">Venue: {activeReg.events?.venue || 'TBA'}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              activeReg.checked_in ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {activeReg.checked_in ? 'Already Checked In' : 'Pending Check-In'}
            </span>
          </div>

          {/* Delegate List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Registered Delegate(s)</span>
            </h3>

            <div className="space-y-2">
              {activeParticipants.map((part, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{part.name}</p>
                    <p className="text-[10px] text-slate-400">{part.email} • {part.phone}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    {part.college || 'Participant'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Check-in Button */}
          <div className="pt-2">
            {activeReg.checked_in ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-center text-emerald-400 text-xs font-bold flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Delegate Entry Validated</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmCheckIn}
                disabled={checkingIn}
                className="w-full spider-button-primary py-3.5 rounded-2xl text-xs font-bold disabled:opacity-50"
              >
                {checkingIn ? 'Processing...' : 'Confirm Participant Check-In'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;