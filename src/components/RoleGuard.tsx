// I-TEKRON 2K26 — reusable organizer-only route boundary that presents access in place rather than redirecting away.
import { type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import OrganizerLoginPanel from "@/components/OrganizerLoginPanel";
import PageShell from "@/components/PageShell";

export default function RoleGuard({ children }: { children: ReactNode }) {
  const { role: currentRole } = useAuth();
  if (currentRole !== "organizer") return <PageShell><main className="tool-page"><section className="tool-page__mast"><div className="container"><OrganizerLoginPanel /></div></section></main></PageShell>;
  return <>{children}</>;
}
