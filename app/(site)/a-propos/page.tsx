import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire derrière Chefdor Cakes — un carnet de pâtisserie écrit à la main.",
};

export default function AProposPage() {
  return (
    <main className="px-6 py-24 max-w-2xl mx-auto">
      <p className="eyebrow">À propos</p>
      <h1 className="font-serif text-5xl md:text-6xl mt-4 leading-[1.05]">
        Un carnet, <span className="accent">des gâteaux</span>
      </h1>

      <div className="mt-12 space-y-6 text-lg leading-relaxed text-[color:var(--brown-soft)] font-serif">
        <p>
          Chefdor Cakes est un carnet personnel. Les recettes qu&apos;on partage ici
          sont celles qu&apos;on refait — celles qui marchent, celles qu&apos;on
          recommande, celles qu&apos;on aimerait avoir notées plus tôt.
        </p>
        <p>
          Pas de listes à rallonge, pas de mots-clés SEO. Une recette, une histoire,
          une photo prise dans la cuisine. Le reste, c&apos;est à toi de jouer.
        </p>
        <p className="italic text-[color:var(--terracotta)]">
          — placeholder éditorial, sera réécrit en S4 par l&apos;auteure.
        </p>
      </div>
    </main>
  );
}
