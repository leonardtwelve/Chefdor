"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  addIngredientGroup,
  addStep,
  updateRecipeMain,
  type RecipeMainUpdate,
} from "@/lib/actions/recipes";
import { useDebouncedSave } from "@/lib/hooks/useDebouncedSave";
import { CATEGORIES } from "@/lib/categories";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { HeroImageField } from "./HeroImageField";
import { TagsField } from "./TagsField";
import { IngredientGroupCard } from "./IngredientGroupCard";
import { StepCard } from "./StepCard";
import { PublishBar } from "./PublishBar";

type Tag = { slug: string; name: string };
type Ingredient = {
  id: string;
  amount: number;
  unit: string;
  name: string;
  note: string | null;
  isScalable: boolean;
  order: number;
};
type Group = { id: string; name: string; order: number; ingredients: Ingredient[] };
type Step = {
  id: string;
  order: number;
  title: string;
  content: string;
  tip: string | null;
  photos: { id: string; url: string }[];
};

export type EditorRecipe = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string;
  status: "DRAFT" | "PUBLISHED";
  category: string;
  difficulty: "FACILE" | "INTERMEDIAIRE" | "AVANCE";
  servings: number;
  servingUnit: string;
  format: string | null;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number;
  isSignature: boolean;
  isSeasonal: boolean;
  heroImageUrl: string;
  heroImageWidth: number;
  heroImageHeight: number;
  heroImageAlt: string | null;
  tags: Tag[];
  ingredientGroups: Group[];
  steps: Step[];
};

const DIFFICULTIES: { value: "FACILE" | "INTERMEDIAIRE" | "AVANCE"; label: string }[] = [
  { value: "FACILE", label: "Facile" },
  { value: "INTERMEDIAIRE", label: "Intermédiaire" },
  { value: "AVANCE", label: "Avancé" },
];

