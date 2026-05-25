"use client";

import { useTransition } from "react";
import { createRecipe } from "@/lib/actions/recipes";
import { Button } from "@/components/ui/button";

export function NewRecipeButton() {
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() => start(() => createRecipe())}
    >
      {pending ? "Création…" : "+ Nouvelle recette"}
    </Button>
  );
}
