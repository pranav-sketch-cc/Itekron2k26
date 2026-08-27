// I-TEKRON 2K26 — The Living Web: interactive network timeline; an intentional single-use signal pulse.
import { useState } from "react";
import { schedule } from "@/data/siteData";
import WebField from "@/components/WebField";

export default function ScheduleScene() {
  const [active, setActive] = useState(0);
  return (
    <section id="schedule" className="schedule-scene section-shell" aria-labelledby="schedule-title">
      <WebField className="schedule-scene__web" pulse label="NETWORK LIVE" />
      <div className="container schedule-scene__grid">
        <div><p className="section-kicker">Route map</p><h2 id="schedule-title" className="section-title">A schedule that wakes as you move through it.</h2><p className="section-copy">Select a node to trace the provisional event route. Final timings will be published with the official symposium brief.</p></div>
        <ol className="network-timeline">
          {schedule.map((item, index) => <li key={item.id} className={index === active ? "is-active" : ""}>
            <button type="button" onClick={() => setActive(index)} aria-pressed={index === active}><span className="network-timeline__node" aria-hidden="true"><i /></span><div><em>{item.phase}</em><strong>{item.title}</strong><small>{item.note}</small></div></button>
          </li>)}
        </ol>
      </div>
    </section>
  );
}
