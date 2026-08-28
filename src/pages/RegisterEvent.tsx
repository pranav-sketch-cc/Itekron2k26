import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateRegistrationId } from '../lib/utils';
import { ArrowLeft, CheckCircle2, AlertCircle, Ticket } from 'lucide-react';

interface TeamMemberInput {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  food_preference: 'Vegetarian' | 'Non-Vegetarian';
  is_team_leader: boolean;
}

export const RegisterEvent: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successRegistrationId, setSuccessRegistrationId] = useState<string | null>(null);

  // Individual Form Fields
  const [indName, setIndName] = useState('');
  const [indPhone, setIndPhone] = useState('');
  const [indCollege, setIndCollege] = useState('');
  const [indDept, setIndDept] = useState('');
  const [indYear, setIndYear] = useState('1st Year');
  const [indFood, setIndFood] = useState<'Vegetarian' | 'Non-Vegetarian'>('Vegetarian');

  // Team Form Fields
  const [teamName, setTeamName] = useState('');
  const [teamCollege, setTeamCollege] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);

  const eventId = params?.id;

  useEffect(() => {
    if (!user) {
      setLocation('/login');
      return;
    }

    if (eventId) {
      fetchEventData(eventId);
    }
  }, [eventId, user]);

  const fetchEventData = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !data) {
        setError('Event configuration not found.');
        setLoading(false);
        return;
      }

      setEvent(data);

      const parsedTeamSize = Number(data.team_size) || 1;
      const isTeam = data.team_type === 'team' || parsedTeamSize > 1;

      if (isTeam) {
        const requiredSize = parsedTeamSize > 1 ? parsedTeamSize : 2;
        const initialMembers: TeamMemberInput[] = [];

        for (let i = 0; i < requiredSize; i++) {
          initialMembers.push({
            name: i === 0 ? user?.user_metadata?.full_name || '' : '',
            email: i === 0 ? user?.email || '' : '',
            phone: '',
            department: '',
            year: '1st Year',
            food_preference: 'Vegetarian',
            is_team_leader: i === 0,
          });
        }
        setTeamMembers(initialMembers);
      }
    } catch (err) {
      setError('Failed to load event data.');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMemberInput, value: any) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !user) return;

    setError(null);
    setSubmitting(true);

    const customRegId = generateRegistrationId();
    const parsedTeamSize = Number(event.team_size) || 1;
    const isTeam = event.team_type === 'team' || parsedTeamSize > 1;

    try {
      // 1. Check duplicate registration in public.registrations
      const { data: existingReg } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingReg) {
        throw new Error('You are already registered for this event.');
      }

      // 2. Insert primary row into public.registrations
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert({
          registration_id: customRegId,
          event_id: event.id,
          user_id: user.id,
          registration_type: isTeam ? 'team' : 'individual',
          status: 'confirmed',
        })
        .select()
        .single();

      if (regError || !regData) {
        throw new Error(regError?.message || 'Failed to insert registration.');
      }

      // 3. Insert into public.participants OR public.teams & public.team_members
      if (!isTeam) {
        const { error: partErr } = await supabase.from('participants').insert({
          registration_id: customRegId,
          name: indName,
          email: user.email,
          phone: indPhone,
          college: indCollege,
          department: indDept,
          year: indYear,
          food_preference: indFood,
        });

        if (partErr) throw new Error(partErr.message);
      } else {
        const { data: teamData, error: teamErr } = await supabase
          .from('teams')
          .insert({
            registration_id: customRegId,
            team_name: teamName,
            college: teamCollege,
          })
          .select()
          .single();

        if (teamErr || !teamData) throw new Error(teamErr?.message || 'Failed to create team.');

        const membersToInsert = teamMembers.map((m) => ({
          team_id: teamData.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          department: m.department,
          year: m.year,
          food_preference: m.food_preference,
          is_team_leader: m.is_team_leader,
        }));

        const { error: membersErr } = await supabase
          .from('team_members')
          .insert(membersToInsert);

        if (membersErr) throw new Error(membersErr.message);
      }

      setSuccessRegistrationId(customRegId);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <LoadingSpinner message="Loading registration form..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-6 rounded-3xl text-slate-300">
          <p className="text-xs">Event not found.</p>
          <Link href="/events" className="spider-button-secondary inline-block mt-4 px-4 py-2 rounded-xl text-xs">
            Return to All Events
          </Link>
        </div>
      </div>
    );
  }

  const parsedTeamSize = Number(event.team_size) || 1;
  const isTeam = event.team_type === 'team' || parsedTeamSize > 1;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      <Link href={`/events/${event.id}`} className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Event Details</span>
      </Link>

      <div className="spider-card p-6 sm:p-8 rounded-3xl">
        {successRegistrationId ? (
          <div className="text-center space-y-6 py-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Registration Confirmed!</h2>
              <p className="text-xs text-slate-300">
                You are registered for <span className="text-red-400 font-bold">{event.name}</span>.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl max-w-sm mx-auto space-y-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Your Registration ID</span>
              <span className="text-2xl font-mono font-black text-red-400 tracking-wider block">{successRegistrationId}</span>
              <p className="text-xs text-slate-400">Venue: <span className="text-white font-medium">{event.venue || 'TBA'}</span></p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href={`/pass/${successRegistrationId}`}
                className="spider-button-primary inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-bold"
              >
                <Ticket className="w-4 h-4" />
                <span>View Digital Pass</span>
              </Link>
              <Link
                href="/my-registrations"
                className="spider-button-secondary inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-bold"
              >
                <span>My Registrations</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-900/50">
                {isTeam ? `Team Entry (${event.team_size} Members)` : 'Individual Entry'}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-2">{event.name}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your participant credentials below to complete your registration.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {!isTeam ? (
              /* INDIVIDUAL REGISTRATION FORM */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={indName}
                      onChange={(e) => setIndName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={indPhone}
                      onChange={(e) => setIndPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">College / Institution</label>
                    <input
                      type="text"
                      required
                      value={indCollege}
                      onChange={(e) => setIndCollege(e.target.value)}
                      placeholder="Engineering College"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={indDept}
                      onChange={(e) => setIndDept(e.target.value)}
                      placeholder="Information Technology"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Year of Study</label>
                    <select
                      value={indYear}
                      onChange={(e) => setIndYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Food Preference</label>
                    <select
                      value={indFood}
                      onChange={(e) => setIndFood(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* DYNAMIC TEAM REGISTRATION FORM */
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Cyber Knights"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">College Name</label>
                    <input
                      type="text"
                      required
                      value={teamCollege}
                      onChange={(e) => setTeamCollege(e.target.value)}
                      placeholder="College Name"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Team Members ({teamMembers.length} Members Required)
                  </h3>

                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-red-400">
                          {member.is_team_leader ? 'Leader (Member 1 - You)' : `Member ${idx + 1}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase mb-1">Member Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="email@college.edu"
                            value={member.email}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase mb-1">Department</label>
                          <input
                            type="text"
                            required
                            placeholder="Department"
                            value={member.department}
                            onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full spider-button-primary py-3.5 rounded-2xl text-xs font-bold shadow-lg transition disabled:opacity-50"
            >
              {submitting ? 'Confirming Registration...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterEvent;