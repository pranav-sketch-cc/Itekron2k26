// I-TEKRON 2K26 — Living Web agenda: a scoped, scroll-scrubbed physical-silk launch deploys from an original masked forearm into organic branch attachments; no SVG or pre-expanded web is used.
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ScheduleItem } from "@/data/siteData";

const forearmAsset = "/manus-storage/itekron_agenda_launch_forearm_b7af99c2.png";
const silkLaunchAsset = "/manus-storage/itekron_agenda_launch_silk_e3a05cee.png";
const branchAsset = "/manus-storage/itekron_agenda_launch_branches_4c83eab6.png";
const scheduleNodeMilestones = [
  { progress: 0.36, reach: 0.37 },
  { progress: 0.57, reach: 0.54 },
  { progress: 0.74, reach: 0.68 },
  { progress: 0.86, reach: 0.81 },
  { progress: 0.94, reach: 0.92 },
];

function getNodeMilestones(count: number) {
  if (count === scheduleNodeMilestones.length) return scheduleNodeMilestones;
  if (count <= 1) return [{ progress: 0.5, reach: 0.64 }];
  return Array.from({ length: count }, (_, index) => ({
    progress: 0.36 + (index / (count - 1)) * 0.58,
    reach: 0.37 + (index / (count - 1)) * 0.55,
  }));
}

function revealAt(progress: number, start: number, duration: number) {
  return Math.min(1, Math.max(0, (progress - start) / duration));
}

function silkLeadingEdge(progress: number, nodeMilestones: { progress: number; reach: number }[]) {
  const checkpoints = [{ progress: 0.18, reach: 0 }, ...nodeMilestones, { progress: 0.99, reach: 1 }];
  if (progress <= checkpoints[0].progress) return 0;
  for (let index = 1; index < checkpoints.length; index += 1) {
    const previous = checkpoints[index - 1];
    const next = checkpoints[index];
    if (progress <= next.progress) {
      const local = (progress - previous.progress) / (next.progress - previous.progress);
      return previous.reach + (next.reach - previous.reach) * local;
    }
  }
  return 1;
}

function SilkLaunch({ progress, nodeMilestones }: { progress: number; nodeMilestones: { progress: number; reach: number }[] }) {
  const projectile = revealAt(progress, 0.1, 0.08);
  const webReach = silkLeadingEdge(progress, nodeMilestones);

  return (
    <div className="agenda-web__launch" aria-hidden="true">
      <div className="agenda-web__launch-haze" />
      <img className="agenda-web__forearm" src={forearmAsset} alt="" />
      <div className="agenda-web__wrist-source" style={{ opacity: 0.28 + projectile * 0.72, transform: `translate3d(-50%, 0, 0) scale(${0.76 + projectile * 0.24})` }} />
      <div className="agenda-web__projectile" style={{ opacity: projectile, transform: `translate3d(-50%, ${webReach * 76}vh, 0) scale(${0.5 + projectile * 0.58})` }}>
        <img src={silkLaunchAsset} alt="" />
      </div>
      <div className="agenda-web__vertical-silk" style={{ clipPath: `inset(0 39% ${Math.max(0, 100 - webReach * 100)}% 39%)`, opacity: webReach }}>
        <img src={silkLaunchAsset} alt="" />
      </div>
      {nodeMilestones.map(({ progress: nodeProgress }, index) => {
        const activation = revealAt(progress, nodeProgress, 0.035);
        const tension = revealAt(progress, nodeProgress + 0.025, 0.06);
        const branchDirection = index % 2 === 0 ? 1 : -1;
        return (
          <div key={nodeProgress}>
            <div className={`agenda-web__node agenda-web__node--${index + 1} ${activation > 0.94 ? "is-active" : ""}`} style={{ opacity: 0.16 + activation * 0.84, transform: `translate3d(-50%, -50%, 0) scale(${0.82 + activation * 0.23})` }}>
              <span className="agenda-web__node-halo" style={{ opacity: activation }} />
              <span className="agenda-web__node-core" />
              <span className="agenda-web__node-pulse" style={{ opacity: activation }} />
            </div>
            <div className={`agenda-web__branch-silk agenda-web__branch-silk--${index + 1} ${tension > 0.94 ? "is-tensioned" : ""}`} style={{ opacity: tension * 0.82, transform: `translate3d(0, ${(1 - tension) * -7}px, 0) scaleX(${branchDirection * (0.3 + tension * 0.7)})` }}>
              <img src={branchAsset} alt="" />
            </div>
          </div>
        );
      })}
      <div className="agenda-web__silk-depth" style={{ opacity: webReach * 0.14 }}>
        <img src={branchAsset} alt="" />
      </div>
    </div>
  );
}

