import { redirect } from "next/navigation";

// La création se fait via le bouton sur /admin qui appelle directement
// `createRecipe()` puis redirige vers /admin/[id]. Cette route reste comme
// fallback pour les liens externes.
export default function NouvelleRecetteRedirect() {
  redirect("/admin");
}
