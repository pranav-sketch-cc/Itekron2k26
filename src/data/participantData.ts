// I-TEKRON 2K26 — shared prototype participant record for the pass, status, and organizer scan scenes.
export type ParticipantRecord = {
  name: string;
  email: string;
  college: string;
  registrationId: string;
  registeredEvents: string[];
  registrationType: string;
  registrationStatus: "confirmed";
  paymentStatus: string;
  registrationDate: string;
  eventDate: string;
  venue: string;
  qrPayload: string;
};

export const prototypeParticipant: ParticipantRecord = {
  name: "Prototype Participant",
  email: "participant@itekron.demo",
  college: "Demo institution — replace after registration",
  registrationId: "ITK26-DEMO-001",
  registeredEvents: ["Paper Pulse", "Hack Loop"],
  registrationType: "Individual prototype registration",
  registrationStatus: "confirmed",
  paymentStatus: "Demo record — not a payment verification",
  registrationDate: "Registration date to be announced",
  eventDate: "February 2026",
  venue: "IT Block & Auditorium",
  qrPayload: "ITEKRON2K26:DEMO:ITK26-DEMO-001",
};
