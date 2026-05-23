import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AdminHome() {
  const session = await auth();

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <div className="mt-4 flex items-end justify-between gap-6">
        <h1 className="font-serif text-5xl">
          Admin <span className="accent">Chefdor Cakes</span>
        </h1>
        <Link href="/admin/nouvelle">
          <Button>Nouvelle recette</Button>
        </Link>
      </div>
      <p className="mt-6 text-[color:var(--brown-soft)]">
        Connecté en tant que <strong>{session?.user?.email}</strong>.
      </p>
      <p className="mt-12 text-[color:var(--brown-mute)] text-sm">
        La liste des recettes apparaîtra ici (sprint S3).
      </p>
    </div>
  );
}
