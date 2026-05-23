export type CategorySlug = "tarte" | "entremet" | "gateau" | "petit-format";

export const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "tarte", label: "Tartes" },
  { slug: "entremet", label: "Entremets" },
  { slug: "gateau", label: "Gâteaux" },
  { slug: "petit-format", label: "Petits formats" },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
