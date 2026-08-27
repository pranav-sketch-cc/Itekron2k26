// I-TEKRON 2K26 — organizer-only in-place access panel; the credential adapter remains isolated in authService.
import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import "@/participant-tools.css";

export default function OrganizerLoginPanel() {
  const { loginOrganizer } = useAuth();
  const [organizerId, setOrganizerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const valid = await loginOrganizer({ organizerId, password });
    setLoading(false);
    if (!valid) setError("Unable to verify organizer access. Check the credentials and try again.");
  };

  return <div className="organizer-login"><div className="organizer-login__beacon" aria-hidden="true" /><p className="section-kicker"><LockKeyhole size={13} /> Restricted operations</p><h1>Organizer<br /><em>check-in.</em></h1><p>Access the live check-in workstation for participant pass verification.</p><form onSubmit={submit} noValidate><div className="organizer-login__fields"><label>Organizer ID<input value={organizerId} onChange={(event) => setOrganizerId(event.target.value)} autoComplete="username" required /></label><label>Organizer Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label></div>{error && <p className="organizer-login__error" role="alert">{error}</p>}<button type="submit" className="button-primary" disabled={loading}>{loading ? "VERIFYING ACCESS" : "LOGIN TO CHECK-IN"} <ArrowRight size={16} /></button></form><small>Organizer access only</small></div>;
}
