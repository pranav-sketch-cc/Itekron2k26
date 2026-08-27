// I-TEKRON 2K26 — The Living Web: reusable physical-feeling SVG web field and responsive section connector.
type WebFieldProps = { className?: string; pulse?: boolean; label?: string };

export default function WebField({ className = "", pulse = false, label = "" }: WebFieldProps) {
  return (
    <svg className={`web-field ${className}`} viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id="webGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="webFade" x1="0" x2="1"><stop stopColor="#2563eb" stopOpacity="0" /><stop offset="0.42" stopColor="#d9e6ff" stopOpacity="0.8" /><stop offset="0.78" stopColor="#e62429" stopOpacity="0.76" /><stop offset="1" stopColor="#e62429" stopOpacity="0" /></linearGradient>
      </defs>
      <g className="web-field__far">
        <path d="M-30 135 C170 10 315 220 497 132 S805 77 923 225 S1200 330 1480 105" />
        <path d="M-20 485 C236 356 327 539 520 450 S823 437 946 575 S1191 656 1450 455" />
        <path d="M118 0 C200 158 260 237 436 272 S700 294 748 505 S1075 554 1300 760" />
      </g>
      <g className="web-field__mid">
        <path d="M-50 645 C222 467 350 530 575 637 S956 652 1133 430 S1340 270 1490 278" />
        <path d="M274 -40 C408 115 530 281 605 442 S772 555 923 610 S1133 614 1279 789" />
        <path d="M1000 -50 C950 165 895 244 767 355 S616 594 465 765" />
      </g>
      <g className="web-field__near">
        <path d="M-35 365 C172 308 324 377 467 494 S718 651 897 522 S1190 316 1480 399" />
        <path d="M402 -40 C501 150 608 246 760 325 S1050 390 1480 677" />
      </g>
      <g className="web-field__nodes" filter="url(#webGlow)">
        <circle cx="605" cy="442" r="6" /><circle cx="923" cy="610" r="6" /><circle cx="1133" cy="430" r="5" /><circle cx="767" cy="355" r="5" />
        <circle className={pulse ? "web-field__pulse is-active" : "web-field__pulse"} cx="605" cy="442" r="15" />
      </g>
      {pulse && <path className="web-field__pulse-path" d="M-50 645 C222 467 350 530 575 637 S956 652 1133 430 S1340 270 1490 278" />}
      {label && <text x="620" y="430" className="web-field__label">{label}</text>}
    </svg>
  );
}
