import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CategoryFilter } from "@/components/marketing/CategoryFilter";
import { RecipeCard } from "@/components/marketing/RecipeCard";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams;

  const recipes = await db.recipe.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category } : {}),
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

  return (
    <>
      {/* Héro */}
      <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-5xl mx-auto text-center">
        <p className="eyebrow">Le carnet</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-6 leading-[1.02]">
          Des recettes <span className="accent">qu&apos;on refait</span>,
          <br />
          parce qu&apos;elles marchent.
        </h1>
        <p className="mt-8 text-lg md:text-xl text-[color:var(--brown-soft)] max-w-2xl mx-auto font-serif italic">
          Un carnet de pâtisserie écrit à la main, photographié avec soin,
          partagé sans détour.
        </p>
        <div className="mt-10 flex justify-center">
          <Link href="/recettes">
            <Button>Voir toutes les recettes</Button>
          </Link>
        </div>
      </section>

      {/* Grille de recettes */}
      <section className="px-6 max-w-6xl mx-auto pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow">Les recettes</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">
              À <span className="accent">parcourir</span>
            </h2>
          </div>
          <CategoryFilter basePath="/" current={category} />
        </div>

        {recipes.length === 0 ? (
          <p className="text-center text-[color:var(--brown-mute)] py-20 italic font-serif text-lg">
            Pas encore de recette dans cette catégorie.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      {/* À propos d'elle */}
      <section className="bg-[color:var(--cream-surface)] border-y border-[color:var(--border)] py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 items-center">
          <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--rose)]">
            <Image
              src="/maele.jpg"
              alt="Maële dans sa cuisine"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">À propos d&apos;elle</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 leading-tight">
              Une pâtissière, <span className="accent">un carnet</span>
            </h2>
            <p className="mt-5 text-[color:var(--brown-soft)] font-serif text-lg leading-relaxed">
              Elle cuisine pour faire plaisir. Ce site, c&apos;est sa manière de
              transmettre ses recettes — pas à pas, comme elle les fait vraiment.
            </p>
            <div className="mt-6">
              <Link href="/a-propos">
                <Button variant="outline">En lire plus</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
