import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/categories";
import { NewRecipeButton } from "@/components/admin/NewRecipeButton";
import { DeleteRecipeButton } from "@/components/admin/DeleteRecipeButton";
import { FilterChip } from "@/components/marketing/FilterChip";

type Params = { status?: "DRAFT" | "PUBLISHED" };

function buildHref(patch: Partial<Params>): string {
  const sp = new URLSearchParams();
  if (patch.status) sp.set("status", patch.status);
  const qs = sp.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

type Props = { searchParams: Promise<Params> };

export default async function AdminHome({ searchParams }: Props) {
  const params = await searchParams;

  const recipes = await db.recipe.findMany({
    where: params.status ? { status: params.status } : {},
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      status: true,
      isSignature: true,
      heroImageUrl: true,
      updatedAt: true,
    },
  });

  const counts = {
    all: await db.recipe.count(),
    draft: await db.recipe.count({ where: { status: "DRAFT" } }),
    published: await db.recipe.count({ where: { status: "PUBLISHED" } }),
  };

  return (
    <div>
      <p className="eyebrow">Tableau de bord</p>
      <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h1 className="font-serif text-5xl md:text-6xl">
          Mes <span className="accent">recettes</span>
        </h1>
        <NewRecipeButton />
      </div>

      {/* Filtres statut */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <FilterChip href={buildHref({})} active={!params.status}>
          Tout ({counts.all})
        </FilterChip>
        <FilterChip href={buildHref({ status: "PUBLISHED" })} active={params.status === "PUBLISHED"}>
          Publiées ({counts.published})
        </FilterChip>
        <FilterChip href={buildHref({ status: "DRAFT" })} active={params.status === "DRAFT"}>
          Brouillons ({counts.draft})
        </FilterChip>
      </div>

      {/* Liste */}
      {recipes.length === 0 ? (
        <div className="mt-16 py-20 text-center border border-dashed border-[color:var(--border)]">
          <p className="font-serif italic text-[color:var(--brown-mute)] text-lg">
            Aucune recette pour le moment.
          </p>
          <p className="text-sm text-[color:var(--brown-mute)] mt-2">
            Clique sur « + Nouvelle recette » pour commencer.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="flex items-center gap-5 py-4">
              <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-[color:var(--rose)]">
                <Image
                  src={recipe.heroImageUrl}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl text-brown truncate">
                    {recipe.title}
                    {recipe.isSignature && (
                      <span className="ml-2 text-[color:var(--gold)]">✶</span>
                    )}
                  </h2>
                  <span
                    className={`btn-label px-2 py-0.5 text-[9px] ${
                      recipe.status === "PUBLISHED"
                        ? "bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                        : "bg-[color:var(--brown-mute)]/15 text-[color:var(--brown-mute)]"
                    }`}
                  >
                    {recipe.status === "PUBLISHED" ? "Publiée" : "Brouillon"}
                  </span>
                </div>
                <p className="text-xs text-[color:var(--brown-mute)] mt-1">
                  {categoryLabel(recipe.category)} · modifiée le{" "}
                  {dateFormatter.format(recipe.updatedAt)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/${recipe.id}`}
                  className="btn-label text-brown hover:text-[color:var(--terracotta)] flex items-center gap-2"
                >
                  <Pencil size={14} />
                  Éditer
                </Link>
                <DeleteRecipeButton id={recipe.id} title={recipe.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
