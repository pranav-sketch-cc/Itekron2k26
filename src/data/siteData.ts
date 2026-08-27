// I-TEKRON 2K26 — source-controlled content models; unknown 2K26 details remain explicitly marked TBA.
export type EventCategory = "technical" | "nonTechnical";

export type SymposiumEvent = {
  id: string;
  number: string;
  category: EventCategory;
  name: string;
  description: string;
  eventType: string;
  teamType?: string;
  teamSize?: string;
  dateTime?: string;
  registrationDeadline?: string;
  format: string;
  duration: string;
  details: {
    rules?: string[];
    team?: string;
    duration?: string;
    venue?: string;
    prizes?: string;
    registration?: string;
  };
  isPlaceholder?: boolean;
};

export type ScheduleItem = { id: string; phase: string; title: string; note: string };
export type Sponsor = { id: string; name: string; tier: string };
export type FaqItem = { question: string; answer: string };

export const siteMeta = {
  name: "I-TEKRON 2K26",
  department: "Department of Information Technology",
  eventType: "Technical Symposium",
  date: "February 2026",
  dateNote: "Exact date to be announced",
  venue: "IT Block & Auditorium",
  venueNote: "Campus venue to be announced",
  programme: "11 Event Tracks",
};

export const schedule: ScheduleItem[] = [
  { id: "inauguration", phase: "Node 01", title: "Inauguration", note: "Time to be announced" },
  { id: "technical", phase: "Node 02", title: "Technical Events", note: "Time to be announced" },
  { id: "workshops", phase: "Node 03", title: "Workshops", note: "Time to be announced" },
  { id: "nontechnical", phase: "Node 04", title: "Non-Technical Events", note: "Time to be announced" },
  { id: "valedictory", phase: "Node 05", title: "Valedictory", note: "Time to be announced" },
];

export const sponsors: Sponsor[] = [
  { id: "partner-one", name: "Partner placement", tier: "Title partner · To be announced" },
  { id: "partner-two", name: "Partner placement", tier: "Community partner · To be announced" },
  { id: "partner-three", name: "Partner placement", tier: "Technology partner · To be announced" },
];

export const faqs: FaqItem[] = [
  { question: "When is I-TEKRON 2K26?", answer: "The symposium is planned for February 2026. The exact date will be announced by the Department of Information Technology." },
  { question: "Where will the symposium take place?", answer: "The intended venue is the IT Block and Auditorium. Campus venue details will be announced with the final schedule." },
  { question: "How can I register?", answer: "The registration interface is prepared for the event. Submission and verification will be enabled when official registration opens." },
  { question: "Are all event rules available now?", answer: "Event cards show only available details. Full rules, prizes, and final venue information will be published with the official event brief." },
];

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];
