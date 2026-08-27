import { Ticket, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import IndividualDigitalPassCard from "@/components/IndividualDigitalPassCard";
import "@/participant-tools.css";

export default function MyPasses() {
  const { participant, participantLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const passes = trpc.registrations.getOwnedPasses.useQuery(undefined, { enabled: Boolean(participant), retry: false, refetchOnWindowFocus: true });
  useEffect(() => {
    if (!participantLoading && !participant) setLocation(`/login?next=${encodeURIComponent(location)}`);
  }, [location, participant, participantLoading, setLocation]);
  if (!participantLoading && !participant) return null;
  return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><Ticket size={13} /> Participant account</p><h1>My<br /><em>passes.</em></h1><p>{participant ? `Registrations securely linked to ${participant.fullName ?? participant.email}.` : "Restoring your secure session…"}</p></div></header><section className="container status-grid"><section className="registration-lookup" aria-labelledby="my-passes-heading"><div className="registration-lookup__head"><p className="section-kicker">Live registration credentials</p><h2 id="my-passes-heading">Your Digital Passes.</h2><p>Every registration owned by your authenticated account has its own QR-safe pass. No other participant’s registration is queried or shown.</p></div>{passes.isLoading && <p className="registration-lookup__note">Loading your Digital Passes…</p>}{passes.error && <p className="registration-lookup__note is-warning"><TriangleAlert size={15} /> We could not load your Digital Passes. Please refresh and try again.</p>}{passes.data?.length === 0 && <div className="digital-pass__empty"><Ticket size={22} /><p>No registrations are linked to this account yet.</p><Link className="button-primary" href="/events">Explore events</Link></div>}{passes.data && passes.data.length > 0 && <div className="my-passes__collection">{passes.data.map((pass) => <IndividualDigitalPassCard key={pass.registrationId} pass={pass} compact />)}</div>}</section></section></main></PageShell>;
}
