import type { MetadataRoute } from "next";

// Site en mode "cadeau privé" : on bloque toute indexation.
// À remplacer par un robots permissif le jour de la mise en public.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
