import { auth } from "./auth";

/**
 * Vérifie l'accès admin. En dev, ADMIN_BYPASS=1 court-circuite NextAuth
 * (le temps que Resend soit branché — issue #7).
 * Renvoie un identifiant utilisateur (email ou "dev") ou null si refusé.
 */
export async function requireAdmin(): Promise<string | null> {
  if (process.env.ADMIN_BYPASS === "1") return "dev-bypass";

  const session = await auth();
  if (!session?.user?.email) return null;

  const allowed = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!allowed || session.user.email.toLowerCase() !== allowed) return null;

  return session.user.email;
}
