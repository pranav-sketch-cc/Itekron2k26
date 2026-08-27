// I-TEKRON 2K26 — independent contact route keeps the city's final signal but removes it from Home.
import { Instagram, Mail, MapPin } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import WebField from "@/components/WebField";
import { siteMeta } from "@/data/siteData";

export default function Contact() { return <PageShell><PageMasthead index="06" eyebrow="Contact the department" title="The next signal begins here." copy="Official coordinators, email, phone, social channels, and campus instructions will be published by the Department of Information Technology." /><section className="page-scene contact-page"><WebField className="contact-page__web" label="CONTACT NODE" /><div className="container contact-page__grid"><div><p className="section-kicker">Reach the source</p><h2>Stay attached to the official current.</h2><p>Use the confirmed venue and future official channels below. Direct contact details remain intentionally unlisted until the department publishes them.</p></div><div className="contact-page__details"><div><MapPin size={19} /><span><b>Venue</b>{siteMeta.venue}<small>{siteMeta.venueNote}</small></span></div><div><Mail size={19} /><span><b>Email</b>Official contact to be announced<small>{siteMeta.department}</small></span></div><div><Instagram size={19} /><span><b>Social</b>Official channels to be announced<small>Follow I-TEKRON 2K26 updates</small></span></div></div></div></section></PageShell>; }
