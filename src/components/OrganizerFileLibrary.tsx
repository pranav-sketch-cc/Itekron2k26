import React, { type ReactNode } from "react";
import { getOrganizerFileLibraryState } from "@/lib/organizerFileLibrary";

type OrganizerFileLibraryProps<T> = {
  isLoading: boolean;
  files: readonly T[];
  renderFile: (file: T) => ReactNode;
};

export function OrganizerFileLibrary<T>({ isLoading, files, renderFile }: OrganizerFileLibraryProps<T>) {
  const state = getOrganizerFileLibraryState(isLoading, files.length);

  if (state === "loading") {
    return <p className="organizer-operations__file-state">Reading protected file library…</p>;
  }

  if (state === "empty") {
    return <p className="organizer-operations__file-state">No protected reference files stored yet.</p>;
  }

  return <ul className="organizer-operations__files">{files.map(renderFile)}</ul>;
}
