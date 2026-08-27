// I-TEKRON 2K26 — shared live individual and team registration page.
import { ArrowUpRight, CheckCircle2, Minus, Plus, Radio, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import WebField from "@/components/WebField";
import IndividualDigitalPassCard from "@/components/IndividualDigitalPassCard";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveEvents } from "@/lib/liveEvents";
import { getRegistrationErrorMessage, getRegistrationFormState } from "@/lib/registrationFormState";
import { isEventRegistrationAvailable, parseTeamSizeRule } from "@/lib/teamSize";
import { trpc } from "@/lib/trpc";

type TeamMember = { fullName: string; email: string; phone: string; department: string; year: string; foodPreference: "Vegetarian" | "Non-Vegetarian" | "" };
type RegistrationSuccess = { registrationId: string; eventName: string; paymentRequired: boolean; registrationKind: "individual" | "team"; teamName?: string; members?: Array<{ fullName: string; email: string; isTeamLeader: boolean }> };
const newMember = (): TeamMember => ({ fullName: "", email: "", phone: "", department: "", year: "", foodPreference: "" });

function requestedEventId() { return typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("event")?.trim() ?? ""; }

export default function Register() {
  const [, setLocation] = useLocation();
  const { participant, participantLoading } = useAuth();
  const [eventId, setEventId] = useState(requestedEventId);
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState<RegistrationSuccess | null>(null);
  const [teamName, setTeamName] = useState("");
  const [college, setCollege] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([newMember(), newMember()]);
  const events = useLiveEvents();
  const availableEvents = useMemo(() => events.events.filter((event) => isEventRegistrationAvailable(event.teamType, event.teamSize)), [events.events]);
  const selectedEvent = availableEvents.find((event) => event.id === eventId);
  const isTeam = selectedEvent?.teamType?.trim().toLowerCase() === "team";
  const limits = isTeam ? parseTeamSizeRule(selectedEvent?.teamSize) : null;

  useEffect(() => { if (eventId && !events.isLoading && !availableEvents.some((event) => event.id === eventId)) setEventId(""); }, [availableEvents, eventId, events.isLoading]);
  useEffect(() => {
    if (!isTeam || !limits) return;
    setMembers((current) => current.length === limits.minimum ? current : Array.from({ length: limits.minimum }, (_, index) => current[index] ?? newMember()));
  }, [eventId, isTeam, limits?.minimum]);
  const individual = trpc.registrations.createIndividual.useMutation({ onSuccess: (result) => { setSuccess({ ...result, registrationKind: "individual" }); setNotice(""); }, onError: (error) => { setSuccess(null); setNotice(getRegistrationErrorMessage(error)); } });
  const team = trpc.registrations.createTeam.useMutation({ onSuccess: (result) => { setSuccess({ ...result, registrationKind: "team" }); setNotice(""); }, onError: (error) => { setSuccess(null); setNotice(getRegistrationErrorMessage(error)); } });
  const individualPass = trpc.registrations.getIndividualPass.useQuery({ registrationId: success?.registrationKind === "individual" ? success.registrationId : "PASS" }, { enabled: success?.registrationKind === "individual", retry: false });
  const isSubmitting = individual.isPending || team.isPending;
  const unavailable = events.isError || (!events.isLoading && availableEvents.length === 0);
  const formState = getRegistrationFormState({ isSubmitting, isEventsLoading: events.isLoading, isEventsUnavailable: unavailable, eventSourceError: events.isError, notice, success });

  function chooseEvent(value: string) { setEventId(value); setNotice(""); setSuccess(null); }
  function changeMember(index: number, key: keyof TeamMember, value: string) { setMembers((current) => current.map((member, memberIndex) => memberIndex === index ? { ...member, [key]: value } as TeamMember : member)); }
  function addMember() { if (limits?.maximum === undefined || members.length < limits.maximum) setMembers((current) => [...current, newMember()]); }
  function removeMember(index: number) { if (members.length > (limits?.minimum ?? 1)) setMembers((current) => current.filter((_, memberIndex) => memberIndex !== index)); }
  function submit(form: HTMLFormElement) {
    setNotice("");
    setSuccess(null);
    if (!participant) {
      const next = `${window.location.pathname}${window.location.search}`;
      setLocation(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (isTeam) {
      team.mutate({ eventId, teamName, college, members: members.map((member) => ({ ...member, foodPreference: member.foodPreference as "Vegetarian" | "Non-Vegetarian" })) });
      return;
    }
    const data = new FormData(form);
    individual.mutate({ eventId, fullName: String(data.get("fullName") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? ""), college: String(data.get("college") ?? ""), department: String(data.get("department") ?? ""), year: String(data.get("year") ?? ""), foodPreference: String(data.get("foodPreference") ?? "") as "Vegetarian" | "Non-Vegetarian" });
  }

  const SuccessBlock = () => success && <div className="registration-form__success" role="status"><div className="registration-form__code"><span>{formState.successMessage}</span><strong>{success.registrationId}</strong><small>Registered for {success.eventName}{success.teamName ? ` · ${success.teamName}` : ""}</small>{success.members && <ul>{success.members.map((member) => <li key={member.email}>{member.fullName}{member.isTeamLeader ? " · Team leader" : ""}</li>)}</ul>}</div>{success.registrationKind === "individual" && <div className="registration-form__pass">{individualPass.isFetching && <p className="registration-form__pass-note">Preparing your live Digital Pass…</p>}{individualPass.data && <IndividualDigitalPassCard pass={individualPass.data} compact />}{individualPass.error && <p className="registration-form__pass-note is-error">Your registration is saved. The Digital Pass could not load yet; use the registration ID above to open it later.</p>}</div>}</div>;

  return <PageShell><PageMasthead index="07" eyebrow="Registration signal" title="Bring your idea to the next node." copy="Register for a live individual or team event with the details needed for organizer review. Registration type, team rules, and payment handling follow the selected live event." /><section className="page-scene register-page"><WebField className="register-page__web" label="REGISTRATION NODE" /><div className="container register-page__grid"><div><p className="section-kicker">Participant intake</p><h2>Prepare the next connection.</h2><p>Your submitted details are linked to the selected live event and stored securely for organizer review. A registration ID is issued after a complete submission.</p><div className="register-page__status"><Radio size={15} /><span>Current status: <b>Pending organizer confirmation</b></span></div></div><form className="registration-form" onSubmit={(event) => { event.preventDefault(); submit(event.currentTarget); }}><div className="registration-form__head"><span>{isTeam ? "Team registration signal" : "Participant signal"}</span><small>{isTeam ? "The first member is recorded as the submitting team representative and leader." : "Every field is required for an individual-event registration."}</small></div>{!participant && !participantLoading && <p className="registration-form__notice is-error" role="status">Sign in or create an account before submitting a registration. Your return to this event will be preserved.</p>}<label className="registration-form__wide">Preferred event<select value={eventId} onChange={(event) => chooseEvent(event.target.value)} disabled={events.isLoading || unavailable || isSubmitting} required><option value="" disabled>{events.isLoading ? "Loading registration events…" : unavailable ? "Events are temporarily unavailable" : "Select a live event"}</option>{availableEvents.map((event) => <option key={event.id} value={event.id}>{event.name} — {event.teamType}</option>)}</select></label>{isTeam ? <><div className="registration-form__section registration-form__wide"><span>Team / representative details</span><small>Live team rule: {selectedEvent?.teamSize || "configured by the event"}</small></div><label>Team name<input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Team name" minLength={2} maxLength={160} disabled={isSubmitting} required /></label><label>College<input value={college} onChange={(event) => setCollege(event.target.value)} placeholder="College name" minLength={2} maxLength={255} disabled={isSubmitting} required /></label><div className="registration-form__members registration-form__wide"><div className="registration-form__members-head"><div><span>Team members</span><small>{limits ? `Add ${limits.minimum}${limits.maximum !== limits.minimum ? `–${limits.maximum}` : ""} members for this event.` : "The live event configuration will validate team size."}</small></div><button className="registration-form__member-action" type="button" onClick={addMember} disabled={isSubmitting || (limits?.maximum !== undefined && members.length >= limits.maximum)}><Plus size={14} /> Add member</button></div>{members.map((member, index) => <fieldset className="registration-form__member" key={index}><legend>Member {index + 1}{index === 0 ? " · Team leader" : ""}</legend><label>Full name<input value={member.fullName} onChange={(event) => changeMember(index, "fullName", event.target.value)} placeholder="Full name" minLength={2} maxLength={160} disabled={isSubmitting} required /></label><label>Email<input value={member.email} onChange={(event) => changeMember(index, "email", event.target.value)} placeholder="name@example.com" type="email" maxLength={320} disabled={isSubmitting} required /></label><label>Phone<input value={member.phone} onChange={(event) => changeMember(index, "phone", event.target.value)} placeholder="+91 98765 43210" inputMode="tel" maxLength={24} disabled={isSubmitting} required /></label><label>Department<input value={member.department} onChange={(event) => changeMember(index, "department", event.target.value)} placeholder="Department" minLength={2} maxLength={255} disabled={isSubmitting} required /></label><label>Year<input value={member.year} onChange={(event) => changeMember(index, "year", event.target.value)} placeholder="e.g. III Year" maxLength={64} disabled={isSubmitting} required /></label><label>Food preference<select value={member.foodPreference} onChange={(event) => changeMember(index, "foodPreference", event.target.value)} disabled={isSubmitting} required><option value="" disabled>Select a preference</option><option value="Vegetarian">Vegetarian</option><option value="Non-Vegetarian">Non-Vegetarian</option></select></label>{index > 0 && <button className="registration-form__member-remove" type="button" onClick={() => removeMember(index)} disabled={isSubmitting || members.length <= (limits?.minimum ?? 1)}><Minus size={14} /> Remove member</button>}</fieldset>)}</div></> : <><label>Full name<input name="fullName" placeholder="Your full name" minLength={2} maxLength={160} disabled={isSubmitting} required /></label><label>Email<input name="email" placeholder="name@example.com" type="email" maxLength={320} disabled={isSubmitting} required /></label><label>Phone<input name="phone" placeholder="+91 98765 43210" inputMode="tel" maxLength={24} disabled={isSubmitting} required /></label><label>College<input name="college" placeholder="College name" minLength={2} maxLength={255} disabled={isSubmitting} required /></label><label>Department<input name="department" placeholder="Department" minLength={2} maxLength={255} disabled={isSubmitting} required /></label><label>Year<input name="year" placeholder="e.g. III Year" maxLength={64} disabled={isSubmitting} required /></label><label className="registration-form__wide">Food preference<select name="foodPreference" defaultValue="" disabled={isSubmitting} required><option value="" disabled>Select a preference</option><option value="Vegetarian">Vegetarian</option><option value="Non-Vegetarian">Non-Vegetarian</option></select></label></>}<button className="button-primary registration-form__submit" type="submit" disabled={formState.submitDisabled || !eventId || participantLoading}>{isSubmitting ? "Recording registration…" : participantLoading ? "Restoring session…" : !participant ? "Sign in to register" : <>{isTeam ? "Submit team registration" : "Submit registration"} <ArrowUpRight size={16} /></>}</button><p className={`registration-form__notice ${formState.messageKind === "error" ? "is-error" : ""}`} aria-live="polite">{formState.message && (formState.messageKind === "error" ? <TriangleAlert size={15} /> : <CheckCircle2 size={15} />)} {formState.message}</p><SuccessBlock /></form></div></section></PageShell>;
}
