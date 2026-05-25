"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { publishRecipe, unpublishRecipe } from "@/lib/actions/recipes";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { SaveIndicator } from "./SaveIndicator";
import type { SaveStatus } from "@/lib/hooks/useDebouncedSave";

type Props = {
  recipeId: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  saveStatus: SaveStatus;
  savedAt: number | null;
};

export function PublishBar({ recipeId, slug, status, saveStatus, savedAt }: Props) {
  const [dialog, setDialog] = useState(false);
  const [pending, start] = useTransition();
  const isPublished = status === "PUBLISHED";

  return (
    <>
      <div className="sticky top-16 z-20 -mx-6 px-6 py-3 bg-[color:var(--cream)]/95 backdrop-blur border-b border-[color:var(--border)] flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span
            className={`btn-label px-2 py-1 text-[9px] ${
              isPublished
                ? "bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                : "bg-[color:var(--brown-mute)]/15 text-[color:var(--brown-mute)]"
            }`}
          >
            {isPublished ? "Publiée" : "Brouillon"}
          </span>
          <SaveIndicator status={saveStatus} savedAt={savedAt} />
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/recettes/${slug}`} target="_blank">
            <Button variant="outline" size="sm">
              Aperçu ↗
            </Button>
          </Link>
          {isPublished ? (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              disabled={pending}
              onClick={() => start(() => unpublishRecipe(recipeId))}
            >
              Dépublier
            </Button>
          ) : (
            <Button size="sm" type="button" onClick={() => setDialog(true)}>
              Publier
            </Button>
          )}
        </div>
      </div>

      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <p className="eyebrow">Publication</p>
        <h3 className="font-serif text-2xl mt-2">Publier cette recette ?</h3>
        <p className="mt-4 text-[color:var(--brown-soft)]">
          Elle apparaîtra immédiatement sur le site, accessible via :
        </p>
        <p className="mt-2 font-serif italic text-[color:var(--terracotta)] break-all">
          /recettes/{slug}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => setDialog(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await publishRecipe(recipeId);
                setDialog(false);
              })
            }
          >
            {pending ? "Publication…" : "Publier maintenant"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
