"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/lib/actions/recipes";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = { id: string; title: string };

export function DeleteRecipeButton({ id, title }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, start] = useTransition();

  const canDelete = confirmText.trim() === title.trim();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)] transition-colors"
        aria-label={`Supprimer ${title}`}
      >
        <Trash2 size={16} />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <p className="eyebrow">Suppression</p>
        <h3 className="font-serif text-2xl mt-2">Supprimer cette recette ?</h3>
        <p className="mt-4 text-[color:var(--brown-soft)]">
          Cette action est <strong>irréversible</strong>. Pour confirmer, tape le titre exact :
        </p>
        <p className="mt-2 font-serif italic text-[color:var(--terracotta)]">{title}</p>

        <Input
          className="mt-4"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Tape le titre ici"
          autoFocus
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            disabled={!canDelete || pending}
            onClick={() =>
              start(async () => {
                await deleteRecipe(id);
                setOpen(false);
              })
            }
            className="!bg-[color:var(--terracotta-deep)] hover:!bg-[color:var(--brown)]"
          >
            {pending ? "Suppression…" : "Supprimer définitivement"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
