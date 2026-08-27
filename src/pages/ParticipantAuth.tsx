import { ArrowRight, KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { callbackCleanUrl, parseSupabaseConfirmationHash, safeParticipantNext } from "@/lib/supabaseConfirmation";
import "@/participant-tools.css";

function nextPath() {
  if (typeof window === "undefined") return "/";
  return safeParticipantNext(window.location.search, "/");
}

function friendlyError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function Login() {
  const [, setLocation] = useLocation();
  const { setParticipant } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const signIn = trpc.supabaseAuth.signIn.useMutation();
  const recovery = trpc.supabaseAuth.forgotPassword.useMutation();
  const fieldError = useMemo(() => !email || !password ? "Enter your email address and password." : "", [email, password]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice("");
    if (fieldError) return setNotice(fieldError);
    try {
      const user = await signIn.mutateAsync({ email, password });
      setParticipant(user);
      setLocation(nextPath());
    } catch (error) { setNotice(friendlyError(error, "We could not sign you in. Please try again.")); }
  };
  const sendRecovery = async () => {
    setNotice("");
    if (!email) return setNotice("Enter your email address first, then request a reset link.");
    try { await recovery.mutateAsync({ email }); setNotice("If an account exists for this email, a password reset link has been sent."); } catch (error) { setNotice(friendlyError(error, "We could not send a reset link. Please try again.")); }
  };
  return <AuthShell eyebrow="Participant access" title={<>Welcome<br /><em>back.</em></>} description="Sign in to keep your registrations connected to your account and access My Passes."><form className="registration-lookup__form" onSubmit={submit}><label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{notice && <p className="registration-lookup__note is-warning">{notice}</p>}<button className="button-primary" type="submit" disabled={signIn.isPending}>{signIn.isPending ? "Signing in…" : <><ArrowRight size={16} /> Login</>}</button><button className="tool-link-button" type="button" onClick={() => void sendRecovery()} disabled={recovery.isPending}>{recovery.isPending ? "Sending reset link…" : <><KeyRound size={15} /> Forgot password?</>}</button></form><p className="auth-screen__switch">New to I-TEKRON? <Link href={`/signup?next=${encodeURIComponent(nextPath())}`}>Create an account</Link></p></AuthShell>;
}

export function SignUp() {
  const [, setLocation] = useLocation();
  const { setParticipant } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const signUp = trpc.supabaseAuth.signUp.useMutation();
  const validation = () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) return "Complete every field to create your account.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
    if (password.length < 8) return "Use a password with at least 8 characters.";
    return password !== confirmPassword ? "Passwords do not match." : "";
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const error = validation();
    setNotice("");
    if (error) return setNotice(error);
    try {
      const result = await signUp.mutateAsync({ fullName, email, password });
      if (result.session) { setParticipant(result.session); setLocation(nextPath()); return; }
      setNotice("Account created. Please confirm your email to continue securely to your account.");
    } catch (reason) { setNotice(friendlyError(reason, "We could not create your account. Please try again.")); }
  };
  return <AuthShell eyebrow="Participant account" title={<>Join the<br /><em>Living Web.</em></>} description="Create an account to save registrations securely and access your event passes."><form className="registration-lookup__form" onSubmit={submit}><label>Full name<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label><label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label><label>Confirm password<input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>{notice && <p className="registration-lookup__note is-warning">{notice}</p>}<button className="button-primary" type="submit" disabled={signUp.isPending}>{signUp.isPending ? "Creating account…" : <><UserRound size={16} /> Sign Up</>}</button></form><p className="auth-screen__switch">Already have an account? <Link href={`/login?next=${encodeURIComponent(nextPath())}`}>Login</Link></p></AuthShell>;
}

export function SupabaseConfirmationCallback() {
  const [, setLocation] = useLocation();
  const { setParticipant } = useAuth();
  const [notice, setNotice] = useState("Securing your confirmed participant session…");
  const started = useRef(false);
  const completeEmailConfirmation = trpc.supabaseAuth.completeEmailConfirmation.useMutation();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const target = safeParticipantNext(window.location.search);
    const parsed = parseSupabaseConfirmationHash(window.location.hash);
    window.history.replaceState(null, "", callbackCleanUrl(window.location.pathname, window.location.search));

    if (parsed.kind === "none") {
      setNotice("This confirmation page does not contain a participant session. Please sign in to continue.");
      return;
    }
    if (parsed.kind === "invalid") {
      setNotice("This email confirmation link is incomplete or invalid. Please sign in or request a new confirmation email.");
      return;
    }

    void completeEmailConfirmation.mutateAsync(parsed.tokens)
      .then((participant) => {
        setParticipant(participant);
        setLocation(target);
      })
      .catch(() => {
        setNotice("We could not securely complete your session. Please sign in or request a new confirmation email.");
      });
  }, [completeEmailConfirmation, setLocation, setParticipant]);

  return <AuthShell eyebrow="Email confirmed" title={<>Securing your<br /><em>account.</em></>} description="Your confirmation is being verified before a participant session is created."><div className="registration-lookup__form"><p className="registration-lookup__note is-warning" aria-live="polite">{notice}</p><Link className="button-primary" href="/login">Go to Login</Link></div></AuthShell>;
}

function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: React.ReactNode; description: string; children: React.ReactNode }) {
  return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><ShieldCheck size={13} /> {eyebrow}</p><h1>{title}</h1><p>{description}</p></div></header><section className="container auth-screen"><div className="registration-lookup"><div className="registration-lookup__head"><p className="section-kicker"><Mail size={13} /> Secure Supabase session</p><h2>Participant access.</h2></div>{children}</div></section></main></PageShell>;
}
