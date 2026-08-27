// I-TEKRON 2K26 — The Living Web: accessible registration-shell UI that remains honest about pending backend activation.
import { useState, type FormEvent } from "react";
import { ArrowUpRight, BadgeCheck, QrCode } from "lucide-react";
import WebField from "@/components/WebField";

const initialForm = { name: "", email: "", phone: "", college: "", department: "", year: "", event: "" };

export default function RegistrationScene() {
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("");
  const update = (field: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setNotice("Registration is not open yet. This form has not sent or stored your information."); };

  return (
    <section id="register" className="registration-scene section-shell" aria-labelledby="register-title">
      <WebField className="registration-scene__web" />
      <div className="container registration-scene__grid">
        <div className="registration-scene__intro"><p className="section-kicker">Connect to the network</p><h2 id="register-title" className="section-title">Bring your idea to the next node.</h2><p className="section-copy">The form and future verification flow are prepared for the official I-TEKRON 2K26 announcement. No payment or registration status is simulated here.</p><div className="registration-scene__status"><BadgeCheck size={17} /><span>Registration status: <b>opens soon</b></span></div></div>
        <form className="registration-form" onSubmit={submit} noValidate>
          <div className="registration-form__head"><span>Participant intake</span><small>Fields marked * will be required when official registration opens.</small></div>
          <label>Full name*<input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" autoComplete="name" /></label>
          <label>Email*<input value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="name@example.com" type="email" autoComplete="email" /></label>
          <label>Phone<input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Phone number" type="tel" autoComplete="tel" /></label>
          <label>College<input value={form.college} onChange={(event) => update("college", event.target.value)} placeholder="College name" /></label>
          <label>Department<input value={form.department} onChange={(event) => update("department", event.target.value)} placeholder="Department" /></label>
          <label>Year<select value={form.year} onChange={(event) => update("year", event.target.value)}><option value="">Select year</option><option value="one">I</option><option value="two">II</option><option value="three">III</option><option value="four">IV</option></select></label>
          <label className="registration-form__wide">Event selection<select value={form.event} onChange={(event) => update("event", event.target.value)}><option value="">Select an event</option><option value="paper-pulse">Paper Pulse</option><option value="hack-loop">Hack Loop</option><option value="debug-drift">Debug Drift</option><option value="tba">Other track — details TBA</option></select></label>
          <button className="button-primary registration-form__submit" type="submit">Trace registration status <ArrowUpRight size={16} /></button>
          <p className="registration-form__notice" aria-live="polite">{notice}</p>
        </form>
      </div>
      <div className="container pass-scene" aria-labelledby="pass-title">
        <div className="pass-scene__copy"><p className="section-kicker">Digital participant pass</p><h2 id="pass-title">Built for a future check-in flow.</h2><p>This preview demonstrates the credential layout only. A participant name, registration ID, and QR verification code will be assigned by the official registration system.</p></div>
        <div className="digital-pass" aria-label="Example participant pass layout">
          <div className="digital-pass__web" aria-hidden="true" /><span className="digital-pass__seal">IT</span><p className="digital-pass__brand">I-TEKRON <b>2K26</b></p><small>Technical symposium</small><div className="digital-pass__info"><span>Participant</span><strong>Assigned after registration</strong><span>Registration ID</span><strong>Issued by official system</strong></div><div className="digital-pass__qr"><QrCode size={34} /><small>QR reserved</small></div><em>Check-in status · unavailable</em>
        </div>
      </div>
    </section>
  );
}
