import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Download } from "lucide-react";
import type { IndividualDigitalPass, OwnedDigitalPass } from "@/lib/individualDigitalPass";
import "@/participant-tools.css";
import "@/individual-digital-pass.css";

type IndividualDigitalPassCardProps = {
  pass: IndividualDigitalPass | OwnedDigitalPass;
  compact?: boolean;
};

function readableStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function IndividualDigitalPassCard({ pass, compact = false }: IndividualDigitalPassCardProps) {
  const isTeamPass = "registrationType" in pass && pass.registrationType === "team";
  return (
    <section className={`individual-digital-pass ${compact ? "individual-digital-pass--compact" : ""}`} aria-label={isTeamPass ? "Team event Digital Pass" : "Individual event Digital Pass"}>
      <div className="pass-card individual-digital-pass__card">
        <div className="pass-card__top">
          <div><p className="pass-card__brand">I-TEKRON <b>2K26</b></p><span>Technical Symposium · Dept. of IT</span></div>
          <small>LIVE<br />{isTeamPass ? "TEAM PASS" : "DIGITAL PASS"}</small>
        </div>
        <div className="pass-card__body">
          <div>
            <p className="pass-card__label">{isTeamPass ? "Team representative" : "Participant"}</p>
            <h3>{pass.participantName}</h3>
            <p className="pass-card__institution">{pass.college}</p>
            <div className="individual-digital-pass__facts">
              <span>{pass.eventCategory} event</span>
              <span>{pass.department} · {pass.year}</span>
              {isTeamPass && <span>Team · {pass.teamName}</span>}
            </div>
            <div className="pass-card__events"><p>Registered event</p><strong>{pass.eventName}</strong></div>
          </div>
          <div className="pass-card__qr" aria-label={`QR code for registration ${pass.registrationId}`}>
            <QRCodeSVG value={pass.qrPayload} size={120} level="M" includeMargin={false} bgColor="#f5f7fb" fgColor="#08101c" />
            <small>REGISTRATION<br />VERIFICATION</small>
          </div>
        </div>
        <div className="pass-card__bottom">
          <div><span>Registration ID</span><strong>{pass.registrationId}</strong></div>
          <div><span>Status</span><strong><CheckCircle2 size={13} /> {readableStatus(pass.registrationStatus)}</strong></div>
          <div><span>Issued</span><strong>{pass.registrationDate ? new Date(pass.registrationDate).toLocaleDateString() : "Recorded"}</strong></div>
        </div>
      </div>
      {!compact && <button className="individual-digital-pass__download" type="button" onClick={() => window.print()}><Download size={15} /> Save / download pass</button>}
    </section>
  );
}
