// I-TEKRON 2K26 — public participant status node backed by a durable registration-code lookup.
import { Radio } from "lucide-react";
import PageShell from "@/components/PageShell";
import RegistrationLookup from "@/components/RegistrationLookup";
import "@/participant-tools.css";

export default function RegistrationStatus() {
  return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><Radio size={13} /> Participant tools · Persistent record</p><h1>Registration<br /><em>status.</em></h1><p>Use the code issued after registration to read your stored record. This page does not claim payment validation or confirmation unless an organizer has explicitly applied it.</p></div></header><section className="container status-grid"><RegistrationLookup mode="status" /><aside className="status-aside"><p className="section-kicker">Record note</p><h2>One live signal.</h2><p>Registration codes are public lookup keys for the participant’s own record. Keep yours available for later confirmation and event-day credential steps.</p></aside></section></main></PageShell>;
}
