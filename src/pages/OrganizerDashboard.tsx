import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import { Registration } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Camera, CheckCircle2, ShieldAlert, UserCheck, RefreshCw } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [searchId, setSearchId] = useState('');
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation('/organizer/login');
    }
  }, [user]);

  // Handle camera scanner initialization
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (scannerActive) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 220, height: 220 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          verifyRegistration(decodedText.trim());
          setScannerActive(false);
          scanner?.clear();
        },
        () => {}
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scannerActive]);

  const verifyRegistration = async (regCustomId: string) => {
    setLoading(true);
    setError(null);
    setRegistration(null);

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (*),
        participants (*),
        teams (*, team_members (*))
      `)
      .eq('registration_id', regCustomId.toUpperCase())
      .maybeSingle();

    if (error || !data) {
      setError(`No registration record found for ID: "${regCustomId}"`);
    } else {
      setRegistration(data);
    }
    setLoading(false);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      verifyRegistration(searchId.trim());
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!registration || !user) return;

    setCheckingIn(true);
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        checked_in_at: now,
        checked_in_by: user.email,
      })
      .eq('id', registration.id);

    setCheckingIn(false);

    if (updateError) {
      setError('Check-in failed. Please try again.');
    } else {
      // Refresh local registration state
      setRegistration({
        ...registration,
        checked_in_at: now,
        checked_in_by: user.email || 'Organizer',
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-900/40">
          Organizer Portal
        </span>
        <h1 className="text-3xl font-extrabold text-white">Entry Verification</h1>
      </div>

      {/* Verification Inputs */}
      <div className="spider-card p-6 rounded-3xl space-y-6">
        {/* Search & Scanner Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleManualSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Registration ID (e.g. ITK-8F2A)"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 uppercase font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="spider-button-secondary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Search className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </form>

          <button
            onClick={() => setScannerActive(!scannerActive)}
            className="spider-button-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>{scannerActive ? 'Close Scanner' : 'Scan QR'}</span>
          </button>
        </div>

        {/* Camera Container */}
        {scannerActive && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div id="qr-reader" className="w-full text-slate-300" />
          </div>
        )}
      </div>

      {/* Verification Result */}
      {loading && (
        <div className="spider-card p-8 rounded-2xl text-center text-slate-400 text-sm">
          Searching registration records...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl flex items-center space-x-3 text-red-300 text-xs">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {registration && !loading && (
        <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-6 border-blue-500/40">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-red-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                {registration.registration_id}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2">
                {registration.events?.name}
              </h2>
            </div>
            <StatusBadge status={registration.checked_in_at ? 'checked_in' : 'confirmed'} type="checkin" />
          </div>

          {/* Participant Info */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Participant / Team:</span>
              <span className="font-bold text-white">
                {registration.registration_type === 'team'
                  ? registration.teams?.[0]?.team_name
                  : registration.participants?.[0]?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-300">{registration.participant_email}</span>
            </div>
          </div>

          {/* Check-In Action Section */}
          <div className="pt-2">
            {registration.checked_in_at ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl text-center text-emerald-400 text-xs space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                <p className="font-bold">Already Checked In</p>
                <p className="text-[11px] text-emerald-500">
                  Timestamp: {formatDate(registration.checked_in_at)} by {registration.checked_in_by || 'Organizer'}
                </p>
              </div>
            ) : (
              <button
                onClick={handleConfirmCheckIn}
                disabled={checkingIn}
                className="w-full spider-button-primary py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <UserCheck className="w-5 h-5" />
                <span>{checkingIn ? 'Updating Check-In...' : 'Confirm Check-In'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};