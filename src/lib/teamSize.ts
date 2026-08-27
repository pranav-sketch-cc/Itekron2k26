export type TeamSizeRule = { minimum: number; maximum?: number };

export function isEventRegistrationAvailable(teamType?: string | null, teamSize?: string | null) {
  const normalizedType = teamType?.trim().toLowerCase();
  return normalizedType === "individual" || (normalizedType === "team" && parseTeamSizeRule(teamSize) !== null);
}

export function parseTeamSizeRule(teamSize?: string | null): TeamSizeRule | null {
  const value = teamSize?.trim().toLowerCase() ?? "";
  if (!value) return null;

  const range = value.match(/(\d+)\s*(?:-|–|to)\s*(\d+)\s*members?/i);
  if (range) {
    const minimum = Number(range[1]);
    const maximum = Number(range[2]);
    return Number.isInteger(minimum) && Number.isInteger(maximum) && minimum > 0 && maximum >= minimum ? { minimum, maximum } : null;
  }

  const minimum = value.match(/minimum\s*(?:of\s*)?(\d+)\s*members?/i);
  if (minimum) {
    const parsed = Number(minimum[1]);
    return Number.isInteger(parsed) && parsed > 0 ? { minimum: parsed } : null;
  }

  const exact = value.match(/^(\d+)\s*members?$/i);
  if (exact) {
    const parsed = Number(exact[1]);
    return Number.isInteger(parsed) && parsed > 0 ? { minimum: parsed, maximum: parsed } : null;
  }

  return null;
}
