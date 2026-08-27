export type IndividualDigitalPass = {
  registrationId: string;
  qrPayload: string;
  eventName: string;
  eventCategory: string;
  participantName: string;
  college: string;
  department: string;
  year: string;
  registrationStatus: string;
  registrationDate: string | null;
};

export type OwnedDigitalPass = IndividualDigitalPass & {
  registrationType: "individual" | "team";
  teamName: string | null;
};
