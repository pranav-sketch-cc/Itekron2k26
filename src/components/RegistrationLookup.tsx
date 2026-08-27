import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Search, TriangleAlert } from "lucide-react";
import { trpc } from "@/lib/trpc";
import "@/participant-persistence.css";

export type RegistrationLookupRecord = {
  id: number;
  fullName: string;
  email: string;
  institution: string;
  eventId: string;
  registrationCode: string;
  status: "submitted" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};

type RegistrationLookupProps = {
  mode: "status" | "pass";
  onRegistration?: (registration: RegistrationLookupRecord) => void;
};

export default function RegistrationLookup({ mode, onRegistration }: RegistrationLookupProps) {
  const [codeInput, setCodeInput] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const registrationCallback = useRef(onRegistration);
  const lookup = trpc.registrations.getByCode.useQuery(
    { registrationCode: submittedCode },
    { enabled: Boolean(submittedCode), retry: false },
  );

  const registration = lookup.data as RegistrationLookupRecord | null | undefined;
  useEffect(() => { registrationCallback.current = onRegistration; }, [onRegistration]);
  useEffect(() => { if (registration) registrationCallback.current?.(registration); }, [registration]);

  return (
    <section className="registration-lookup" aria-labelledby={`${mode}-lookup-heading`}>
      <div className="registration-lookup__head">
        <p className="section-kicker">Persistent participant record</p>
        <h2 id={`${mode}-lookup-heading`}>{mode === "pass" ? "Open your credential." : "Trace your registration."}</h2>
        <p>Enter the code issued after submitting the registration form. Records remain pending until an organizer confirms them.</p>
      </div>
      <form
        className="registration-lookup__form"
        onSubmit={event => {
          event.preventDefault();
          setSubmittedCode(codeInput.trim().toUpperCase());
        }}
      >
        <label>
          Registration code
          <input
            value={codeInput}
            onChange={event => setCodeInput(event.target.value)}
            placeholder="ITK26-XXXXXXXXXX"
            autoCapitalize="characters"
            required
          />
        </label>
        <button className="button-primary" type="submit"><Search size={16} /> Find record</button>
      </form>
      {lookup.isFetching && <p className="registration-lookup__note">Tracing the registration signal…</p>}
      {submittedCode && !lookup.isFetching && !registration && !lookup.error && (
        <p className="registration-lookup__note is-warning"><TriangleAlert size={15} /> No registration matches that code.</p>
      )}
      {lookup.error && <p className="registration-lookup__note is-warning"><TriangleAlert size={15} /> The record could not be read. Please retry.</p>}
      {registration && (
        <div className="registration-lookup__record">
          <p className={`registration-lookup__state ${registration.status === "confirmed" ? "is-confirmed" : ""}`}>
            <CheckCircle2 size={15} /> {registration.status === "confirmed" ? "Registration confirmed" : "Registration submitted"}
          </p>
          <h3>{registration.fullName}</h3>
          <div>
            <span>Registration ID</span><strong>{registration.registrationCode}</strong>
            <span>Selected event</span><strong>{registration.eventId}</strong>
            <span>Recorded</span><strong>{new Date(registration.createdAt).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
