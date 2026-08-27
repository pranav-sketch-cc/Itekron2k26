// I-TEKRON 2K26 — The Living Web: sponsor placeholders and accessible FAQ controls without fabricated partner claims.
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs, sponsors } from "@/data/siteData";
import WebField from "@/components/WebField";

export default function CommunityScene() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <section id="sponsors" className="sponsors-scene section-shell" aria-labelledby="sponsors-title">
        <WebField className="sponsors-scene__web" />
        <div className="container"><div className="sponsors-scene__intro"><p className="section-kicker">Sponsor network</p><h2 id="sponsors-title" className="section-title">Partners will connect here.</h2><p className="section-copy">Confirmed sponsor marks will appear in this connected placement system. No sponsor relationships are represented until they are officially announced.</p></div><div className="sponsors-scene__grid">{sponsors.map((sponsor, index) => <div className="sponsor-placeholder" key={sponsor.id}><span>Node 0{index + 1}</span><strong>{sponsor.name}</strong><small>{sponsor.tier}</small></div>)}</div></div>
      </section>
      <section id="faq" className="faq-scene section-shell" aria-labelledby="faq-title">
        <div className="container faq-scene__grid"><div><p className="section-kicker">Signal clarity</p><h2 id="faq-title" className="section-title">Questions, answered without static.</h2></div><div className="faq-list">{faqs.map((item, index) => { const expanded = open === index; return <article className={expanded ? "is-open" : ""} key={item.question}><button type="button" aria-expanded={expanded} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(expanded ? null : index)}><span>{item.question}</span><ChevronDown size={19} /></button><div id={`faq-answer-${index}`} className="faq-list__answer" hidden={!expanded}><p>{item.answer}</p></div></article>; })}</div></div>
      </section>
    </>
  );
}
