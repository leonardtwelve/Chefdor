"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import {
  addIngredient,
  deleteIngredientGroup,
  reorderIngredientGroup,
  updateIngredientGroup,
} from "@/lib/actions/recipes";
import { useDebouncedSave } from "@/lib/hooks/useDebouncedSave";
import { IngredientRow } from "./IngredientRow";

type Ingredient = {
  id: string;
  amount: number;
  unit: string;
  name: string;
  note: string | null;
  isScalable: boolean;
  order: number;
};

type Group = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

type Props = {
  group: Group;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function IngredientGroupCard({ group, canMoveUp, canMoveDown }: Props) {
  const [name, setName] = useState(group.name);
  const [, start] = useTransition();

  useDebouncedSave({
    value: name,
    save: (v) => updateIngredientGroup(group.id, v),
  });

  return (
    <section className="border border-[color:var(--border)] bg-[color:var(--cream-surface)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du groupe (ex : Pâte sablée)"
          className="flex-1 font-serif text-xl text-brown bg-transparent border-b border-transparent focus:border-[color:var(--terracotta)] focus:outline-none py-1"
        />
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={() => start(() => reorderIngredientGroup(group.id, "up"))}
          className="text-[color:var(--brown-mute)] hover:text-brown disabled:opacity-20 p-1"
          aria-label="Monter le groupe"
        >
          <ArrowUp size={16} />
        </button>
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={() => start(() => reorderIngredientGroup(group.id, "down"))}
          className="text-[color:var(--brown-mute)] hover:text-brown disabled:opacity-20 p-1"
          aria-label="Descendre le groupe"
        >
          <ArrowDown size={16} />
        </button>
        <button
          type="button"
          onClick={() => start(() => deleteIngredientGroup(group.id))}
          className="text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)] p-1"
          aria-label="Supprimer le groupe"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {group.ingredients.length > 0 && (
        <div className="grid grid-cols-[60px_80px_1fr_1fr_auto_auto] gap-2 px-1 mb-1 text-[10px] uppercase tracking-wider text-[color:var(--brown-mute)]">
          <span>Qté</span>
          <span>Unité</span>
          <span>Ingrédient</span>
          <span>Note</span>
          <span></span>
          <span></span>
        </div>
      )}

      <div className="space-y-1">
        {group.ingredients.map((ing, idx) => (
          <IngredientRow
            key={ing.id}
            ingredient={ing}
            canMoveUp={idx > 0}
            canMoveDown={idx < group.ingredients.length - 1}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => start(async () => { await addIngredient(group.id); })}
        className="mt-3 btn-label text-[color:var(--terracotta)] hover:text-[color:var(--terracotta-deep)] flex items-center gap-1.5"
      >
        <Plus size={14} /> Ajouter un ingrédient
      </button>
    </section>
  );
}
