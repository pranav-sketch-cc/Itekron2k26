import React from "react";

export default function EventDataState({ kind }: { kind: "loading" | "error" | "empty" }) {
  const content = {
    loading: { title: "Synchronising event nodes.", copy: "Retrieving the latest programme from the event network." },
    error: { title: "Event signal interrupted.", copy: "The live programme could not be retrieved. Please try again shortly." },
    empty: { title: "No event nodes are published yet.", copy: "The programme will appear here as soon as it is released." },
  }[kind];

  return <div className="event-live-state" role={kind === "error" ? "alert" : "status"} aria-live="polite"><p className="section-kicker">{kind === "error" ? "Signal delayed" : "Live event feed"}</p><h3>{content.title}</h3><p>{content.copy}</p></div>;
}
