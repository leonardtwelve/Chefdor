"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { scaleAmount, formatAmount } from "@/lib/scale";

type Ingredient = {
  id: string;
  amount: number;
  unit: string;
  name: string;
  note: string | null;
  isScalable: boolean;
};

type IngredientGroup = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

type Props = {
  groups: IngredientGroup[];
  baseServings: number;
  servingUnit: string;
};

export function IngredientsPanel({ groups, baseServings, servingUnit }: Props) {
  const [servings, setServings] = useState(baseServings);

  const dec = () => setServings((s) => Math.max(1, s - 1));
  const inc = () => setServings((s) => Math.min(99, s + 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="eyebrow">Ingrédients</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={dec}
            className="w-9 h-9 border border-[color:var(--border)] flex items-center justify-center text-brown hover:border-brown disabled:opacity-30"
            disabled={servings <= 1}
            aria-label="Diminuer les portions"
          >
            <Minus size={16} />
          </button>
          <span className="font-serif text-xl min-w-[90px] text-center text-brown">
            {servings} {servingUnit}
          </span>
          <button
            type="button"
            onClick={inc}
            className="w-9 h-9 border border-[color:var(--border)] flex items-center justify-center text-brown hover:border-brown disabled:opacity-30"
            disabled={servings >= 99}
            aria-label="Augmenter les portions"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="font-serif text-2xl text-brown mb-4">{group.name}</h3>
            <ul className="space-y-2">
              {group.ingredients.map((ing) => {
                const scaled = scaleAmount(ing.amount, baseServings, servings, ing.isScalable);
                return (
                  <li
                    key={ing.id}
                    className="flex items-baseline gap-3 py-1.5 border-b border-[color:var(--border)]/40"
                  >
                    <span className="font-serif text-[color:var(--terracotta)] text-lg min-w-[5rem] tabular-nums">
                      {formatAmount(scaled)} {ing.unit}
                    </span>
                    <span className="text-brown flex-1">
                      {ing.name}
                      {ing.note && (
                        <span className="text-[color:var(--brown-mute)] italic text-sm">
                          {" "}
                          · {ing.note}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
