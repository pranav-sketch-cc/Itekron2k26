// I-TEKRON 2K26 — Schedule route: preserves the approved page shell while presenting the programme as an original physical-web agenda.
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import AgendaWeb from "@/components/AgendaWeb";
import { schedule } from "@/data/siteData";

export default function Schedule() {
  return (
    <PageShell>
      <PageMasthead
        index="03"
        eyebrow="Programme signal"
        title="A schedule that wakes as you move through it."
        copy="The final timetable remains to be announced. These programme nodes establish the event flow without inventing unconfirmed times."
      />
      <AgendaWeb schedule={schedule} />
    </PageShell>
  );
}
