import { Ticket, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import IndividualDigitalPassCard from "@/components/IndividualDigitalPassCard";
import { trpc } from "@/lib/trpc";
import "@/participant-tools.css";

function requestedRegistrationId() {
  return typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("registration")?.trim().toUpperCase() ?? "";
}

export default function DigitalPass() {
  const [input, setInput] = useState(requestedRegistrationId);
  const [submittedId, setSubmittedId] = useState(requestedRegistrationId);
  const pass = trpc.registrations.getIndividualPass.useQuery({ registrationId: submittedId || "PASS" }, { enabled: Boolean(submittedId), retry: false });
  const errorMessage = useMemo(() => submittedId && pass.error ? "We could not open an individual Digital Pass for that registration ID." : "", [pass.error, submittedId]);

  return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><Ticket size={13} /> Participant tools · Live credential</p><h1>Digital<br /><em>pass.</em></h1><p>Open the live credential issued for a successful individual registration. Its QR code contains only the registration ID for future organizer verification.</p></div></header><section className="container status-grid"><section className="registration-lookup" aria-labelledby="digital-pass-lookup-heading"><div className="registration-lookup__head"><p className="section-kicker">Individual registration credential</p><h2 id="digital-pass-lookup-heading">Open your pass.</h2><p>Enter the registration ID issued after your successful individual-event submission.</p></div><form className="registration-lookup__form" onSubmit={(event) => { event.preventDefault(); setSubmittedId(input.trim().toUpperCase()); }}><label>Registration ID<input value={input} onChange={(event) => setInput(event.target.value)} placeholder="ITEK-XXXXXXXX-0001" autoCapitalize="characters" required /></label><button className="button-primary" type="submit"><Search size={16} /> Open pass</button></form>{pass.isFetching && <p className="registration-lookup__note">Loading your Digital Pass…</p>}{errorMessage && <p className="registration-lookup__note is-warning"><TriangleAlert size={15} /> {errorMessage}</p>}</section><div>{pass.data ? <IndividualDigitalPassCard pass={pass.data} compact /> : <div className="digital-pass__empty"><Ticket size={22} /><p>Your live Digital Pass appears here after a successful individual registration.</p></div>}</div></section></main></PageShell>;
}
