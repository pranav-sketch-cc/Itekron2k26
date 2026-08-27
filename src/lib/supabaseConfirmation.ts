const TOKEN_MAX_LENGTH = 4096;

export type SupabaseConfirmationTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SupabaseConfirmationParseResult =
  | { kind: "none" }
  | { kind: "tokens"; tokens: SupabaseConfirmationTokens }
  | { kind: "invalid" };

function validToken(value: string | null) {
  return Boolean(value && value.length > 0 && value.length <= TOKEN_MAX_LENGTH);
}

/**
 * Reads only the credential pair emitted by Supabase implicit confirmation.
 * The browser never logs or persists these values; callers must send them over
 * the same-origin authenticated transport straight to the server for validation.
 */
export function parseSupabaseConfirmationHash(hash: string): SupabaseConfirmationParseResult {
  const fragment = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!fragment) return { kind: "none" };

  const params = new URLSearchParams(fragment);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken && !refreshToken) return { kind: "none" };
  if (!validToken(accessToken) || !validToken(refreshToken) || !accessToken || !refreshToken) return { kind: "invalid" };

  return { kind: "tokens", tokens: { accessToken, refreshToken } };
}

export function safeParticipantNext(search: string, fallback = "/my-passes") {
  const requested = new URLSearchParams(search).get("next")?.trim();
  return requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : fallback;
}

export function callbackCleanUrl(pathname: string, search: string) {
  const next = safeParticipantNext(search);
  return `/auth/callback?next=${encodeURIComponent(next)}`;
}
