import { describe, expect, it } from "vitest";
import { parseOrganizerQrPayload } from "./organizerQr";

describe("parseOrganizerQrPayload", () => {
  it("accepts the existing registration-ID-only QR payload", () => {
    expect(parseOrganizerQrPayload("  itek-wbx-0001 ")).toBe("ITEK-WBX-0001");
  });

  it("rejects URLs, personal data, alternate prefixes, and malformed payloads", () => {
    expect(parseOrganizerQrPayload("https://example.test/pass/ITEK-WBX-0001")).toBeNull();
    expect(parseOrganizerQrPayload("person@example.test")).toBeNull();
    expect(parseOrganizerQrPayload("OTHER-WBX-0001")).toBeNull();
    expect(parseOrganizerQrPayload("short")).toBeNull();
  });
});
