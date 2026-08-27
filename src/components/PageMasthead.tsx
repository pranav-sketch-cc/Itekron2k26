// I-TEKRON 2K26 — page-specific entry plane, deliberately distinct from the homepage hero.
import WebField from "@/components/WebField";

type Props = { eyebrow: string; title: string; copy: string; index?: string };

export default function PageMasthead({ eyebrow, title, copy, index = "SIGNAL" }: Props) {
  return <header className={`page-masthead page-masthead--${index.replace(/[^a-zA-Z0-9]/g, "")}`}><div className="page-masthead__route" aria-hidden="true"><i /><b /><span /></div><div className="page-masthead__structure" aria-hidden="true" /><WebField className="page-masthead__web" /><div className="container page-masthead__inner"><p className="section-kicker">{index} · {eyebrow}</p><h1>{title}</h1><p>{copy}</p></div></header>;
}
