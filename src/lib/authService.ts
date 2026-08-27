// I-TEKRON 2K26 — temporary organizer-only adapter; replace this module with Supabase or server auth in production.
export type AuthRole = "organizer";

export type AuthUser = {
  name: string;
  email?: string;
  role: AuthRole;
};

export type AuthSession = {
  isAuthenticated: true;
  role: AuthRole;
  user: AuthUser;
};

export type OrganizerCredentials = {
  organizerId: string;
  password: string;
};

const organizerDemo = {
  id: "organizer",
  password: "ITEKRON_ORG",
};

const pause = () => new Promise((resolve) => window.setTimeout(resolve, 360));

export const authService = {
  async loginOrganizer(credentials: OrganizerCredentials): Promise<AuthSession | null> {
    await pause();
    if (credentials.organizerId === organizerDemo.id && credentials.password === organizerDemo.password) {
      return {
        isAuthenticated: true,
        role: "organizer",
        user: { name: "Organizer", role: "organizer" },
      };
    }
    return null;
  },
};
