import Link from "next/link";
import Image from "next/image";
import { ChefHat } from "@/components/brand/ChefHat";
import { categoryLabel } from "@/lib/categories";
import { formatDuration } from "@/lib/format";

type Recipe = {
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string;
  category: string;
  servings: number;
  servingUnit: string;
  prepMinutes: number;
  cookMinutes: number;
  isSignature: boolean;
  heroImageUrl: string;
  heroImageWidth: number;
  heroImageHeight: number;
  heroImageAlt: string | null;
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const total = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <Link
      href={`/recettes/${recipe.slug}`}
      className="group flex flex-col gap-4"
      aria-label={recipe.title}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--rose)]">
        <Image
          src={recipe.heroImageUrl}
          alt={recipe.heroImageAlt ?? recipe.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {recipe.isSignature && (
          <div className="absolute top-3 right-3 bg-[color:var(--cream)]/90 backdrop-blur-sm p-2 rounded-full">
            <ChefHat size={18} variant="filled" />
          </div>
        )}
      </div>

      <div>
        <p className="eyebrow">{categoryLabel(recipe.category)}</p>
        <h3 className="font-serif text-2xl mt-2 text-brown group-hover:text-[color:var(--terracotta)] transition-colors">
          {recipe.title}
        </h3>
        {recipe.subtitle && (
          <p className="font-serif italic text-[color:var(--terracotta)] text-base mt-1">
            {recipe.subtitle}
          </p>
        )}
        <p className="text-sm text-[color:var(--brown-soft)] mt-3 line-clamp-2">
          {recipe.intro}
        </p>
        <p className="text-xs text-[color:var(--brown-mute)] mt-3">
          {formatDuration(total)} · {recipe.servings} {recipe.servingUnit}
        </p>
      </div>
    </Link>
  );
}
