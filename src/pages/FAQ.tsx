// I-TEKRON 2K26 — standalone FAQ route retains the existing accordion treatment.
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import { faqs } from "@/data/siteData";

export default function FAQ() { const [open, setOpen] = useState(0); return <PageShell><PageMasthead index="05" eyebrow="Questions + answers" title="Questions, answered without static." copy="Available answers stay deliberately limited to currently confirmed symposium information." /><section className="page-scene faq-page"><div className="container faq-page__grid"><div><p className="section-kicker">FAQ signal</p><h2>Clarity, directly connected.</h2><p>Each answer reflects the published I-TEKRON 2K26 information state. More detail will flow here as official announcements are made.</p></div><div className="faq-list">{faqs.map((faq, index) => <article key={faq.question} className={open === index ? "is-open" : ""}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>{faq.question}<ChevronDown size={18} /></button>{open === index && <div className="faq-list__answer"><p>{faq.answer}</p></div>}</article>)}</div></div></section></PageShell>; }