type AgendaWebProps = {
  schedule: ScheduleItem[];
  variant?: "schedule" | "home";
  intro?: ReactNode;
};

export default function AgendaWeb({ schedule, variant = "schedule", intro }: AgendaWebProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState(schedule[0]?.id ?? "");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(1800);
  const nodeMilestones = getNodeMilestones(schedule.length);
  const isHome = variant === "home";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 719px)");
    const updateLayout = () => setMobileLayout(media.matches);
    updateLayout();
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion || mobileLayout) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const updateDistance = () => {
      const mobileViewport = window.matchMedia("(max-width: 719px)").matches;
      // Phones retain the same full silk-and-node reveal, but should not require
      // the desktop-sized pinned travel before the footer becomes reachable.
      setScrollDistance(Math.round(window.innerHeight * (mobileViewport ? 1.72 : 3.05)));
    };
    const updateProgress = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const travel = Math.max(root.offsetHeight - window.innerHeight, 1);
        const next = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / travel));
        setProgress((current) => (Math.abs(current - next) < 0.002 ? current : next));
        frame = 0;
      });
    };

    updateDistance();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateDistance, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateDistance);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(frame);
    };
  }, [mobileLayout, reducedMotion]);

  const rootStyle = { "--agenda-scroll-distance": `${scrollDistance}px` } as CSSProperties;
  const activeNodeCount = nodeMilestones.filter(({ progress: nodeProgress }) => progress >= nodeProgress).length;
  const progressStatus = progress < 0.1 ? "source lock" : progress < nodeMilestones[0].progress ? "silk extension" : progress < 1 ? `node ${String(activeNodeCount).padStart(2, "0")} active` : "network attached";

  return (
    <section ref={rootRef} className={`agenda-web ${isHome ? "agenda-web--home" : ""} ${reducedMotion ? "is-reduced-motion" : ""} ${mobileLayout ? "is-mobile-layout" : ""} ${progress > 0.96 ? "is-settled" : ""}`} style={rootStyle} aria-labelledby="agenda-title">
      <div className="agenda-web__pin">
        <div className="container agenda-web__shell">
          <header className="agenda-web__intro">
            {intro ?? <><p className="section-kicker">03 · Programme flow</p><h2 id="agenda-title">Agenda</h2><p>Follow each symposium moment as it fastens into a single live sequence. Precise timings will attach when the official programme is released.</p></>}
          </header>
          <div className="agenda-web__canvas">
            <div className="agenda-web__depth" aria-hidden="true" />
            <SilkLaunch progress={progress} nodeMilestones={nodeMilestones} />
            <aside className="agenda-web__launch-signal" aria-hidden="true">
              <span>Route channel</span>
              <strong>{String(schedule.length).padStart(2, "0")}</strong>
              <b>pending programme signals</b>
              <i>Scroll to deploy silk</i>
            </aside>
            <ol className="agenda-web__cards">
              {schedule.map((item, index) => {
                const cardStart = Math.min(0.975, nodeMilestones[index].progress + 0.035);
                const reveal = reducedMotion || mobileLayout ? 1 : revealAt(progress, cardStart, 0.025);
                const side = index % 2 === 0 ? 1 : -1;
                return (
                  <li
                    key={item.id}
                    className={`agenda-web__card agenda-web__card--${index + 1} ${selected === item.id ? "is-selected" : ""}`}
                    style={{ opacity: reveal, transform: `translate3d(${side * (1 - reveal) * -20}px, ${(1 - reveal) * 11}px, 0) scale(${0.97 + reveal * 0.03})` }}
                  >
                    <button type="button" onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} tabIndex={reveal > 0.95 ? 0 : -1}>
                      <span>{item.phase}</span>
                      <b>{item.title}</b>
                      <small>{item.note}</small>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="agenda-web__progress" aria-hidden="true">{progressStatus} · {Math.round(progress * 100)}%</p>
        </div>
      </div>
    </section>
  );
}
