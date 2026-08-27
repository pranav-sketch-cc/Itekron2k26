import { describe, expect, it } from "vitest";
import { getOrganizerFileLibraryState } from "./organizerFileLibrary";

describe("organizer file-library state", () => {
  it("keeps the library in a loading state until the protected metadata query settles", () => {
    expect(getOrganizerFileLibraryState(true, 0)).toBe("loading");
  });

  it("renders the explicit empty state when an organizer owns no stored references", () => {
    expect(getOrganizerFileLibraryState(false, 0)).toBe("empty");
  });

  it("renders stored-reference rows only when protected metadata exists", () => {
    expect(getOrganizerFileLibraryState(false, 1)).toBe("ready");
  });
});
