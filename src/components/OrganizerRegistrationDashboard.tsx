import { ArrowDownUp, BarChart3, CheckCheck, ChevronDown, CircleX, Eye, FilterX, LoaderCircle, RefreshCw, Search, ShieldCheck, Signal, SlidersHorizontal, TimerReset, TriangleAlert, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import "@/organizer-registration-dashboard.css";

type Filters = {
  eventId: string;
  category: string;
  registrationType: string;
  registrationStatus: string;
  checkInStatus: string;
  paymentStatus: string;
  foodPreference: string;
  search: string;
  sortBy: "registrationDate" | "event" | "participantName" | "registrationStatus";
  sortDirection: "asc" | "desc";
};

const initialFilters: Filters = {
  eventId: "", category: "", registrationType: "", registrationStatus: "", checkInStatus: "", paymentStatus: "", foodPreference: "", search: "", sortBy: "registrationDate", sortDirection: "desc",
};

function compactFilterValue(value: string) { return value || undefined; }
function labelize(value: string | null) { return value ? value.replace(/_/g, " ") : "—"; }
function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
function memberValues(record: { members: Array<{ name: string | null; email: string | null; phone: string | null; foodPreference: string | null; isTeamLeader: boolean }> }, key: "name" | "email" | "phone" | "foodPreference") {
  return record.members.map((member) => member[key]).filter((value): value is string => Boolean(value)).join(" · ");
}
function StatusPill({ value, kind }: { value: string | null; kind: "registration" | "payment" | "checkin" }) {
  return <span className={`organizer-registration-dashboard__pill is-${kind} is-${value ?? "unknown"}`}>{labelize(value)}</span>;
}
function RecordIdentity({ record }: { record: { teamName: string | null; participantName: string | null; members: Array<{ name: string | null; email: string | null; phone: string | null; foodPreference: string | null; isTeamLeader: boolean }> } }) {
  return record.teamName ? <div className="organizer-registration-dashboard__identity"><b>{record.teamName}</b><small>{memberValues(record, "name") || "Team members unavailable"}</small></div> : <b>{record.participantName ?? "—"}</b>;
}

export default function OrganizerRegistrationDashboard({ isAdmin }: { isAdmin: boolean }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const queryInput = useMemo(() => ({
    eventId: compactFilterValue(filters.eventId),
    category: compactFilterValue(filters.category) as "Technical" | "Non-Technical" | undefined,
    registrationType: compactFilterValue(filters.registrationType) as "individual" | "team" | undefined,
    registrationStatus: compactFilterValue(filters.registrationStatus) as "pending" | "confirmed" | "cancelled" | "checked_in" | undefined,
    checkInStatus: compactFilterValue(filters.checkInStatus) as "checked_in" | "not_checked_in" | undefined,
    paymentStatus: compactFilterValue(filters.paymentStatus) as "not_required" | "pending" | "paid" | "failed" | "refunded" | undefined,
    foodPreference: compactFilterValue(filters.foodPreference) as "Vegetarian" | "Non-Vegetarian" | undefined,
    search: compactFilterValue(filters.search), sortBy: filters.sortBy, sortDirection: filters.sortDirection,
  }), [filters]);
  const dashboard = trpc.organizerRegistrations.list.useQuery(queryInput, { enabled: isAdmin, refetchInterval: 15_000, refetchOnWindowFocus: true });
  const summary = trpc.organizerRegistrations.summary.useQuery(undefined, { enabled: isAdmin, refetchInterval: 15_000, refetchOnWindowFocus: true });
  const detail = trpc.organizerRegistrations.detail.useQuery({ registrationId: selectedId ?? "ITEK-PLACEHOLDER" }, { enabled: isAdmin && Boolean(selectedId), retry: false });
  const utils = trpc.useUtils();
  const moderation = trpc.organizerRegistrations.moderate.useMutation({
    onSuccess: (result) => {
      setNotice(result.outcome === "updated" ? `Registration ${result.status === "confirmed" ? "confirmed" : "rejected"}.` : result.outcome === "not_pending" ? "This registration is no longer pending." : "Registration was not found.");
      void utils.organizerRegistrations.list.invalidate();
      void utils.organizerRegistrations.summary.invalidate();
      void utils.organizerRegistrations.detail.invalidate();
    },
  });
  const eventOptions = dashboard.data?.eventOptions ?? [];
  const records = dashboard.data?.records ?? [];
  const activeFilterCount = [filters.eventId, filters.category, filters.registrationType, filters.registrationStatus, filters.checkInStatus, filters.paymentStatus, filters.foodPreference].filter(Boolean).length;
  const updateFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => setFilters((current) => ({ ...current, [key]: value }));
  const setSort = (sortBy: Filters["sortBy"]) => setFilters((current) => ({ ...current, sortBy, sortDirection: current.sortBy === sortBy ? (current.sortDirection === "asc" ? "desc" : "asc") : "asc" }));
  const openDetail = (registrationId: string) => { setNotice(null); setSelectedId(registrationId); };

  if (!isAdmin) return null;

  return <section className="organizer-registration-dashboard" aria-labelledby="organizer-registration-dashboard-heading">
    <div className="container organizer-registration-dashboard__shell">
      <header className="organizer-registration-dashboard__header">
        <div>
          <p className="section-kicker"><UsersRound size={13} /> Organizer console</p>
          <h1 id="organizer-registration-dashboard-heading">Organizer Dashboard</h1>
          <p>Live registration oversight, attendance visibility, and pending-review actions from the authoritative event records.</p>
        </div>
        <div className="organizer-registration-dashboard__sync">
          <span><Signal size={14} /> Live · 15s / on focus</span>
          <small>{summary.data?.refreshedAt ? `Updated ${formatDate(summary.data.refreshedAt)}` : "Connecting to registration signal…"}</small>
          <button type="button" className="button-secondary organizer-registration-dashboard__refresh" onClick={() => { void dashboard.refetch(); void summary.refetch(); }} disabled={dashboard.isFetching || summary.isFetching}>
            {dashboard.isFetching || summary.isFetching ? <LoaderCircle className="is-spinning" size={15} /> : <RefreshCw size={15} />} {dashboard.isFetching || summary.isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      {notice && <p className="organizer-registration-dashboard__notice"><CheckCheck size={16} /> {notice}</p>}
      {summary.isError && <p className="organizer-registration-dashboard__notice is-error"><TriangleAlert size={16} /> {summary.error.message || "Dashboard statistics are temporarily unavailable."}</p>}

      <div className="organizer-registration-dashboard__metrics" aria-label="Registration statistics">
        {[
          { label: "Total registrations", value: summary.data?.totalRegistrations, icon: BarChart3 },
          { label: "Confirmed", value: summary.data?.confirmedRegistrations, icon: ShieldCheck },
          { label: "Pending review", value: summary.data?.pendingRegistrations, icon: TimerReset },
          { label: "Checked in", value: summary.data?.checkedInCount, icon: CheckCheck },
        ].map((metric) => <article className="organizer-registration-dashboard__metric" key={metric.label}><metric.icon size={17} /><span>{metric.label}</span><strong>{summary.isLoading ? "—" : metric.value ?? 0}</strong></article>)}
      </div>

      <div className="organizer-registration-dashboard__insights">
        <article><div className="organizer-registration-dashboard__insights-title"><BarChart3 size={16} /><h2>Event-wise registration state</h2></div>{summary.isLoading ? <p>Calculating live event totals…</p> : summary.data?.eventStats.length ? <div className="organizer-registration-dashboard__event-grid">{summary.data.eventStats.map((event) => <div key={event.eventId}><b>{event.eventName}</b><small>{event.category ?? "Uncategorized"}</small><span><strong>{event.total}</strong> total · {event.pending} pending · {event.checkedIn} checked in</span></div>)}</div> : <p>No event statistics are available yet.</p>}</article>
        <article><div className="organizer-registration-dashboard__insights-title"><CheckCheck size={16} /><h2>Recent check-ins</h2></div>{summary.isLoading ? <p>Reading attendance signal…</p> : summary.data?.recentCheckIns.length ? <ul className="organizer-registration-dashboard__recent">{summary.data.recentCheckIns.map((record) => <li key={record.registrationId}><span><b>{record.teamName || record.participantName || "Unavailable"}</b><small>{record.eventName} · {record.registrationId}</small></span><time>{formatDate(record.checkedInAt)}</time></li>)}</ul> : <p>No completed check-ins yet.</p>}</article>
      </div>

      <div className="organizer-registration-dashboard__management-heading">
        <div><p className="section-kicker"><ArrowDownUp size={13} /> Management</p><h2>Registration management</h2><p>Search the current attendance signal, then open a protected record when details or a pending decision are needed.</p></div>
        <div className="organizer-registration-dashboard__mix"><UsersRound size={15} /><span><b>{summary.data?.individualCount ?? 0}</b> individual · <b>{summary.data?.teamCount ?? 0}</b> team · <b>{summary.data?.notCheckedInCount ?? 0}</b> not checked in</span></div>
      </div>

      <div className="organizer-registration-dashboard__filter-bar" aria-label="Registration search and filters">
        <label className="organizer-registration-dashboard__search"><Search size={17} /><span className="sr-only">Search registrations</span><input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search by registration ID, participant, or team" /></label>
        <div className="organizer-registration-dashboard__filter-popover">
          <button type="button" className="button-secondary organizer-registration-dashboard__filters-button" aria-expanded={filtersOpen} aria-controls="organizer-dashboard-filters" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal size={16} /> Filters &amp; sort{activeFilterCount ? <span>{activeFilterCount}</span> : null}<ChevronDown size={14} /></button>
          {filtersOpen && <div id="organizer-dashboard-filters" className="organizer-registration-dashboard__filters" role="region" aria-label="Registration filters">
            <label>Event<select value={filters.eventId} onChange={(event) => updateFilter("eventId", event.target.value)}><option value="">All events</option>{eventOptions.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select></label>
            <label>Category<select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}><option value="">All categories</option><option value="Technical">Technical</option><option value="Non-Technical">Non-Technical</option></select></label>
            <label>Registration type<select value={filters.registrationType} onChange={(event) => updateFilter("registrationType", event.target.value)}><option value="">All types</option><option value="individual">Individual</option><option value="team">Team</option></select></label>
            <label>Registration status<select value={filters.registrationStatus} onChange={(event) => updateFilter("registrationStatus", event.target.value)}><option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="checked_in">Checked in</option></select></label>
            <label>Check-in status<select value={filters.checkInStatus} onChange={(event) => updateFilter("checkInStatus", event.target.value)}><option value="">All attendance</option><option value="checked_in">Checked in</option><option value="not_checked_in">Not checked in</option></select></label>
            <label>Payment status<select value={filters.paymentStatus} onChange={(event) => updateFilter("paymentStatus", event.target.value)}><option value="">All payment states</option><option value="not_required">Not required</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></label>
            <label>Food preference<select value={filters.foodPreference} onChange={(event) => updateFilter("foodPreference", event.target.value)}><option value="">All food preferences</option><option value="Vegetarian">Vegetarian</option><option value="Non-Vegetarian">Non-Vegetarian</option></select></label>
            <label>Sort by<select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value as Filters["sortBy"])}><option value="registrationDate">Registration date</option><option value="event">Event</option><option value="participantName">Participant / team</option><option value="registrationStatus">Registration status</option></select></label>
            <label>Direction<select value={filters.sortDirection} onChange={(event) => updateFilter("sortDirection", event.target.value as Filters["sortDirection"])}><option value="desc">Newest first</option><option value="asc">Oldest first</option></select></label>
            <button className="organizer-registration-dashboard__reset" type="button" onClick={() => setFilters(initialFilters)}><FilterX size={15} /> Reset filters</button>
          </div>}
        </div>
      </div>

      <div className="organizer-registration-dashboard__table-card">
        <div className="organizer-registration-dashboard__table-topline"><span>{dashboard.isLoading ? "Reading registrations…" : `${records.length} registration${records.length === 1 ? "" : "s"} in view`}</span><span><ArrowDownUp size={13} /> {filters.sortBy === "registrationDate" ? "Registration date" : filters.sortBy === "participantName" ? "Participant / team" : filters.sortBy === "registrationStatus" ? "Registration status" : "Event"} · {filters.sortDirection}</span></div>
        <div className="organizer-registration-dashboard__desktop-table">
          <table>
            <thead><tr><th>Registration ID</th><th><button type="button" onClick={() => setSort("event")}>Event <ArrowDownUp size={12} /></button></th><th><button type="button" onClick={() => setSort("participantName")}>Participant / team <ArrowDownUp size={12} /></button></th><th>Type</th><th><button type="button" onClick={() => setSort("registrationStatus")}>Status <ArrowDownUp size={12} /></button></th><th>Check-in</th><th><button type="button" onClick={() => setSort("registrationDate")}>Registered <ArrowDownUp size={12} /></button></th><th><span className="sr-only">Review</span></th></tr></thead>
            <tbody>
              {dashboard.isLoading && <tr><td colSpan={8}><span className="organizer-registration-dashboard__state"><LoaderCircle className="is-spinning" size={17} /> Loading registration data…</span></td></tr>}
              {dashboard.isError && <tr><td colSpan={8}><span className="organizer-registration-dashboard__state is-error"><TriangleAlert size={17} /> {dashboard.error.message || "Registration data is temporarily unavailable. Please refresh."}</span></td></tr>}
              {!dashboard.isLoading && !dashboard.isError && records.length === 0 && <tr><td colSpan={8}><span className="organizer-registration-dashboard__state">No registrations match the current filter signal.</span></td></tr>}
              {!dashboard.isLoading && !dashboard.isError && records.map((record) => <tr key={record.registrationId}><td><strong>{record.registrationId}</strong></td><td><b>{record.eventName}</b></td><td><RecordIdentity record={record} /></td><td>{labelize(record.registrationType)}</td><td><StatusPill value={record.registrationStatus} kind="registration" /></td><td><StatusPill value={record.checkInStatus} kind="checkin" /></td><td>{formatDate(record.registrationDate)}</td><td><button className="organizer-registration-dashboard__review" type="button" onClick={() => openDetail(record.registrationId)}><Eye size={14} /><span>Details</span></button></td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="organizer-registration-dashboard__mobile-list">
          {dashboard.isLoading && <p className="organizer-registration-dashboard__state"><LoaderCircle className="is-spinning" size={17} /> Loading registration data…</p>}
          {dashboard.isError && <p className="organizer-registration-dashboard__state is-error"><TriangleAlert size={17} /> {dashboard.error.message || "Registration data is temporarily unavailable. Please refresh."}</p>}
          {!dashboard.isLoading && !dashboard.isError && records.length === 0 && <p className="organizer-registration-dashboard__state">No registrations match the current filter signal.</p>}
          {!dashboard.isLoading && !dashboard.isError && records.map((record) => <article className="organizer-registration-dashboard__mobile-card" key={record.registrationId}><div className="organizer-registration-dashboard__mobile-card-top"><strong>{record.registrationId}</strong><StatusPill value={record.checkInStatus} kind="checkin" /></div><RecordIdentity record={record} /><p>{record.eventName} · {labelize(record.registrationType)}</p><div className="organizer-registration-dashboard__mobile-card-meta"><StatusPill value={record.registrationStatus} kind="registration" /><span>{formatDate(record.registrationDate)}</span></div><button className="organizer-registration-dashboard__review" type="button" onClick={() => openDetail(record.registrationId)}><Eye size={14} /> Details</button></article>)}
        </div>
      </div>

      {selectedId && <div className="organizer-registration-dashboard__modal-backdrop" role="presentation" onMouseDown={() => setSelectedId(null)}><article className="organizer-registration-dashboard__detail" role="dialog" aria-modal="true" aria-labelledby="organizer-registration-detail-heading" onMouseDown={(event) => event.stopPropagation()}><button className="organizer-registration-dashboard__close" type="button" onClick={() => setSelectedId(null)} aria-label="Close registration details">×</button>{detail.isLoading ? <p className="organizer-registration-dashboard__state"><LoaderCircle className="is-spinning" size={17} /> Loading protected registration details…</p> : detail.isError || !detail.data ? <p className="organizer-registration-dashboard__state is-error"><TriangleAlert size={17} /> {detail.error?.message || "Registration details are unavailable."}</p> : <><p className="section-kicker"><ShieldCheck size={13} /> Protected record review</p><h2 id="organizer-registration-detail-heading">{detail.data.teamName || detail.data.participantName || "Registration"}</h2><p className="organizer-registration-dashboard__detail-id">{detail.data.registrationId} · {detail.data.eventName}</p><div className="organizer-registration-dashboard__detail-grid"><div><span>Status</span><StatusPill value={detail.data.registrationStatus} kind="registration" /></div><div><span>Check-in</span><StatusPill value={detail.data.checkInStatus} kind="checkin" /></div><div><span>College</span><b>{detail.data.college ?? "—"}</b></div><div><span>Department / Year</span><b>{[detail.data.department, detail.data.year].filter(Boolean).join(" · ") || "—"}</b></div><div><span>Email</span><b>{detail.data.email ?? "—"}</b></div><div><span>Phone</span><b>{detail.data.phone ?? "—"}</b></div><div><span>Registered</span><b>{formatDate(detail.data.registrationDate)}</b></div><div><span>Checked in</span><b>{formatDate(detail.data.checkedInAt)}</b></div></div>{detail.data.teamName && <section className="organizer-registration-dashboard__roster"><h3>{detail.data.teamName} · Team roster</h3><ul>{detail.data.members.map((member, index) => <li key={`${member.email ?? member.name ?? "member"}-${index}`}><b>{member.name ?? "Unnamed member"}{member.isTeamLeader ? " · Leader" : ""}</b><small>{[member.department, member.year, member.foodPreference].filter(Boolean).join(" · ") || "Profile details unavailable"}</small></li>)}</ul></section>}{detail.data.registrationStatus === "pending" && <div className="organizer-registration-dashboard__moderation"><p>Pending registration action</p><span>Confirmation enables the unchanged check-in flow. Rejection stores the existing `cancelled` state and cannot alter attendance records.</span><div><button type="button" className="button-primary" disabled={moderation.isPending} onClick={() => moderation.mutate({ registrationId: detail.data!.registrationId, action: "confirm" })}>{moderation.isPending ? "Saving…" : "Confirm registration"}</button><button type="button" className="button-secondary organizer-registration-dashboard__reject" disabled={moderation.isPending} onClick={() => moderation.mutate({ registrationId: detail.data!.registrationId, action: "reject" })}>Reject registration</button></div>{moderation.isError && <p className="organizer-registration-dashboard__mutation-error">{moderation.error.message}</p>}</div>}</>}</article></div>}
    </div>
  </section>;
}
