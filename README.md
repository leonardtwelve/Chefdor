# Chefdor Cakes

Carnet de recettes de pâtisserie éditorial. Cadeau d'anniversaire, livraison **4 semaines**.

## Stack

- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS 4 (CSS variables natives)
- Prisma 5 + PostgreSQL
- NextAuth v5 (magic link Resend) — un seul admin
- UploadThing pour les images
- Cormorant Garamond + Inter (`next/font/google`)

## Prérequis

- Node 20+ et **pnpm**
- Une base Postgres (Neon ou Supabase)
- Un compte Resend (clé API)
- Un compte UploadThing (token)

## Installation

```bash
pnpm install
cp .env.example .env
# Édite .env avec tes valeurs
```

## Base de données

1. Colle ton schéma métier (Recipe, IngredientGroup, Ingredient, Step, StepPhoto, Tag) dans `prisma/schema.prisma` sous la section `// Métier (à coller)`.
2. Migre :

```bash
pnpm db:migrate
```

3. Adapte `prisma/seed.ts` puis :

```bash
pnpm db:seed
```

## Lancement

```bash
pnpm dev
# http://localhost:3000
# http://localhost:3000/admin (magic link)
```

## Commandes utiles

| Commande           | Action                  |
| ------------------ | ----------------------- |
| `pnpm dev`         | Dev server (turbopack)  |
| `pnpm build`       | Build prod              |
| `pnpm start`       | Serveur prod            |
| `pnpm db:migrate`  | `prisma migrate dev`    |
| `pnpm db:studio`   | Prisma Studio           |
| `pnpm db:seed`     | Seed                    |
| `pnpm db:generate` | Génère le client Prisma |

## Structure

```
app/
  page.tsx                  Accueil (stub "Bientôt")
  recettes/                 Liste + fiche publique
  a-propos/                 À propos
  admin/                    Espace admin (NextAuth)
  api/
    auth/[...nextauth]/     NextAuth handlers
    uploadthing/            UploadThing router
components/
  brand/                    Logo + ChefHat (toque nuage)
  ui/                       Primitives (Button, Input, Dialog, Sheet, Toast…)
  marketing/                À venir — composants front public (S2)
  admin/                    À venir — éditeur (S3)
lib/
  db.ts                     Client Prisma singleton
  auth.ts                   NextAuth v5 config
  uploadthing.ts            File router
  scale.ts                  Logique de scaling des portions
  utils.ts                  cn (clsx)
prisma/
  schema.prisma             ← coller le schéma métier ici
  seed.ts                   ← adapter après collage du schéma
```

## Notes

- Les primitives `components/ui/*` sont des stubs maison alignés sur l'API shadcn (le CLI shadcn v4 + Tailwind 4 reste peu stable ; on remplacera plus tard si besoin).
- Le callback `signIn` n'autorise QUE l'email `ADMIN_EMAIL` (.env).
- Aucun test : on valide à la main.

## Roadmap

- **S1** ✅ Scaffold
- **S2** Pages publiques (accueil, liste, fiche)
- **S3** Éditeur admin
- **S4** Polish + déploiement Vercel
