export type RegistrationFormStateInput = {
  isSubmitting: boolean;
  isEventsLoading: boolean;
  isEventsUnavailable: boolean;
  eventSourceError: boolean;
  notice: string;
  success: { registrationId: string; eventName: string; paymentRequired: boolean } | null;
};

export function getRegistrationErrorMessage(error: { message?: string; data?: { code?: string } | null }) {
  if (error.data?.code === "CONFLICT") return "You are already registered for this event.";
  return error.message || "The registration could not be stored. Please retry.";
}

export function getRegistrationFormState(input: RegistrationFormStateInput) {
  const submitDisabled = input.isSubmitting || input.isEventsLoading || input.isEventsUnavailable;
  const submitLabel = input.isSubmitting ? "Recording registration…" : "Submit registration";
  const message = input.eventSourceError
    ? "Live event options are temporarily unavailable. Please retry shortly."
    : input.notice;
  const messageKind = input.eventSourceError || Boolean(input.notice) ? "error" as const : "idle" as const;
  const successMessage = input.success
    ? input.success.paymentRequired
      ? "Registration recorded — payment remains pending"
      : "Registration complete — no payment is required"
    : null;

  return { submitDisabled, submitLabel, message, messageKind, successMessage };
}
