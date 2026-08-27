// I-TEKRON 2K26 — partner route with the same tethered placement language.
import type { CSSProperties } from "react";
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import WebField from "@/components/WebField";
import { sponsors } from "@/data/siteData";

export default function Sponsors() { return <PageShell><PageMasthead index="04" eyebrow="Partner network" title="Partners will connect here." copy="Confirmed sponsor identities and marks will appear once they are officially announced. Existing placements are intentionally non-branded." /><section className="page-scene sponsors-page"><WebField className="sponsors-page__web" label="PARTNER SIGNAL" /><div className="container"><p className="section-kicker">Signal placements</p><div className="sponsors-page__grid">{sponsors.map((sponsor, index) => <article className="sponsor-placeholder" key={sponsor.id} style={{ "--sponsor-index": index } as CSSProperties}><span>{sponsor.tier}</span><strong>{sponsor.name}</strong><small>Official mark to be announced</small></article>)}</div></div></section></PageShell>; }
