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

type TeamMember = {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  foodPreference: string;
};

const RAZORPAY_SCRIPT_URL =
  'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');

    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const RegisterEvent: React.FC<RegisterEventProps> = ({
  event: initialEvent,
  onClose,
}) => {
  const [match1, params1] = useRoute('/events/:eventId/register');
  const [match2, params2] = useRoute('/events/:id/register');

  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const eventId = params1?.eventId || params2?.id;

  const [event, setEvent] = useState<any>(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    college: '',
    department: '',
    year: '1',
    foodPreference: 'Vegetarian',
    teamName: '',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      name: '',
      email: '',
      phone: '',
      department: '',
      year: '1',
      foodPreference: 'Vegetarian',
    },
  ]);

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
      setLoading(false);
      return;
    }

    if (!eventId) {
      setLoading(false);
      setError('Event not found.');
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchErr } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (fetchErr || !data) {
          setError('Event not found.');
          return;
        }

        setEvent(data);
      } catch (err) {
        console.error(
          'Error fetching event for registration:',
          err
        );

        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, initialEvent]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      fullName:
        previous.fullName ||
        user.user_metadata?.full_name ||
        '',
      email: previous.email || user.email || '',
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTeamMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    setTeamMembers((previous) =>
      previous.map((member, memberIndex) =>
        memberIndex === index
          ? {
              ...member,
              [field]: value,
            }
          : member
      )
    );
  };

  const addTeamMember = () => {
    setTeamMembers((previous) => [
      ...previous,
      {
        name: '',
        email: '',
        phone: '',
        department: '',
        year: '1',
        foodPreference: 'Vegetarian',
      },
    ]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers((previous) =>
      previous.filter((_, memberIndex) => memberIndex !== index)
    );
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    if (event?.id) {
      setLocation(`/events/${event.id}`);
      return;
    }

    setLocation('/events');
  };

  const validateForm = (isTeam: boolean) => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      return 'Please enter your email address.';
    }

    if (!formData.phone.trim()) {
      return 'Please enter your phone number.';
    }

    if (!formData.college.trim()) {
      return 'Please enter your college name.';
    }

    if (!formData.department.trim()) {
      return 'Please enter your department.';
    }

    if (!formData.year) {
      return 'Please select your year of study.';
    }

    if (!formData.foodPreference) {
      return 'Please select your food preference.';
    }

    if (isTeam) {
      if (!formData.teamName.trim()) {
        return 'Please enter your team name.';
      }

      if (teamMembers.length === 0) {
        return 'Please add at least one team member.';
      }

      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i];

        if (!member.name.trim()) {
          return `Please enter the name for team member #${
            i + 2
          }.`;
        }

        if (!member.email.trim()) {
          return `Please enter the email for team member #${
            i + 2
          }.`;
        }

        if (!member.phone.trim()) {
          return `Please enter the phone number for team member #${
            i + 2
          }.`;
        }

        if (!member.department.trim()) {
          return `Please enter the department for team member #${
            i + 2
          }.`;
        }

        if (!member.year) {
          return `Please select the year for team member #${
            i + 2
          }.`;
        }

        if (!member.foodPreference) {
          return `Please select the food preference for team member #${
            i + 2
          }.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (!user) {
      setLocation('/login');
      return;
    }

    if (!event?.id) {
      setError('Event information is missing.');
      return;
    }

    const isTeam =
      String(event.team_type || '').toLowerCase() ===
      'team';

    const validationError = validateForm(isTeam);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    let registrationUUID: string | null = null;

    try {
      /*
       * -------------------------------------------------------
       * 1. Check for an existing registration
       * -------------------------------------------------------
       *
       * This prevents accidental duplicate registrations when
       * the user clicks Register more than once or retries
       * after a payment/order problem.
       */
      const {
        data: existingRegistration,
        error: existingRegistrationError,
      } = await supabase
        .from('registrations')
        .select(
          'id, registration_id, status, payment_status, razorpay_order_id'
        )
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .maybeSingle();

      if (existingRegistrationError) {
        console.error(
          'Existing registration lookup error:',
          existingRegistrationError
        );

        throw new Error(
          'Unable to check your existing registration.'
        );
      }

      if (existingRegistration) {
        if (
          existingRegistration.payment_status ===
          'paid'
        ) {
          throw new Error(
            'You are already registered and payment is completed for this event.'
          );
        }

        /*
         * Reuse an existing pending/failed registration.
         * This avoids creating another registration every
         * time the user retries payment.
         */
        registrationUUID = existingRegistration.id;
      } else {
        /*
         * -----------------------------------------------------
         * 2. Create the existing registration record
         * -----------------------------------------------------
         */
        const { data: registration, error: regErr } =
          await supabase
            .from('registrations')
            .insert([
              {
                user_id: user.id,
                event_id: event.id,
                registration_type: isTeam
                  ? 'team'
                  : 'individual',
                status: 'pending',
                payment_required: true,
                payment_status: 'pending',
                participant_email: formData.email.trim(),
              },
            ])
            .select('id, registration_id')
            .single();

        if (regErr || !registration) {
          console.error(
            'Registration creation error:',
            regErr
          );

          throw new Error(
            regErr?.message ||
              'Failed to create registration record.'
          );
        }

        registrationUUID = registration.id;
      }

      /*
       * -------------------------------------------------------
       * 3. Check whether participant/team data already exists
       * -------------------------------------------------------
       *
       * This matters when a user retries payment using an
       * existing pending registration.
       */
      if (isTeam) {
        const { data: existingTeam, error: existingTeamError } =
          await supabase
            .from('teams')
            .select('id')
            .eq(
              'registration_id',
              registrationUUID
            )
            .maybeSingle();

        if (existingTeamError) {
          console.error(
            'Existing team lookup error:',
            existingTeamError
          );

          throw new Error(
            'Unable to check existing team information.'
          );
        }

        let teamUUID: string;

        if (existingTeam) {
          teamUUID = existingTeam.id;

          /*
           * Update team information when retrying.
           */
          const { error: teamUpdateError } =
            await supabase
              .from('teams')
              .update({
                team_name: formData.teamName.trim(),
                college: formData.college.trim(),
              })
              .eq('id', teamUUID);

          if (teamUpdateError) {
            throw new Error(
              teamUpdateError.message ||
                'Failed to update team information.'
            );
          }
        } else {
          const { data: team, error: teamErr } =
            await supabase
              .from('teams')
              .insert([
                {
                  registration_id: registrationUUID,
                  team_name: formData.teamName.trim(),
                  college: formData.college.trim(),
                },
              ])
              .select('id')
              .single();

          if (teamErr || !team) {
            throw new Error(
              teamErr?.message ||
                'Failed to create team record.'
            );
          }

          teamUUID = team.id;
        }

        /*
         * -----------------------------------------------------
         * Team leader
         * -----------------------------------------------------
         */
        const { data: existingLeader } =
          await supabase
            .from('team_members')
            .select('id')
            .eq('team_id', teamUUID)
            .eq('is_team_leader', true)
            .maybeSingle();

        const leaderData = {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          year: formData.year,
          food_preference:
            formData.foodPreference,
          is_team_leader: true,
        };

        if (existingLeader) {
          const { error: leaderUpdateError } =
            await supabase
              .from('team_members')
              .update(leaderData)
              .eq('id', existingLeader.id);

          if (leaderUpdateError) {
            throw new Error(
              leaderUpdateError.message ||
                'Failed to update team leader.'
            );
          }
        } else {
          const { error: leaderInsertError } =
            await supabase
              .from('team_members')
              .insert([
                {
                  team_id: teamUUID,
                  ...leaderData,
                },
              ]);

          if (leaderInsertError) {
            throw new Error(
              leaderInsertError.message ||
                'Failed to create team leader.'
            );
          }
        }

        /*
         * -----------------------------------------------------
         * Existing non-leader members
         *
         * For a pending registration retry, remove the old
         * non-leader members and recreate them from the current
         * form. This keeps the existing schema clean.
         * -----------------------------------------------------
         */
        const { error: deleteMembersError } =
          await supabase
            .from('team_members')
            .delete()
            .eq('team_id', teamUUID)
            .eq('is_team_leader', false);

        if (deleteMembersError) {
          throw new Error(
            deleteMembersError.message ||
              'Failed to update team members.'
          );
        }

        const memberRows = teamMembers.map(
          (member) => ({
            team_id: teamUUID,
            name: member.name.trim(),
            email: member.email.trim(),
            phone: member.phone.trim(),
            department: member.department.trim(),
            year: member.year,
            food_preference:
              member.foodPreference,
            is_team_leader: false,
          })
        );

        if (memberRows.length > 0) {
          const { error: membersError } =
            await supabase
              .from('team_members')
              .insert(memberRows);

          if (membersError) {
            throw new Error(
              membersError.message ||
                'Failed to record team members.'
            );
          }
        }
      } else {
        /*
         * -----------------------------------------------------
         * Individual participant
         * -----------------------------------------------------
         */
        const {
          data: existingParticipant,
          error: existingParticipantError,
        } = await supabase
          .from('participants')
          .select('id')
          .eq(
            'registration_id',
            registrationUUID
          )
          .maybeSingle();

        if (existingParticipantError) {
          throw new Error(
            existingParticipantError.message ||
              'Unable to check participant information.'
          );
        }

        const participantData = {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          college: formData.college.trim(),
          department: formData.department.trim(),
          year: formData.year,
          food_preference:
            formData.foodPreference,
        };

        if (existingParticipant) {
          const { error: participantUpdateError } =
            await supabase
              .from('participants')
              .update(participantData)
              .eq(
                'id',
                existingParticipant.id
              );

          if (participantUpdateError) {
            throw new Error(
              participantUpdateError.message ||
                'Failed to update participant information.'
            );
          }
        } else {
          const { error: partErr } =
            await supabase
              .from('participants')
              .insert([
                {
                  registration_id:
                    registrationUUID,
                  ...participantData,
                },
              ]);

          if (partErr) {
            throw new Error(
              partErr.message ||
                'Failed to create participant record.'
            );
          }
        }
      }

      /*
       * -------------------------------------------------------
       * 4. Load Razorpay Checkout
       * -------------------------------------------------------
       */
      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error(
          'Razorpay Checkout could not be loaded. Please check your internet connection and try again.'
        );
      }

      /*
       * -------------------------------------------------------
       * 5. Create Razorpay order on the SERVER
       * -------------------------------------------------------
       *
       * IMPORTANT:
       * Backend expects snake_case names.
       */
      const orderRes = await fetch(
        '/api/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registration_id:
              registrationUUID,
            event_id: event.id,
          }),
        }
      );

      const orderText = await orderRes.text();

      let orderData: any;

      try {
        orderData = orderText
          ? JSON.parse(orderText)
          : null;
      } catch {
        throw new Error(
          'Payment server returned an invalid response.'
        );
      }

      if (
        !orderRes.ok ||
        !orderData?.success ||
        !orderData?.order_id
      ) {
        throw new Error(
          orderData?.error ||
            'Failed to generate payment order.'
        );
      }

      /*
       * -------------------------------------------------------
       * 6. Razorpay Checkout
       * -------------------------------------------------------
       */
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',

        name: 'ITEKRON 2K26',

        description: `Registration for ${event.name}`,

        order_id: orderData.order_id,

        prefill: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim(),
        },

        notes: {
          registration_id:
            registrationUUID,
          event_id: event.id,
        },

        theme: {
          color: '#e11d48',
        },

        handler: async (
          response: any
        ) => {
          try {
            setError(null);

            /*
             * -------------------------------------------------
             * 7. NEVER mark payment successful here.
             *
             * The browser response is sent to our backend.
             * Backend verifies the HMAC + Razorpay payment.
             * -------------------------------------------------
             */
            const verifyRes = await fetch(
              '/api/verify-payment',
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                },
                body: JSON.stringify({
                  registration_id:
                    registrationUUID,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyText =
              await verifyRes.text();

            let verifyData: any;

            try {
              verifyData = verifyText
                ? JSON.parse(verifyText)
                : null;
            } catch {
              throw new Error(
                'Payment verification server returned an invalid response.'
              );
            }

            if (
              !verifyRes.ok ||
              !verifyData?.success ||
              !verifyData?.verified
            ) {
              throw new Error(
                verifyData?.error ||
                  'Payment verification failed.'
              );
            }

            /*
             * Only AFTER server-side verification succeeds
             * do we consider registration successful.
             */
            setSubmitting(false);

            if (onClose) {
              onClose();
            }

            setLocation(
              '/my-registrations'
            );
          } catch (verificationError) {
            console.error(
              'Payment verification error:',
              verificationError
            );

            setSubmitting(false);

            setError(
              verificationError instanceof Error
                ? verificationError.message
                : 'Payment verification failed. Please contact support.'
            );
          }
        },

        modal: {
          ondismiss: () => {
            setSubmitting(false);

            setError(
              'Payment was cancelled. Your registration is still saved as pending. You can try again.'
            );
          },
        },
      };

      const paymentObject =
        new window.Razorpay(options);

      paymentObject.on(
        'payment.failed',
        (response: any) => {
          console.error(
            'Razorpay payment failed:',
            response
          );

          setSubmitting(false);

          setError(
            response?.error?.description ||
              'Payment failed. Please try again.'
          );
        }
      );

      paymentObject.open();
    } catch (err) {
      console.error(
        'Registration submit error:',
        err
      );

      setSubmitting(false);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to initiate registration. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-white flex flex-col items-center justify-center">
        <LoadingSpinner />

        <p className="mt-4 text-xs text-slate-400">
          Loading registration form...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-red-500 mb-4">
          {error || 'Event not found.'}
        </p>

        <button
          onClick={handleClose}
          className="spider-button-primary px-4 py-2 text-xs font-bold rounded-xl"
        >
          Back to Event
        </button>
      </div>
    );
  }

  const isConvera =
    String(event.id).toUpperCase() ===
    'CONVERA01';

  const displayPrice = isConvera
    ? '₹150'
    : '₹50';

  const isTeam =
    String(event.team_type || '')
      .toLowerCase() === 'team';

  return (
    <div className="spider-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md text-white max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold">
            Register for {event.name}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Type:{' '}
            <span className="text-slate-200 font-semibold">
              {isTeam
                ? 'Team Event'
                : 'Individual'}
            </span>{' '}
            | Registration Fee:{' '}
            <span className="text-red-400 font-bold">
              {displayPrice}
            </span>
          </p>
        </div>

        <button
          onClick={handleClose}
          disabled={submitting}
          className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1 bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {isTeam && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-red-400 uppercase font-mono">
              Team Information
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Team Name *
              </label>

              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
                placeholder="Enter team name"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono">
            {isTeam
              ? 'Team Leader Details'
              : 'Participant Information'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Full Name *
              </label>

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
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Email Address *
              </label>

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
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Phone Number *
              </label>

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
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                College Name *
              </label>

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
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Department *
              </label>

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
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Year of Study *
              </label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
              >
                <option value="1">
                  1st Year
                </option>

                <option value="2">
                  2nd Year
                </option>

                <option value="3">
                  3rd Year
                </option>

                <option value="4">
                  4th Year
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Food Preference *
              </label>

              <select
                name="foodPreference"
                value={formData.foodPreference}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-600"
              >
                <option value="Vegetarian">
                  Vegetarian
                </option>

                <option value="Non-Vegetarian">
                  Non-Vegetarian
                </option>
              </select>
            </div>
          </div>
        </div>

        {isTeam && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono">
                Team Members
              </h3>

              <button
                type="button"
                onClick={addTeamMember}
                disabled={submitting}
                className="text-xs text-red-400 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                + Add Member
              </button>
            </div>

            {teamMembers.map(
              (member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">
                      Member #{idx + 2}
                    </span>

                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeTeamMember(
                            idx
                          )
                        }
                        disabled={submitting}
                        className="text-red-500 text-xs hover:underline disabled:opacity-50"
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
                      onChange={(e) =>
                        handleTeamMemberChange(
                          idx,
                          'name',
                          e.target.value
                        )
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />

                    <input
                      type="email"
                      placeholder="Member Email *"
                      value={member.email}
                      onChange={(e) =>
                        handleTeamMemberChange(
                          idx,
                          'email',
                          e.target.value
                        )
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />

                    <input
                      type="tel"
                      placeholder="Member Phone *"
                      value={member.phone}
                      onChange={(e) =>
                        handleTeamMemberChange(
                          idx,
                          'phone',
                          e.target.value
                        )
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />

                    <input
                      type="text"
                      placeholder="Department *"
                      value={member.department}
                      onChange={(e) =>
                        handleTeamMemberChange(
                          idx,
                          'department',
                          e.target.value
                        )
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />

                    <select
                      value={member.year}
                      onChange={(e) =>
                        handleTeamMemberChange(
                          idx,
                          'year',
                          e.target.value
                        )
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      <option value="1">
                        1st Year
                      </option>

                      <option value="2">
                        2nd Year
                      </option>

                      <option value="3">
                        3rd Year
                      </option>

                      <option value="4">
                        4th Year
                      </option>
                    </select>

                    <select
                      value={
                        member.foodPreference
                      }
                      onChange={(e) =>
                        handleTeamMemberChange(
                          idx,
                          'foodPreference',
                          e.target.value
                        )
                      }
                      required
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      <option value="Vegetarian">
                        Vegetarian
                      </option>

                      <option value="Non-Vegetarian">
                        Non-Vegetarian
                      </option>
                    </select>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs text-slate-400 block">
              Total Amount Payable
            </span>

            <span className="text-xl font-bold text-red-400">
              {displayPrice}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto spider-button-primary px-8 py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner />

                <span>
                  Processing Payment...
                </span>
              </>
            ) : (
              <span>
                Proceed to Pay {displayPrice}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterEvent;