// I-TEKRON 2K26 — organizer-only session boundary; UI never depends directly on the demo credential adapter.
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { authService, type AuthRole, type AuthSession, type OrganizerCredentials } from "@/lib/authService";
import { trpc } from "@/lib/trpc";

type ParticipantSession = { id: string; email: string; fullName: string | null };

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: AuthRole | null;
  loginOrganizer: (credentials: OrganizerCredentials) => Promise<boolean>;
  logout: () => void;
  participant: ParticipantSession | null;
  participantLoading: boolean;
  setParticipant: (participant: ParticipantSession | null) => void;
  refreshParticipant: () => Promise<unknown>;
  logoutParticipant: () => Promise<void>;
};

const SESSION_KEY = "itekron-2k26-prototype-session";
const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): AuthSession | null {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as AuthSession;
    return parsed?.isAuthenticated && parsed.role === "organizer" ? parsed : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readSession);
  const participantSession = trpc.supabaseAuth.session.useQuery(undefined, { retry: false, refetchOnWindowFocus: true });
  const participantSignOut = trpc.supabaseAuth.signOut.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAuthenticated: Boolean(session),
    role: session?.role ?? null,
    async loginOrganizer(credentials) {
      const nextSession = await authService.loginOrganizer(credentials);
      if (!nextSession) return false;
      setSession(nextSession);
      return true;
    },
    logout() {
      setSession(null);
    },
    participant: participantSession.data ?? null,
    participantLoading: participantSession.isLoading,
    setParticipant(participant) {
      utils.supabaseAuth.session.setData(undefined, participant);
    },
    refreshParticipant() {
      return participantSession.refetch();
    },
    async logoutParticipant() {
      await participantSignOut.mutateAsync();
      utils.supabaseAuth.session.setData(undefined, null);
      utils.supabaseAuth.myPasses.setData(undefined, []);
    },
  }), [participantSession.data, participantSession.isLoading, participantSession.refetch, participantSignOut, session, utils]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
