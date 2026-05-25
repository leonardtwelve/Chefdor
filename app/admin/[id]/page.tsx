import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { RecipeEditor, type EditorRecipe } from "@/components/admin/RecipeEditor";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecettePage({ params }: Props) {
  const { id } = await params;

  const recipe = await db.recipe.findUnique({
    where: { id },
    include: {
      ingredientGroups: {
        orderBy: { order: "asc" },
        include: { ingredients: { orderBy: { order: "asc" } } },
      },
      steps: {
        orderBy: { order: "asc" },
        include: { photos: { orderBy: { order: "asc" } } },
      },
      tags: { select: { slug: true, name: true } },
    },
  });

  if (!recipe) notFound();

  // Serialize les données pour le client (Dates → strings n'est pas utile ici car
  // RecipeEditor n'utilise pas les Dates ; on passe le payload tel quel via JSON-safe types).
  const initial: EditorRecipe = {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    subtitle: recipe.subtitle,
    intro: recipe.intro,
    status: recipe.status,
    category: recipe.category,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    servingUnit: recipe.servingUnit,
    format: recipe.format,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    restMinutes: recipe.restMinutes,
    isSignature: recipe.isSignature,
    isSeasonal: recipe.isSeasonal,
    heroImageUrl: recipe.heroImageUrl,
    heroImageWidth: recipe.heroImageWidth,
    heroImageHeight: recipe.heroImageHeight,
    heroImageAlt: recipe.heroImageAlt,
    tags: recipe.tags,
    ingredientGroups: recipe.ingredientGroups.map((g) => ({
      id: g.id,
      name: g.name,
      order: g.order,
      ingredients: g.ingredients.map((i) => ({
        id: i.id,
        amount: i.amount,
        unit: i.unit,
        name: i.name,
        note: i.note,
        isScalable: i.isScalable,
        order: i.order,
      })),
    })),
    steps: recipe.steps.map((s) => ({
      id: s.id,
      order: s.order,
      title: s.title,
      content: s.content,
      tip: s.tip,
      photos: s.photos.map((p) => ({ id: p.id, url: p.url })),
    })),
  };

  return (
    <div>
      <Link
        href="/admin"
        className="btn-label text-[color:var(--brown-soft)] hover:text-[color:var(--terracotta)] mb-6 inline-block"
      >
        ← Mes recettes
      </Link>
      <RecipeEditor recipe={initial} />
    </div>
  );
}
