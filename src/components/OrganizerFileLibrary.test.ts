import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrganizerFileLibrary } from "./OrganizerFileLibrary";

describe("OrganizerFileLibrary", () => {
  it("renders the explicit empty-state copy when the protected uploads query resolves with no files", () => {
    const markup = renderToStaticMarkup(
      createElement(OrganizerFileLibrary<{ id: number }>, {
        isLoading: false,
        files: [],
        renderFile: file => createElement("li", { key: file.id }, `File ${file.id}`),
      }),
    );

    expect(markup).toContain("No protected reference files stored yet.");
  });
});
