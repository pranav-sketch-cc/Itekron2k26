// I-TEKRON 2K26 — protected organizer QR verification and duplicate-safe check-in.
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { Camera, CheckCircle2, ClipboardCheck, LayoutDashboard, LogOut, ScanLine } from "lucide-react";
import { useLocation } from "wouter";
import PageShell from "@/components/PageShell";
import OrganizerOperationsPanel from "@/components/OrganizerOperationsPanel";
import OrganizerRegistrationDashboard from "@/components/OrganizerRegistrationDashboard";
import { useAuth as useManusAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { parseOrganizerQrPayload } from "@/lib/organizerQr";
import "@/participant-tools.css";
import "@/organizer-qr-scanner.css";

type ScannerState = "idle" | "camera" | "verifying" | "verified" | "duplicate" | "ineligible" | "error";
type VerifiedPass = {
  registrationId: string;
  eventName: string;
  category: string | null;
  registrationType: string | null;
  attendeeName: string | null;
  college: string | null;
  teamName: string | null;
  registrationStatus: string | null;
  paymentStatus: string | null;
  registrationDate: string | null;
  checkedInAt: string | null;
  canCheckIn: boolean;
  teamMembers: Array<{ name: string | null; isTeamLeader: boolean }>;
};

export default function OrganizerCheckin() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const { user, loading, isAuthenticated, logout } = useManusAuth();
  const [, navigate] = useLocation();
  const [state, setState] = useState<ScannerState>("idle");
  const [manualId, setManualId] = useState("");
  const [requestedRegistrationId, setRequestedRegistrationId] = useState("");
  const [scannerMessage, setScannerMessage] = useState<string | null>(null);
  const [record, setRecord] = useState<VerifiedPass | null>(null);

  const scannerStatus = trpc.organizerQr.status.useQuery(undefined, { staleTime: 60_000 });
  const stopScanner = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
  };

  const verifyQuery = trpc.organizerQr.verify.useQuery(
    { registrationId: requestedRegistrationId },
    { enabled: requestedRegistrationId.length > 0, retry: false, refetchOnWindowFocus: false },
  );
  const checkInMutation = trpc.organizerQr.checkIn.useMutation({
    onSuccess: (data) => {
      const verified = data.record as VerifiedPass | null;
      setRecord(verified);
      setState(data.outcome === "verified" ? "verified" : data.outcome === "duplicate" ? "duplicate" : "ineligible");
      setScannerMessage(data.outcome === "verified" ? "Check-in recorded." : data.outcome === "duplicate" ? "This pass has already been checked in." : "This registration is not eligible for check-in.");
    },
    onError: (error) => {
      setScannerMessage(error.message);
      setState("error");
    },
  });

  useEffect(() => () => stopScanner(), []);
  useEffect(() => {
    if (!requestedRegistrationId) return;
    if (verifyQuery.isError) {
      setScannerMessage(verifyQuery.error.message);
      setState("error");
      return;
    }
    if (!verifyQuery.isSuccess) return;
    const verified = verifyQuery.data as VerifiedPass | null;
    setRecord(verified);
    if (!verified) {
      setScannerMessage("No registration matches this pass.");
      setState("error");
      return;
    }
    setState(verified.checkedInAt ? "duplicate" : verified.canCheckIn ? "verified" : "ineligible");
  }, [requestedRegistrationId, verifyQuery.data, verifyQuery.error, verifyQuery.isError, verifyQuery.isSuccess]);

  const verifyPayload = (payload: string) => {
    const registrationId = parseOrganizerQrPayload(payload);
    if (!registrationId) {
      setScannerMessage("This QR is not an I-TEKRON registration identifier.");
      setState("error");
      return;
    }
    stopScanner();
    setManualId(registrationId);
    setScannerMessage(null);
    setState("verifying");
    setRequestedRegistrationId(registrationId);
  };

  const enableCamera = async () => {
    if (!scannerStatus.data?.configured || !videoRef.current) return;
    try {
      stopScanner();
      setScannerMessage(null);
      setState("camera");
      const reader = new BrowserMultiFormatReader();
      scannerControlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result) verifyPayload(result.getText());
      });
    } catch {
      setScannerMessage("Camera access was not granted or is unavailable in this browser.");
      setState("error");
    }
  };

  const scanNext = () => {
    stopScanner();
    setRecord(null);
    setManualId("");
    setRequestedRegistrationId("");
    setScannerMessage(null);
    setState("idle");
  };
  const handleLogout = () => {
    stopScanner();
    logout();
    navigate("/organizer-checkin");
  };
  const configured = scannerStatus.data?.configured === true;
  const stateCopy = state === "verified"
    ? [record?.checkedInAt ? "CHECK-IN VERIFIED" : "REGISTRATION VERIFIED", record?.checkedInAt ? "USER CHECKED IN" : "READY FOR CHECK-IN"]
    : state === "duplicate"
      ? ["ALREADY CHECKED IN", "Duplicate scan blocked"]
      : state === "ineligible"
        ? ["NOT ELIGIBLE", "Registration needs attention"]
        : ["SCAN STATUS", "Awaiting participant pass"];

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><ScanLine size={13} /> Restricted operations · Managed access</p><h1>Organizer<br /><em>check-in.</em></h1><p>Live camera, verification, and check-in controls are restricted to authenticated organizer administrators.</p></div></header><OrganizerOperationsPanel /></main></PageShell>;
  }

  return <PageShell><main className="tool-page"><header className="tool-page__mast"><div className="container"><p className="section-kicker"><ScanLine size={13} /> Restricted operations · Organizer session</p><h1>Organizer<br /><em>check-in.</em></h1><p>Read the existing registration-ID-only Digital Pass QR, verify the minimum record, then confirm one duplicate-safe check-in.</p><button type="button" className="button-secondary" onClick={() => navigate("/organizer-dashboard")}><LayoutDashboard size={15} /> Open dashboard</button></div></header><section className="container checkin-layout"><article className="scanner-panel"><div className="scanner-panel__top"><p>Camera / QR scanner</p>{state === "camera" && <span className="scanner-status"><i /> Camera active</span>}</div><div className="scanner-viewport"><video ref={videoRef} autoPlay playsInline muted /><div className={`scanner-frame ${state === "verified" ? "is-verified" : ""}`} aria-hidden="true"><i /><i /><i /><i /><b /></div>{!configured ? <div className="scanner-prompt"><p>Secure verification setup required</p><span>Camera decoding is ready, but organizer-wide registration lookup remains disabled until the server-only Supabase role is configured.</span><small className="scanner-note">Project Management UI → Settings → Secrets → <strong>SUPABASE_SERVICE_ROLE_KEY</strong>. Keep this value server-side only.</small></div> : state === "idle" ? <div className="scanner-prompt"><p>Camera access</p><span>Allow camera access to read a participant’s registration-ID-only pass.</span><button type="button" className="button-primary" onClick={enableCamera}><Camera size={16} /> Enable camera</button></div> : state === "camera" || state === "verifying" ? <div className="scanner-prompt"><p>{state === "verifying" ? "Verifying pass" : "Camera ready"}</p><span>{state === "verifying" ? "Checking the protected organizer record." : "Point the camera at the existing Digital Pass QR."}</span></div> : <div className="scanner-prompt"><p>{state === "verified" ? "Pass verified" : state === "duplicate" ? "Repeat scan" : "Verification unavailable"}</p><span>{scannerMessage ?? "Review the record panel before continuing."}</span><div className="scanner-actions"><button type="button" className="button-primary" onClick={scanNext}>Scan next participant</button></div></div>}</div></article><aside className="scanner-side"><article className={`checkin-result ${state === "verified" ? "checkin-result--verified" : state === "duplicate" ? "checkin-result--duplicate" : ""}`}><p className="checkin-result__label">{stateCopy[0]}</p><h2>{stateCopy[1]}</h2>{record ? <><p>{scannerMessage ?? "Review the verified registration before recording check-in."}</p><div className="checkin-result__record"><div><span>Participant / leader</span><strong>{record.attendeeName ?? "Unavailable"}</strong></div><div><span>Registration ID</span><strong>{record.registrationId}</strong></div><div><span>Event</span><strong>{record.eventName}</strong></div>{record.teamName && <div><span>Team</span><strong>{record.teamName}</strong></div>}{record.teamMembers.length > 0 && <div><span>Team members</span><strong>{record.teamMembers.map((member) => `${member.name ?? "Unavailable"}${member.isTeamLeader ? " (Leader)" : ""}`).join(", ")}</strong></div>}<div><span>College</span><strong>{record.college ?? "Unavailable"}</strong></div><div><span>Status</span><strong>{record.registrationStatus ?? "Unavailable"}</strong></div>{record.checkedInAt && <div><span>Checked in</span><strong>{new Date(record.checkedInAt).toLocaleString()}</strong></div>}</div>{record.canCheckIn && <button type="button" className="button-primary" disabled={checkInMutation.isPending} onClick={() => checkInMutation.mutate({ registrationId: record.registrationId })}><ClipboardCheck size={16} /> {checkInMutation.isPending ? "Recording…" : "Confirm check-in"}</button>}<button type="button" className="button-secondary" onClick={scanNext}>Scan next participant</button></> : <><p>{configured ? "Use the camera or enter the registration ID from the existing Digital Pass." : "No organizer-wide records are fetched until secure server-only configuration is present."}</p><label className="registration-lookup__field"><span>Registration ID</span><input value={manualId} onChange={(event) => setManualId(event.target.value)} placeholder="ITEK-…" disabled={!configured || verifyQuery.isFetching} /></label><button type="button" className="button-primary" disabled={!configured || verifyQuery.isFetching || !manualId.trim()} onClick={() => verifyPayload(manualId)}><CheckCircle2 size={16} /> {verifyQuery.isFetching ? "Verifying…" : "Verify registration"}</button></>}</article><div className="checkin-hint"><p>Security boundary</p><span>The browser receives only the verified check-in projection. Supabase service-role access remains server-side and is never sent to the camera or Digital Pass.</span></div><button type="button" className="button-secondary" onClick={handleLogout}><LogOut size={15} /> Log out</button></aside></section><OrganizerRegistrationDashboard isAdmin={user?.role === "admin"} /><OrganizerOperationsPanel /></main></PageShell>;
}
