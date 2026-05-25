"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import {
  deleteIngredient,
  reorderIngredient,
  updateIngredient,
  type IngredientPatch,
} from "@/lib/actions/recipes";
import { useDebouncedSave } from "@/lib/hooks/useDebouncedSave";

type Ingredient = {
  id: string;
  amount: number;
  unit: string;
  name: string;
  note: string | null;
  isScalable: boolean;
};

type Props = {
  ingredient: Ingredient;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function IngredientRow({ ingredient, canMoveUp, canMoveDown }: Props) {
  const [state, setState] = useState({
    amount: ingredient.amount,
    unit: ingredient.unit,
    name: ingredient.name,
    note: ingredient.note ?? "",
    isScalable: ingredient.isScalable,
  });
  const [, start] = useTransition();

  useDebouncedSave({
    value: state,
    save: async (v) => {
      const patch: IngredientPatch = {
        amount: v.amount,
        unit: v.unit,
        name: v.name,
        note: v.note || null,
        isScalable: v.isScalable,
      };
      await updateIngredient(ingredient.id, patch);
    },
  });

  return (
    <div className="grid grid-cols-[60px_80px_1fr_1fr_auto_auto] gap-2 items-center py-1.5">
      <input
        type="number"
        step="0.01"
        value={state.amount}
        onChange={(e) => setState({ ...state, amount: parseFloat(e.target.value) || 0 })}
        className="h-9 px-2 text-sm bg-[color:var(--cream-surface)] border border-[color:var(--border)] focus:outline-none focus:border-[color:var(--terracotta)] tabular-nums"
      />
      <input
        type="text"
        value={state.unit}
        onChange={(e) => setState({ ...state, unit: e.target.value })}
        placeholder="g"
        className="h-9 px-2 text-sm bg-[color:var(--cream-surface)] border border-[color:var(--border)] focus:outline-none focus:border-[color:var(--terracotta)]"
      />
      <input
        type="text"
        value={state.name}
        onChange={(e) => setState({ ...state, name: e.target.value })}
        placeholder="farine T55"
        className="h-9 px-2 text-sm bg-[color:var(--cream-surface)] border border-[color:var(--border)] focus:outline-none focus:border-[color:var(--terracotta)]"
      />
      <input
        type="text"
        value={state.note}
        onChange={(e) => setState({ ...state, note: e.target.value })}
        placeholder="tamisée (optionnel)"
        className="h-9 px-2 text-sm bg-[color:var(--cream-surface)] border border-[color:var(--border)] focus:outline-none focus:border-[color:var(--terracotta)] italic text-[color:var(--brown-mute)]"
      />
      <label
        className="flex items-center gap-1 text-[10px] text-[color:var(--brown-mute)] cursor-pointer select-none"
        title="Décoche pour ne pas multiplier la quantité avec les portions (œufs, pincée…)"
      >
        <input
          type="checkbox"
          checked={state.isScalable}
          onChange={(e) => setState({ ...state, isScalable: e.target.checked })}
        />
        ×N
      </label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={() => start(() => reorderIngredient(ingredient.id, "up"))}
          className="text-[color:var(--brown-mute)] hover:text-brown disabled:opacity-20 p-1"
          aria-label="Monter"
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={() => start(() => reorderIngredient(ingredient.id, "down"))}
          className="text-[color:var(--brown-mute)] hover:text-brown disabled:opacity-20 p-1"
          aria-label="Descendre"
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={() => start(() => deleteIngredient(ingredient.id))}
          className="text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)] p-1"
          aria-label="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
