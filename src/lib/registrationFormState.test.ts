import { describe, expect, it } from "vitest";
import { getRegistrationErrorMessage, getRegistrationFormState } from "./registrationFormState";

const baseState = {
  isSubmitting: false,
  isEventsLoading: false,
  isEventsUnavailable: false,
  eventSourceError: false,
  notice: "",
  success: null,
};

describe("registration form UI state", () => {
  it("shows the recording state and disables repeat submission while a registration is pending", () => {
    expect(getRegistrationFormState({ ...baseState, isSubmitting: true })).toMatchObject({
      submitDisabled: true,
      submitLabel: "Recording registration…",
    });
  });

  it("disables submission until live individual event options are ready", () => {
    expect(getRegistrationFormState({ ...baseState, isEventsLoading: true }).submitDisabled).toBe(true);
    expect(getRegistrationFormState({ ...baseState, isEventsUnavailable: true }).submitDisabled).toBe(true);
  });

  it("returns a safe user-facing source or mutation error", () => {
    expect(getRegistrationFormState({ ...baseState, notice: "This email is already registered for the selected event." })).toMatchObject({
      messageKind: "error",
      message: "This email is already registered for the selected event.",
    });
    expect(getRegistrationFormState({ ...baseState, eventSourceError: true, notice: "ignored" }).message).toBe("Live event options are temporarily unavailable. Please retry shortly.");
    expect(getRegistrationErrorMessage({ data: { code: "CONFLICT" }, message: "database detail" })).toBe("You are already registered for this event.");
  });

  it("presents the readable success state and event-aware payment outcome", () => {
    expect(getRegistrationFormState({ ...baseState, success: { registrationId: "ITEK-WEBBUGX-AB12CD34", eventName: "WebBugX", paymentRequired: false } }).successMessage).toBe("Registration complete — no payment is required");
    expect(getRegistrationFormState({ ...baseState, success: { registrationId: "ITEK-PAID-AB12CD34", eventName: "Paid event", paymentRequired: true } }).successMessage).toBe("Registration recorded — payment remains pending");
  });
});
