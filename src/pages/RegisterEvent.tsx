import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateRegistrationId } from '../lib/utils';
import { ArrowLeft, CheckCircle2, AlertCircle, Ticket, Users, User } from 'lucide-react';

interface TeamMemberInput {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  student_id: string;
  food_preference: string;
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

  // Participation Mode State ('individual' | 'team')
  const [registrationType, setRegistrationType] = useState<'individual' | 'team'>('individual');

  // Individual Form Fields
  const [indName, setIndName] = useState('');
  const [indPhone, setIndPhone] = useState('');
  const [indCollege, setIndCollege] = useState('');
  const [indDept, setIndDept] = useState('');
  const [indYear, setIndYear] = useState('1st Year');
  const [indStudentId, setIndStudentId] = useState('');
  const [indFood, setIndFood] = useState('Vegetarian');

  // Team Form Fields
  const [teamName, setTeamName] = useState('');
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
        setError('Event configuration not found in database.');
        setLoading(false);
        return;
      }

      setEvent(data);

      const rawType = (data.event_type || data.team_type || '').toLowerCase();
      const numTeamSize = Number(data.max_team_size || data.team_size || 1);

      // Determine default registration type
      let defaultType: 'individual' | 'team' = 'individual';
      if (rawType === 'team' || numTeamSize > 1) {
        defaultType = 'team';
      }
      setRegistrationType(defaultType);

      // Initialize team members if team or both
      const requiredMembersCount = numTeamSize > 1 ? numTeamSize : 2;
      const initialMembers: TeamMemberInput[] = [];

      for (let i = 0; i < requiredMembersCount; i++) {
        initialMembers.push({
          name: i === 0 ? user?.user_metadata?.full_name || '' : '',
          email: i === 0 ? user?.email || '' : '',
          phone: '',
          department: '',
          year: '1st Year',
          student_id: '',
          food_preference: 'Vegetarian',
          is_team_leader: i === 0,
        });
      }
      setTeamMembers(initialMembers);
      
      // Auto pre-fill individual leader fields from Auth user
      setIndName(user?.user_metadata?.full_name || '');
    } catch (err) {
      setError('Failed to fetch event registration settings.');
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
    const isTeamMode = registrationType === 'team';

    try {
      // 1. Check duplicate registration for user + event
      const { data: existingReg } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingReg) {
        throw new Error('You are already registered for this event.');
      }

      // 2. Insert primary record into public.registrations
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert({
          registration_id: customRegId,
          event_id: event.id,
          user_id: user.id,
          registration_type: isTeamMode ? 'team' : 'individual',
          team_name: isTeamMode ? teamName : null,
          status: 'confirmed',
        })
        .select()
        .single();

      if (regError || !regData) {
        throw new Error(regError?.message || 'Failed to submit registration.');
      }

      // 3. Insert participant rows into public.participants (Strictly using existing table columns)
      if (!isTeamMode) {
        const { error: partErr } = await supabase.from('participants').insert({
          registration_id: customRegId,
          user_id: user.id,
          name: indName,
          email: user.email,
          phone: indPhone,
          college: indCollege,
          department: indDept,
          year: indYear,
          student_id: indStudentId,
          food_preference: indFood,
        });

        if (partErr) throw new Error(partErr.message);
      } else {
        const teamParticipantsPayload = teamMembers.map((m) => ({
          registration_id: customRegId,
          user_id: m.is_team_leader ? user.id : null,
          name: m.name,
          email: m.email,
          phone: m.phone,
          college: indCollege || teamName + ' Institutional Representative',
          department: m.department,
          year: m.year,
          student_id: m.student_id,
          food_preference: m.food_preference,
        }));

        const { error: teamPartErr } = await supabase.from('participants').insert(teamParticipantsPayload);
        if (teamPartErr) throw new Error(teamPartErr.message);
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
        <LoadingSpinner message="Loading event registration form..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-6 rounded-3xl text-slate-300">
          <p className="text-xs">Event configuration could not be loaded.</p>
          <Link href="/events" className="spider-button-secondary inline-block mt-4 px-4 py-2 rounded-xl text-xs">
            Return to All Events
          </Link>
        </div>
      </div>
    );
  }

  const rawType = (event.event_type || event.team_type || '').toLowerCase();
  const supportsBoth = rawType === 'both';

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
                You are successfully registered for <span className="text-red-400 font-bold">{event.name}</span>.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl max-w-sm mx-auto space-y-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Your Official Registration ID</span>
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
                {registrationType === 'team' ? `Team Registration (${teamMembers.length} Members)` : 'Individual Registration'}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-2">{event.name}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter required participant credentials below to reserve your entry slot.
              </p>
            </div>

            {/* CHOICE SELECTOR IF EVENT SUPPORTS BOTH */}
            {supportsBoth && (
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Select Registration Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegistrationType('individual')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                      registrationType === 'individual'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Individual Entry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistrationType('team')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                      registrationType === 'team'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Team Entry</span>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl flex items-center space-x-2 text-red-300 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {registrationType === 'individual' ? (
              /* INDIVIDUAL FORM */
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
                      placeholder="College Name"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Student / Register No</label>
                    <input
                      type="text"
                      value={indStudentId}
                      onChange={(e) => setIndStudentId(e.target.value)}
                      placeholder="REG12345"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Food Preference</label>
                    <select
                      value={indFood}
                      onChange={(e) => setIndFood(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* DYNAMIC TEAM MEMBER FORM */
              <div className="space-y-6">
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

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Team Members ({teamMembers.length} Members Required)
                  </h3>

                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-red-400">
                          {member.is_team_leader ? 'Member 1 (Team Leader - You)' : `Member ${idx + 1}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase mb-1">Full Name</label>
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
                            placeholder="Information Technology"
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