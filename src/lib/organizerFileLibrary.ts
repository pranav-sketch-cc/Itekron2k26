export type OrganizerFileLibraryState = "loading" | "empty" | "ready";

export function getOrganizerFileLibraryState(isLoading: boolean, fileCount: number): OrganizerFileLibraryState {
  if (isLoading) return "loading";
  return fileCount > 0 ? "ready" : "empty";
}
