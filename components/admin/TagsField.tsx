"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { setRecipeTags } from "@/lib/actions/recipes";
import { Input } from "@/components/ui/input";

type Tag = { slug: string; name: string };

type Props = {
  recipeId: string;
  initialTags: Tag[];
};

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TagsField({ recipeId, initialTags }: Props) {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState("");
  const [, start] = useTransition();

  const commit = (next: Tag[]) => {
    setTags(next);
    start(async () => { await setRecipeTags(recipeId, next.map((t) => t.slug)); });
  };

  const addTag = (raw: string) => {
    const slug = toSlug(raw);
    if (!slug || tags.some((t) => t.slug === slug)) return;
    commit([...tags, { slug, name: raw.trim() }]);
  };

  const removeTag = (slug: string) => commit(tags.filter((t) => t.slug !== slug));

  return (
    <div>
      <p className="eyebrow mb-3">Étiquettes</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag.slug}
            className="inline-flex items-center gap-1.5 px-3 py-1 border border-[color:var(--border)] bg-[color:var(--cream-surface)] text-sm text-brown"
          >
            #{tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.slug)}
              className="text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)]"
              aria-label={`Retirer ${tag.name}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (input.trim()) {
              addTag(input);
              setInput("");
            }
          }
        }}
        placeholder="Ajouter une étiquette (Entrée pour valider)"
      />
    </div>
  );
}
