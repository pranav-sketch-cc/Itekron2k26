import { describe, expect, it } from "vitest";
import { callbackCleanUrl, parseSupabaseConfirmationHash, safeParticipantNext } from "./supabaseConfirmation";

describe("Supabase confirmation callback helpers", () => {
  it("accepts only a bounded access and refresh credential pair from an implicit confirmation fragment", () => {
    expect(parseSupabaseConfirmationHash("#access_token=access-value&refresh_token=refresh-value&type=signup")).toEqual({
      kind: "tokens",
      tokens: { accessToken: "access-value", refreshToken: "refresh-value" },
    });
  });

  it("rejects a partial or oversized implicit confirmation payload", () => {
    expect(parseSupabaseConfirmationHash("#access_token=access-value")).toEqual({ kind: "invalid" });
    expect(parseSupabaseConfirmationHash(`#access_token=${"a".repeat(4097)}&refresh_token=refresh-value`)).toEqual({ kind: "invalid" });
  });

  it("keeps participant navigation inside the application and removes credential fragments from the replacement URL", () => {
    expect(safeParticipantNext("?next=/my-passes")).toBe("/my-passes");
    expect(safeParticipantNext("?next=//untrusted.example")).toBe("/my-passes");
    expect(callbackCleanUrl("/auth/callback", "?next=/register")).toBe("/auth/callback?next=%2Fregister");
  });
});
