import Link from "next/link";
import { ChefHat } from "@/components/brand/ChefHat";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--cream-surface)] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="flex items-center gap-3">
          <ChefHat size={28} variant="outline" />
          <div className="flex flex-col leading-tight">
            <span className="btn-label text-brown">CHEFDOR</span>
            <span className="font-serif italic text-lg text-[color:var(--terracotta)] -mt-1">
              cakes
            </span>
          </div>
        </div>

        <nav className="flex gap-8">
          <Link href="/recettes" className="btn-label text-[color:var(--brown-soft)] hover:text-[color:var(--terracotta)]">
            Recettes
          </Link>
          <Link href="/a-propos" className="btn-label text-[color:var(--brown-soft)] hover:text-[color:var(--terracotta)]">
            À propos
          </Link>
        </nav>

        <p className="text-xs text-[color:var(--brown-mute)] text-center md:text-right">
          © {year} Chefdor Cakes
          <br />
          <span className="italic">Un carnet, des gâteaux.</span>
        </p>
      </div>
    </footer>
  );
}