export function RecipeEditor({ recipe }: { recipe: EditorRecipe }) {
  const [main, setMain] = useState({
    title: recipe.title,
    subtitle: recipe.subtitle ?? "",
    intro: recipe.intro,
    slug: recipe.slug,
    category: recipe.category,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    servingUnit: recipe.servingUnit,
    format: recipe.format ?? "",
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    restMinutes: recipe.restMinutes,
    isSignature: recipe.isSignature,
    isSeasonal: recipe.isSeasonal,
    heroImageUrl: recipe.heroImageUrl,
    heroImageWidth: recipe.heroImageWidth,
    heroImageHeight: recipe.heroImageHeight,
    heroImageAlt: recipe.heroImageAlt ?? "",
  });

  const [, start] = useTransition();

  const { status, savedAt } = useDebouncedSave({
    value: main,
    save: async (v) => {
      const patch: RecipeMainUpdate = {
        title: v.title,
        subtitle: v.subtitle || null,
        intro: v.intro,
        slug: v.slug,
        category: v.category,
        difficulty: v.difficulty,
        servings: v.servings,
        servingUnit: v.servingUnit,
        format: v.format || null,
        prepMinutes: v.prepMinutes,
        cookMinutes: v.cookMinutes,
        restMinutes: v.restMinutes,
        isSignature: v.isSignature,
        isSeasonal: v.isSeasonal,
        heroImageUrl: v.heroImageUrl,
        heroImageWidth: v.heroImageWidth,
        heroImageHeight: v.heroImageHeight,
        heroImageAlt: v.heroImageAlt || null,
      };
      await updateRecipeMain(recipe.id, patch);
    },
  });

  return (
    <div>
      <PublishBar
        recipeId={recipe.id}
        slug={main.slug}
        status={recipe.status}
        saveStatus={status}
        savedAt={savedAt}
      />

      {/* Layout 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-10 min-w-0">
          {/* ── Titre & intro ─────────────────────────────────────────── */}
          <section>
            <p className="eyebrow mb-3">Titre & introduction</p>
            <Input
              value={main.title}
              onChange={(e) => setMain({ ...main, title: e.target.value })}
              placeholder="Titre de la recette"
              className="text-2xl font-serif h-14"
            />
            <Input
              value={main.subtitle}
              onChange={(e) => setMain({ ...main, subtitle: e.target.value })}
              placeholder="Sous-titre (optionnel, en italique sur la fiche)"
              className="mt-2 font-serif italic"
            />
            <Textarea
              value={main.intro}
              onChange={(e) => setMain({ ...main, intro: e.target.value })}
              placeholder="L'intro éditoriale : pourquoi cette recette, d'où elle vient, quand la faire…"
              className="mt-2 min-h-[100px] font-serif"
            />
            <label className="block mt-3">
              <span className="text-xs text-[color:var(--brown-mute)]">
                URL de la recette (générée auto, modifiable)
              </span>
              <div className="flex items-center mt-1">
                <span className="text-xs text-[color:var(--brown-mute)] px-2 py-2 bg-[color:var(--rose)]/30 border border-r-0 border-[color:var(--border)]">
                  /recettes/
                </span>
                <Input
                  value={main.slug}
                  onChange={(e) => setMain({ ...main, slug: e.target.value })}
                  className="text-xs"
                />
              </div>
            </label>
          </section>

          {/* ── Métadonnées ───────────────────────────────────────────── */}
          <section>
            <p className="eyebrow mb-3">Caractéristiques</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-[color:var(--brown-mute)]">Catégorie</span>
                <Select
                  value={main.category}
                  onChange={(e) => setMain({ ...main, category: e.target.value })}
                  className="mt-1"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>

              <div>
                <span className="text-xs text-[color:var(--brown-mute)]">Difficulté</span>
                <div className="mt-1 grid grid-cols-3 border border-[color:var(--border)] bg-[color:var(--cream-surface)]">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setMain({ ...main, difficulty: d.value })}
                      className={`btn-label py-2.5 transition-colors ${
                        main.difficulty === d.value
                          ? "bg-brown text-cream"
                          : "text-[color:var(--brown-soft)] hover:bg-[color:var(--rose)]/40"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-xs text-[color:var(--brown-mute)]">Portions</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    min={1}
                    value={main.servings}
                    onChange={(e) =>
                      setMain({ ...main, servings: parseInt(e.target.value, 10) || 1 })
                    }
                  />
                  <Input
                    value={main.servingUnit}
                    onChange={(e) => setMain({ ...main, servingUnit: e.target.value })}
                    placeholder="personnes / parts / pièces"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs text-[color:var(--brown-mute)]">Format</span>
                <Input
                  value={main.format}
                  onChange={(e) => setMain({ ...main, format: e.target.value })}
                  placeholder="ex : Tarte 24 cm"
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-xs text-[color:var(--brown-mute)]">Préparation (min)</span>
                <Input
                  type="number"
                  min={0}
                  value={main.prepMinutes}
                  onChange={(e) =>
                    setMain({ ...main, prepMinutes: parseInt(e.target.value, 10) || 0 })
                  }
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-xs text-[color:var(--brown-mute)]">Cuisson (min)</span>
                <Input
                  type="number"
                  min={0}
                  value={main.cookMinutes}
                  onChange={(e) =>
                    setMain({ ...main, cookMinutes: parseInt(e.target.value, 10) || 0 })
                  }
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-xs text-[color:var(--brown-mute)]">Repos (min)</span>
                <Input
                  type="number"
                  min={0}
                  value={main.restMinutes}
                  onChange={(e) =>
                    setMain({ ...main, restMinutes: parseInt(e.target.value, 10) || 0 })
                  }
                  className="mt-1"
                />
              </label>
            </div>

            {/* Toggles */}
            <div className="mt-5 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={main.isSignature}
                  onChange={(e) => setMain({ ...main, isSignature: e.target.checked })}
                />
                <span className="text-sm text-brown">
                  ✶ Recette signature{" "}
                  <span className="text-[color:var(--brown-mute)] italic">(toque dorée)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={main.isSeasonal}
                  onChange={(e) => setMain({ ...main, isSeasonal: e.target.checked })}
                />
                <span className="text-sm text-brown">🍃 De saison</span>
              </label>
            </div>
          </section>

          {/* ── Ingrédients ───────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="eyebrow">Ingrédients</p>
                <h2 className="font-serif text-2xl text-brown mt-1">Par groupes</h2>
              </div>
              <button
                type="button"
                onClick={() => start(async () => { await addIngredientGroup(recipe.id); })}
                className="btn-label px-4 py-2 border border-[color:var(--border)] hover:border-brown flex items-center gap-1.5"
              >
                <Plus size={14} /> Ajouter un groupe
              </button>
            </div>

            {recipe.ingredientGroups.length === 0 ? (
              <p className="py-10 text-center italic font-serif text-[color:var(--brown-mute)] border border-dashed border-[color:var(--border)]">
                Aucun groupe pour l&apos;instant. Crée un premier groupe (ex : « Pâte sablée »).
              </p>
            ) : (
              <div className="space-y-4">
                {recipe.ingredientGroups.map((group, idx) => (
                  <IngredientGroupCard
                    key={group.id}
                    group={group}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < recipe.ingredientGroups.length - 1}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Étapes ────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="eyebrow">Étapes</p>
                <h2 className="font-serif text-2xl text-brown mt-1">Le déroulé</h2>
              </div>
              <button
                type="button"
                onClick={() => start(async () => { await addStep(recipe.id); })}
                className="btn-label px-4 py-2 border border-[color:var(--border)] hover:border-brown flex items-center gap-1.5"
              >
                <Plus size={14} /> Ajouter une étape
              </button>
            </div>

            {recipe.steps.length === 0 ? (
              <p className="py-10 text-center italic font-serif text-[color:var(--brown-mute)] border border-dashed border-[color:var(--border)]">
                Pas encore d&apos;étape. Ajoute la première.
              </p>
            ) : (
              <div className="space-y-4">
                {recipe.steps.map((step, idx) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < recipe.steps.length - 1}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Sidebar droite ──────────────────────────────────────────── */}
        <aside className="space-y-8">
          <HeroImageField
            url={main.heroImageUrl}
            alt={main.heroImageAlt || null}
            onChange={(p) =>
              setMain({
                ...main,
                heroImageUrl: p.heroImageUrl ?? main.heroImageUrl,
                heroImageWidth: p.heroImageWidth ?? main.heroImageWidth,
                heroImageHeight: p.heroImageHeight ?? main.heroImageHeight,
                heroImageAlt:
                  p.heroImageAlt !== undefined ? (p.heroImageAlt ?? "") : main.heroImageAlt,
              })
            }
          />
          <TagsField recipeId={recipe.id} initialTags={recipe.tags} />
        </aside>
      </div>
    </div>
  );
}
