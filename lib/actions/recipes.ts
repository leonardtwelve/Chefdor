"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/slug";

const PLACEHOLDER_HERO = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600";

async function guard() {
  const adminId = await requireAdmin();
  if (!adminId) throw new Error("Unauthorized");
  return adminId;
}

// ─── CREATE ────────────────────────────────────────────────────────────────
export async function createRecipe() {
  await guard();
  const recipe = await db.recipe.create({
    data: {
      slug: `nouvelle-recette-${Date.now().toString(36)}`,
      title: "Nouvelle recette",
      intro: "",
      category: "tarte",
      difficulty: "FACILE",
      servings: 6,
      servingUnit: "personnes",
      prepMinutes: 0,
      cookMinutes: 0,
      restMinutes: 0,
      heroImageUrl: PLACEHOLDER_HERO,
      heroImageWidth: 1600,
      heroImageHeight: 1067,
    },
  });
  revalidatePath("/admin");
  redirect(`/admin/${recipe.id}`);
}

// ─── DELETE ────────────────────────────────────────────────────────────────
export async function deleteRecipe(id: string) {
  await guard();
  await db.recipe.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/recettes");
}

// ─── PUBLISH / UNPUBLISH ───────────────────────────────────────────────────
export async function publishRecipe(id: string) {
  await guard();
  await db.recipe.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/recettes");
  revalidatePath(`/recettes/[slug]`, "page");
}

export async function unpublishRecipe(id: string) {
  await guard();
  await db.recipe.update({
    where: { id },
    data: { status: "DRAFT" },
  });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/recettes");
}

// ─── UPDATE — champs principaux + métadonnées ──────────────────────────────
export type RecipeMainUpdate = {
  title?: string;
  subtitle?: string | null;
  intro?: string;
  slug?: string;
  category?: string;
  difficulty?: "FACILE" | "INTERMEDIAIRE" | "AVANCE";
  servings?: number;
  servingUnit?: string;
  format?: string | null;
  prepMinutes?: number;
  cookMinutes?: number;
  restMinutes?: number;
  isSignature?: boolean;
  isSeasonal?: boolean;
  heroImageUrl?: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  heroImageAlt?: string | null;
};

export async function updateRecipeMain(id: string, patch: RecipeMainUpdate) {
  await guard();

  // Auto-slug si pas fourni mais titre changé
  if (patch.title && !patch.slug) {
    const candidate = slugify(patch.title);
    const existing = await db.recipe.findFirst({
      where: { slug: candidate, NOT: { id } },
      select: { id: true },
    });
    if (!existing) patch.slug = candidate;
  }

  await db.recipe.update({ where: { id }, data: patch });
  revalidatePath(`/admin/${id}`);
  revalidatePath("/");
  revalidatePath("/recettes");
  return { ok: true, savedAt: new Date().toISOString() };
}

// ─── TAGS ──────────────────────────────────────────────────────────────────
export async function setRecipeTags(id: string, tagSlugs: string[]) {
  await guard();
  const tags = await Promise.all(
    tagSlugs.map((slug) =>
      db.tag.upsert({
        where: { slug },
        update: {},
        create: { slug, name: slug.charAt(0).toUpperCase() + slug.slice(1) },
      }),
    ),
  );
  await db.recipe.update({
    where: { id },
    data: { tags: { set: tags.map((t) => ({ id: t.id })) } },
  });
  revalidatePath(`/admin/${id}`);
  return { ok: true };
}

// ─── INGREDIENT GROUPS ─────────────────────────────────────────────────────
export async function addIngredientGroup(recipeId: string) {
  await guard();
  const last = await db.ingredientGroup.findFirst({
    where: { recipeId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const group = await db.ingredientGroup.create({
    data: {
      recipeId,
      name: "Nouveau groupe",
      order: (last?.order ?? -1) + 1,
    },
  });
  revalidatePath(`/admin/${recipeId}`);
  return group;
}

export async function updateIngredientGroup(groupId: string, name: string) {
  await guard();
  const g = await db.ingredientGroup.update({
    where: { id: groupId },
    data: { name },
    select: { recipeId: true },
  });
  revalidatePath(`/admin/${g.recipeId}`);
}

export async function deleteIngredientGroup(groupId: string) {
  await guard();
  const g = await db.ingredientGroup.delete({
    where: { id: groupId },
    select: { recipeId: true },
  });
  revalidatePath(`/admin/${g.recipeId}`);
}

export async function reorderIngredientGroup(groupId: string, direction: "up" | "down") {
  await guard();
  const current = await db.ingredientGroup.findUnique({
    where: { id: groupId },
    select: { recipeId: true, order: true },
  });
  if (!current) return;

  const neighbor = await db.ingredientGroup.findFirst({
    where: {
      recipeId: current.recipeId,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.ingredientGroup.update({ where: { id: groupId }, data: { order: neighbor.order } }),
    db.ingredientGroup.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);
  revalidatePath(`/admin/${current.recipeId}`);
}

// ─── INGREDIENTS ───────────────────────────────────────────────────────────
export async function addIngredient(groupId: string) {
  await guard();
  const last = await db.ingredient.findFirst({
    where: { groupId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const ing = await db.ingredient.create({
    data: {
      groupId,
      amount: 0,
      unit: "g",
      name: "",
      order: (last?.order ?? -1) + 1,
    },
  });
  const g = await db.ingredientGroup.findUnique({
    where: { id: groupId },
    select: { recipeId: true },
  });
  if (g) revalidatePath(`/admin/${g.recipeId}`);
  return ing;
}

export type IngredientPatch = {
  amount?: number;
  unit?: string;
  name?: string;
  note?: string | null;
  isScalable?: boolean;
};

export async function updateIngredient(id: string, patch: IngredientPatch) {
  await guard();
  const i = await db.ingredient.update({
    where: { id },
    data: patch,
    select: { group: { select: { recipeId: true } } },
  });
  revalidatePath(`/admin/${i.group.recipeId}`);
}

export async function deleteIngredient(id: string) {
  await guard();
  const i = await db.ingredient.delete({
    where: { id },
    select: { group: { select: { recipeId: true } } },
  });
  revalidatePath(`/admin/${i.group.recipeId}`);
}

export async function reorderIngredient(id: string, direction: "up" | "down") {
  await guard();
  const current = await db.ingredient.findUnique({
    where: { id },
    select: { groupId: true, order: true, group: { select: { recipeId: true } } },
  });
  if (!current) return;

  const neighbor = await db.ingredient.findFirst({
    where: {
      groupId: current.groupId,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.ingredient.update({ where: { id }, data: { order: neighbor.order } }),
    db.ingredient.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);
  revalidatePath(`/admin/${current.group.recipeId}`);
}

// ─── STEPS ─────────────────────────────────────────────────────────────────
export async function addStep(recipeId: string) {
  await guard();
  const last = await db.step.findFirst({
    where: { recipeId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const step = await db.step.create({
    data: {
      recipeId,
      order: (last?.order ?? 0) + 1,
      title: "",
      content: "",
    },
  });
  revalidatePath(`/admin/${recipeId}`);
  return step;
}

export type StepPatch = {
  title?: string;
  content?: string;
  tip?: string | null;
};

export async function updateStep(id: string, patch: StepPatch) {
  await guard();
  const s = await db.step.update({
    where: { id },
    data: patch,
    select: { recipeId: true },
  });
  revalidatePath(`/admin/${s.recipeId}`);
}

export async function deleteStep(id: string) {
  await guard();
  const s = await db.step.delete({
    where: { id },
    select: { recipeId: true },
  });
  // Re-numérotation : on recompacte les `order` pour éviter les trous.
  const remaining = await db.step.findMany({
    where: { recipeId: s.recipeId },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  await db.$transaction(
    remaining.map((step, idx) =>
      db.step.update({ where: { id: step.id }, data: { order: idx + 1 } }),
    ),
  );
  revalidatePath(`/admin/${s.recipeId}`);
}

export async function reorderStep(id: string, direction: "up" | "down") {
  await guard();
  const current = await db.step.findUnique({
    where: { id },
    select: { recipeId: true, order: true },
  });
  if (!current) return;

  const neighbor = await db.step.findFirst({
    where: {
      recipeId: current.recipeId,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.step.update({ where: { id }, data: { order: neighbor.order } }),
    db.step.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);
  revalidatePath(`/admin/${current.recipeId}`);
}

// ─── STEP PHOTOS ───────────────────────────────────────────────────────────
export async function addStepPhoto(stepId: string, url: string, width = 1200, height = 800) {
  await guard();
  const last = await db.stepPhoto.findFirst({
    where: { stepId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const photo = await db.stepPhoto.create({
    data: {
      stepId,
      url,
      width,
      height,
      order: (last?.order ?? -1) + 1,
    },
  });
  const s = await db.step.findUnique({ where: { id: stepId }, select: { recipeId: true } });
  if (s) revalidatePath(`/admin/${s.recipeId}`);
  return photo;
}

export async function deleteStepPhoto(photoId: string) {
  await guard();
  const p = await db.stepPhoto.delete({
    where: { id: photoId },
    select: { step: { select: { recipeId: true } } },
  });
  revalidatePath(`/admin/${p.step.recipeId}`);
}
