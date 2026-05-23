"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Sheet } from "@/components/ui/sheet";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/recettes", label: "Recettes" },
  { href: "/a-propos", label: "À propos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const direction = useScrollDirection();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-[color:var(--cream)]/85 backdrop-blur-md",
        "border-b border-[color:var(--border)] transition-transform duration-300",
        direction === "down" ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Chefdor Cakes — accueil">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="btn-label text-brown hover:text-[color:var(--terracotta)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden text-brown"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} side="right">
        <div className="flex items-center justify-between mb-10">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-brown"
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-serif text-3xl text-brown hover:text-[color:var(--terracotta)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Sheet>
    </header>
  );
}
