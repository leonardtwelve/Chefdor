import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/categories";
import { RecipeMeta } from "@/components/marketing/RecipeMeta";
import { IngredientsPanel } from "@/components/marketing/IngredientsPanel";
import { IngredientsMobileTrigger } from "@/components/marketing/IngredientsMobileTrigger";
import { StepBlock } from "@/components/marketing/StepBlock";

type Props = { params: Promise<{ slug: string }> };

async function fetchRecipe(slug: string) {
  return db.recipe.findUnique({
    where: { slug },
    include: {
      ingredientGroups: {
        orderBy: { order: "asc" },
        include: { ingredients: { orderBy: { order: "asc" } } },
      },
      steps: {
        orderBy: { order: "asc" },
        include: { photos: { orderBy: { order: "asc" } } },
      },
      tags: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await db.recipe.findUnique({
    where: { slug },
    select: { title: true, intro: true, heroImageUrl: true },
  });
  if (!recipe) return { title: "Recette introuvable" };
  return {
    title: recipe.title,
    description: recipe.intro,
    openGraph: { title: recipe.title, description: recipe.intro, images: [recipe.heroImageUrl] },
  };
}

export default async function RecettePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await fetchRecipe(slug);
  if (!recipe || recipe.status !== "PUBLISHED") notFound();

  const allStepPhotos = recipe.steps.flatMap((s) => s.photos);

  return (
    <article className="pb-24">
      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 text-center">
        <p className="eyebrow">{categoryLabel(recipe.category)}</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-[1.02]">
          {recipe.title}
        </h1>
        {recipe.subtitle && (
          <p className="mt-4 font-serif italic text-2xl text-[color:var(--terracotta)]">
            {recipe.subtitle}
          </p>
        )}
        <p className="mt-8 text-lg text-[color:var(--brown-soft)] font-serif leading-relaxed max-w-2xl mx-auto">
          {recipe.intro}
        </p>
      </header>

      {/* Photo héro */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div
          className="relative w-full overflow-hidden bg-[color:var(--rose)]"
          style={{ aspectRatio: `${recipe.heroImageWidth} / ${recipe.heroImageHeight}` }}
        >
          <Image
            src={recipe.heroImageUrl}
            alt={recipe.heroImageAlt ?? recipe.title}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Métadonnées */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <RecipeMeta
          prepMinutes={recipe.prepMinutes}
          cookMinutes={recipe.cookMinutes}
          restMinutes={recipe.restMinutes}
          difficulty={recipe.difficulty}
          format={recipe.format}
        />
      </div>

      {/* Ingrédients (sticky desktop) + Étapes */}
      <div className="max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-[320px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <IngredientsPanel
              groups={recipe.ingredientGroups}
              baseServings={recipe.servings}
              servingUnit={recipe.servingUnit}
            />
          </div>
        </aside>

        <section className="max-w-3xl">
          <p className="eyebrow">Étape par étape</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-12">
            Le <span className="accent">déroulé</span>
          </h2>
          <div className="space-y-14">
            {recipe.steps.map((step) => (
              <StepBlock key={step.id} step={step} />
            ))}
          </div>
        </section>
      </div>

      {/* Déclencheur drawer mobile */}
      <IngredientsMobileTrigger
        groups={recipe.ingredientGroups}
        baseServings={recipe.servings}
        servingUnit={recipe.servingUnit}
      />

      {/* Galerie photos d'étapes */}
      {allStepPhotos.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 mt-24">
          <p className="eyebrow">Pas à pas</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-10">
            En <span className="accent">images</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allStepPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-[4/3] overflow-hidden bg-[color:var(--rose)]"
              >
                <Image
                  src={photo.url}
                  alt={photo.alt ?? ""}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
