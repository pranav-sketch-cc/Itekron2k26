import { LayoutDashboard, ScanLine } from "lucide-react";
import { useLocation } from "wouter";
import PageShell from "@/components/PageShell";
import OrganizerOperationsPanel from "@/components/OrganizerOperationsPanel";
import OrganizerRegistrationDashboard from "@/components/OrganizerRegistrationDashboard";
import { useAuth as useManusAuth } from "@/_core/hooks/useAuth";
import "@/participant-tools.css";

export default function OrganizerDashboard() {
  const { user, loading, isAuthenticated } = useManusAuth();
  const [, navigate] = useLocation();
  const isAdmin = Boolean(!loading && isAuthenticated && user?.role === "admin");
  if (!isAdmin) return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><LayoutDashboard size={13} /> Restricted operations · Managed access</p><h1>Organizer<br /><em>dashboard.</em></h1><p>Live registration management is restricted to authenticated organizer administrators.</p></div></header><OrganizerOperationsPanel /></main></PageShell>;
  return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><LayoutDashboard size={13} /> Restricted operations · Organizer session</p><h1>Organizer<br /><em>dashboard.</em></h1><p>Review live registrations and attendance state, then use the protected scanner for ID-only QR verification and check-in.</p><button type="button" className="button-secondary" onClick={() => navigate("/organizer-checkin")}><ScanLine size={15} /> Open QR scanner</button></div></header><OrganizerRegistrationDashboard isAdmin={isAdmin} /><OrganizerOperationsPanel /></main></PageShell>;
}
