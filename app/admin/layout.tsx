import Link from "next/link";
import { redirect } from "next/navigation";
import "@uploadthing/react/styles.css";
import { requireAdmin } from "@/lib/admin-guard";
import { signOut } from "@/lib/auth";
import { Logo } from "@/components/brand/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminId = await requireAdmin();
  if (!adminId) redirect("/connexion");

  const isBypass = adminId === "dev-bypass";

  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--cream-surface)] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <Logo size="sm" />
            </Link>
            <span
              className="btn-label px-2 py-1 bg-brown text-cream text-[9px]"
              style={{ letterSpacing: "0.2em" }}
            >
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="btn-label text-[color:var(--brown-soft)] hover:text-[color:var(--terracotta)] hidden md:block"
            >
              Voir le site ↗
            </Link>
            <span className="text-xs text-[color:var(--brown-mute)] hidden md:block">
              {isBypass ? "dev (bypass)" : adminId}
            </span>
            {!isBypass && (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="btn-label text-[color:var(--terracotta)] hover:text-[color:var(--terracotta-deep)]">
                  Déconnexion
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
