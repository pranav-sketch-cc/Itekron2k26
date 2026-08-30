import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RegisterEventProps {
  event?: any;
  onClose?: () => void;
}

export const RegisterEvent: React.FC<RegisterEventProps> = ({ event: initialEvent, onClose }) => {
  const [match1, params1] = useRoute('/events/:eventId/register');
  const [match2, params2] = useRoute('/events/:id/register');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const eventId = params1?.eventId || params2?.id;
  const [event, setEvent] = useState<any>(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    college: '',
    department: '',
    year: '1',
    foodPreference: 'Veg',
    teamName: '',
  });

  // Team Members State (for Team Events)
  const [teamMembers, setTeamMembers] = useState([
    { name: '', email: '', phone: '', department: '', year: '1' }
  ]);

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
      setLoading(false);
      return;
    }

    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data, error: fetchErr } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (!fetchErr && data) {
          setEvent(data);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching event for registration:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, initialEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', email: '', phone: '', department: '', year: '1' }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (event?.id) {
      setLocation(`/events/${event.id}`);
    } else {
      setLocation('/events');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setLocation('/login');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const isTeam = event.team_type?.toLowerCase() === 'team';
      const amount = event.id === 'CONVERA01' ? 150 : 50;

      // 1. Create registration record in Supabase (status: pending)
      const { data: registration, error: regErr } = await supabase
        .from('registrations')
        .insert([
          {
            user_id: user.id,
            event_id: event.id,
            status: 'pending',
            amount: amount,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            college: formData.college,
            department: formData.department,
            year: formData.year,
            food_preference: formData.foodPreference,
            team_name: isTeam ? formData.teamName : null,
          }
        ])
        .select()
        .single();

      if (regErr || !registration) {
        throw new Error(regErr?.message || 'Failed to create registration record.');
      }

      // If team event, insert team members into database
      if (isTeam && teamMembers.length > 0) {
        const teamRows = teamMembers.map(member => ({
          registration_id: registration.id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          department: member.department,
          year: member.year
        }));

        await supabase.from('team_members').insert(teamRows);
      }

      // 2. Call backend Razorpay order API endpoint
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registration.id,
          eventId: event.id,
          amount: amount
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.message || 'Failed to initialize payment gateway.');
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'ITEKRON 2K26',
        description: `Registration for ${event.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // 4. Verify payment server-side
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId: registration.id
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              if (onClose) onClose();
              setLocation('/my-registrations');
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (vErr) {
            console.error('Payment verification error:', vErr);
            setError('Error verifying payment.');
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#e11d48'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error('Registration submit error:', err);
      setError(err?.message || 'Failed to initiate registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-white flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-xs text-slate-400">Loading registration form...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-red-500 mb-4">{error || 'Event not found.'}</p>
        <button onClick={handleClose} className="spider-button-primary px-4 py-2 text-xs font-bold rounded-xl">
          Back to Event
        </button>
      </div>
    );
  }

  const isConvera = event.id === 'CONVERA01';
  const displayPrice = isConvera ? '₹150' : '₹50';
  const isTeam = event.team_type?.toLowerCase() === 'team';

  return (
    <div className="spider-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md text-white max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold">Register for {event.name}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Type: <span className="text-slate-200 font-semibold">{isTeam ? 'Team Event' : 'Individual'}</span> | Registration Fee:{' '}
            <span className="text-red-400 font-bold">{displayPrice}</span>
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1 bg-slate-800 rounded-lg transition-colors"
        >
          ✕ Close
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Details Section (If Team Event) */}
        {isTeam && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-red-400 uppercase font-mono">Team Information</h3>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Team Name *</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required={isTeam}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="Enter team name"
              />
            </div>
          </div>
        )}

        {/* Primary Participant Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono">
            {isTeam ? 'Team Leader Details' : 'Participant Information'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">College Name *</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="Engineering College"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="Information Technology"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Year of Study *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Food Preference *</label>
              <select
                name="foodPreference"
                value={formData.foodPreference}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
              >
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Members Section (For Team Events) */}
        {isTeam && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono">Team Members</h3>
              <button
                type="button"
                onClick={addTeamMember}
                className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1"
              >
                + Add Member
              </button>
            </div>

            {teamMembers.map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-400">Member #{idx + 2}</span>
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(idx)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Member Name *"
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                    required
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Member Email *"
                    value={member.email}
                    onChange={(e) => handleTeamMemberChange(idx, 'email', e.target.value)}
                    required
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Member Phone *"
                    value={member.phone}
                    onChange={(e) => handleTeamMemberChange(idx, 'phone', e.target.value)}
                    required
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Department *"
                    value={member.department}
                    onChange={(e) => handleTeamMemberChange(idx, 'department', e.target.value)}
                    required
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Action & Payment Trigger */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Total Amount Payable</span>
            <span className="text-xl font-bold text-red-400">{displayPrice}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto spider-button-primary px-8 py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner />
                <span>Processing Payment...</span>
              </>
            ) : (
              <span>Proceed to Pay {displayPrice}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterEvent;