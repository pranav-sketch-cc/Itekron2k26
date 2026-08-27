// I-TEKRON 2K26 — backend-honest utility surface for future authenticated participant services.
import type { LucideIcon } from "lucide-react";
import PageMasthead from "@/components/PageMasthead";
import PageShell from "@/components/PageShell";
import WebField from "@/components/WebField";

type ToolPlaceholderProps = {
  index: string;
  eyebrow: string;
  title: string;
  copy: string;
  label: string;
  detail: string;
  Icon: LucideIcon;
  restricted?: boolean;
};

export default function ToolPlaceholder({ index, eyebrow, title, copy, label, detail, Icon, restricted = false }: ToolPlaceholderProps) {
  return <PageShell><PageMasthead index={index} eyebrow={eyebrow} title={title} copy={copy} /><section className="page-scene tool-page"><WebField className="tool-page__web" /><div className="container tool-page__grid"><div><p className="section-kicker">{restricted ? "Restricted utility" : "Participant utility"}</p><h2>{label}</h2><p>{detail}</p></div><div className="tool-page__terminal"><Icon size={35} /><p className="tool-page__state">{restricted ? "Authentication required" : "Service not connected"}</p><h3>{restricted ? "Organizer access stays protected." : "This signal is waiting for the official system."}</h3><p>{restricted ? "This static interface does not expose attendee records or check-in controls. Authentication and authorization must be connected before it becomes operational." : "No data is entered, stored, verified, or simulated in this preview. It is ready for the future registration service."}</p></div></div></section></PageShell>;
}
