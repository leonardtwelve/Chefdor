import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { RecipeCard } from "@/components/marketing/RecipeCard";
import { FilterChip } from "@/components/marketing/FilterChip";

export const metadata: Metadata = {
  title: "Toutes les recettes",
  description: "Le carnet complet : tartes, entremets, gâteaux, petits formats.",
};

const DIFFICULTIES = [
  { value: "FACILE", label: "Facile" },
  { value: "INTERMEDIAIRE", label: "Intermédiaire" },
  { value: "AVANCE", label: "Avancé" },
] as const;

type Params = {
  category?: string;
  difficulty?: string;
  signature?: string;
};

function buildHref(base: Params, patch: Partial<Params>): string {
  const merged = { ...base, ...patch };
  const sp = new URLSearchParams();
  if (merged.category) sp.set("category", merged.category);
  if (merged.difficulty) sp.set("difficulty", merged.difficulty);
  if (merged.signature) sp.set("signature", merged.signature);
  const qs = sp.toString();
  return qs ? `/recettes?${qs}` : "/recettes";
}

type Props = { searchParams: Promise<Params> };

export default async function RecettesListPage({ searchParams }: Props) {
  const params = await searchParams;
  const signatureOnly = params.signature === "1";

  const recipes = await db.recipe.findMany({
    where: {
      status: "PUBLISHED",
      ...(params.category ? { category: params.category } : {}),
      ...(params.difficulty
        ? { difficulty: params.difficulty as "FACILE" | "INTERMEDIAIRE" | "AVANCE" }
        : {}),
      ...(signatureOnly ? { isSignature: true } : {}),
    },
    orderBy: [{ isSignature: "desc" }, { publishedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      intro: true,
      category: true,
      servings: true,
      servingUnit: true,
      prepMinutes: true,
      cookMinutes: true,
      isSignature: true,
      heroImageUrl: true,
      heroImageWidth: true,
      heroImageHeight: true,
      heroImageAlt: true,
    },
  });

  const hasFilters = !!(params.category || params.difficulty || signatureOnly);

  return (
    <main className="px-6 pt-20 pb-24 max-w-6xl mx-auto">
      <header className="text-center mb-16">
        <p className="eyebrow">Le carnet complet</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-4">
          Toutes les <span className="accent">recettes</span>
        </h1>
      </header>

      {/* Filtres */}
      <div className="space-y-5 mb-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-3">Catégorie</span>
          <FilterChip href={buildHref(params, { category: undefined })} active={!params.category}>
            Tout
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.slug}
              href={buildHref(params, { category: c.slug })}
              active={params.category === c.slug}
            >
              {c.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-3">Difficulté</span>
          <FilterChip href={buildHref(params, { difficulty: undefined })} active={!params.difficulty}>
            Toutes
          </FilterChip>
          {DIFFICULTIES.map((d) => (
            <FilterChip
              key={d.value}
              href={buildHref(params, { difficulty: d.value })}
              active={params.difficulty === d.value}
            >
              {d.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-3">Sélection</span>
          <FilterChip
            href={buildHref(params, { signature: signatureOnly ? undefined : "1" })}
            active={signatureOnly}
          >
            ✶ Signature uniquement
          </FilterChip>
        </div>

        {hasFilters && (
          <div>
            <a
              href="/recettes"
              className="text-sm text-[color:var(--terracotta)] hover:text-[color:var(--terracotta-deep)] underline underline-offset-4"
            >
              Réinitialiser les filtres
            </a>
          </div>
        )}
      </div>

      {/* Résultats */}
      {recipes.length === 0 ? (
        <p className="text-center text-[color:var(--brown-mute)] py-20 italic font-serif text-lg">
          Aucune recette ne correspond à ces filtres.
        </p>
      ) : (
        <>
          <p className="text-xs text-[color:var(--brown-mute)] mb-6">
            {recipes.length} recette{recipes.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
