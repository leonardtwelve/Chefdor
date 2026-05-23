"use client";

import { useState } from "react";
import { ChefHat } from "@/components/brand/ChefHat";
import { Sheet } from "@/components/ui/sheet";
import { IngredientsPanel } from "./IngredientsPanel";

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

export function IngredientsMobileTrigger(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 bg-brown text-cream px-5 h-12 flex items-center gap-3 shadow-lg btn-label"
        aria-label="Voir les ingrédients"
      >
        <ChefHat size={18} variant="light" />
        Ingrédients
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} side="right">
        <IngredientsPanel {...props} />
      </Sheet>
    </>
  );
}
