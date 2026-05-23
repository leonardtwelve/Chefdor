/**
 * Seed Chefdor Cakes — 2 recettes factices pour développer les pages
 * avant que l'éditeur admin soit prêt.
 *
 * Lancement : `pnpm db:seed`
 */
import { PrismaClient, Difficulty, RecipeStatus } from "@prisma/client";

const db = new PrismaClient();

const PLACEHOLDER_HERO = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600";
const PLACEHOLDER_STEP = "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200";

async function main() {
  console.log("→ Seed Chefdor Cakes");

  // Nettoyage idempotent
  await db.stepPhoto.deleteMany();
  await db.step.deleteMany();
  await db.ingredient.deleteMany();
  await db.ingredientGroup.deleteMany();
  await db.recipe.deleteMany();
  await db.tag.deleteMany();

  // ── Tags ────────────────────────────────────────────────────────────────
  const tagCitron = await db.tag.create({ data: { slug: "citron", name: "Citron" } });
  const tagChocolat = await db.tag.create({ data: { slug: "chocolat", name: "Chocolat" } });
  const tagSignature = await db.tag.create({ data: { slug: "signature", name: "Signature" } });

  // ── Recette 1 : Tarte au citron meringuée ───────────────────────────────
  await db.recipe.create({
    data: {
      slug: "tarte-citron-meringuee",
      title: "Tarte au citron meringuée",
      subtitle: "Acidulée, fondante, nuageuse",
      intro:
        "Un classique que je refais chaque été. Une pâte sablée bien beurrée, " +
        "une crème au citron franche, et une meringue italienne brûlée au chalumeau.",
      status: RecipeStatus.PUBLISHED,
      publishedAt: new Date("2026-05-01"),
      isSignature: true,
      isSeasonal: true,
      category: "tarte",
      difficulty: Difficulty.INTERMEDIAIRE,
      servings: 8,
      servingUnit: "parts",
      format: "Tarte 24 cm",
      prepMinutes: 45,
      cookMinutes: 25,
      restMinutes: 120,
      heroImageUrl: PLACEHOLDER_HERO,
      heroImageWidth: 1600,
      heroImageHeight: 1067,
      heroImageAlt: "Tarte au citron meringuée tranchée",
      tags: { connect: [{ id: tagCitron.id }, { id: tagSignature.id }] },
      ingredientGroups: {
        create: [
          {
            name: "Pâte sablée",
            order: 0,
            ingredients: {
              create: [
                { order: 0, amount: 200, unit: "g", name: "farine T55", note: "tamisée" },
                { order: 1, amount: 100, unit: "g", name: "beurre froid", note: "en dés" },
                { order: 2, amount: 80, unit: "g", name: "sucre glace" },
                { order: 3, amount: 1, unit: "", name: "œuf entier", isScalable: false },
                { order: 4, amount: 1, unit: "pincée", name: "fleur de sel", isScalable: false },
              ],
            },
          },
          {
            name: "Crème au citron",
            order: 1,
            ingredients: {
              create: [
                { order: 0, amount: 150, unit: "ml", name: "jus de citron jaune", note: "≈ 4 citrons" },
                { order: 1, amount: 2, unit: "", name: "zestes de citron", isScalable: false },
                { order: 2, amount: 150, unit: "g", name: "sucre" },
                { order: 3, amount: 3, unit: "", name: "œufs entiers", isScalable: false },
                { order: 4, amount: 100, unit: "g", name: "beurre doux", note: "froid, en dés" },
              ],
            },
          },
          {
            name: "Meringue italienne",
            order: 2,
            ingredients: {
              create: [
                { order: 0, amount: 3, unit: "", name: "blancs d'œufs", isScalable: false },
                { order: 1, amount: 150, unit: "g", name: "sucre" },
                { order: 2, amount: 50, unit: "ml", name: "eau" },
              ],
            },
          },
        ],
      },
      steps: {
        create: [
          {
            order: 1,
            title: "Préparer la pâte sablée",
            content:
              "Sablez du bout des doigts farine, sucre, sel et beurre froid. Ajoutez l'œuf, " +
              "rassemblez sans pétrir. Filmez et réservez 1h au frais.",
            tip: "Une pâte bien froide ne rétractera pas à la cuisson.",
            photos: {
              create: [{ order: 0, url: PLACEHOLDER_STEP, width: 1200, height: 800, alt: "Sablage de la pâte" }],
            },
          },
          {
            order: 2,
            title: "Foncer et cuire à blanc",
            content:
              "Étalez la pâte sur 3 mm, foncez le cercle, piquez le fond. Couvrez de papier " +
              "et de billes de cuisson. Enfournez 20 min à 180°C, puis 5 min sans les billes.",
          },
          {
            order: 3,
            title: "Réaliser la crème au citron",
            content:
              "Fouettez œufs, sucre, jus et zestes. Cuisez à feu doux sans cesser de remuer " +
              "jusqu'à épaississement (≈ 5 min). Hors du feu, ajoutez le beurre en morceaux. " +
              "Mixez 1 min pour la rendre soyeuse. Coulez sur le fond cuit.",
            tip: "Le mixeur plongeant fait toute la différence sur la texture.",
          },
          {
            order: 4,
            title: "Meringue italienne",
            content:
              "Cuisez sucre et eau à 118°C. Versez en filet sur les blancs montés mousseux. " +
              "Fouettez jusqu'à refroidissement complet (bec d'oiseau).",
          },
          {
            order: 5,
            title: "Pocher et caraméliser",
            content:
              "Pochez la meringue en pointes. Brûlez délicatement au chalumeau. Servez frais.",
            tip: "Servir dans les 4h après pochage pour garder une meringue parfaite.",
          },
        ],
      },
    },
  });

  // ── Recette 2 : Entremet chocolat ───────────────────────────────────────
  await db.recipe.create({
    data: {
      slug: "entremet-chocolat-noisette",
      title: "Entremet chocolat noisette",
      subtitle: "Intense, croustillant, glacé miroir",
      intro:
        "Trois textures : un croustillant praliné, un biscuit moelleux noisette, " +
        "et une mousse au chocolat noir 70%. Le tout sous un glaçage miroir brillant.",
      status: RecipeStatus.PUBLISHED,
      publishedAt: new Date("2026-05-10"),
      isSignature: false,
      isSeasonal: false,
      category: "entremet",
      difficulty: Difficulty.AVANCE,
      servings: 10,
      servingUnit: "parts",
      format: "Cercle 22 cm",
      prepMinutes: 90,
      cookMinutes: 15,
      restMinutes: 720,
      heroImageUrl: PLACEHOLDER_HERO,
      heroImageWidth: 1600,
      heroImageHeight: 1067,
      heroImageAlt: "Entremet chocolat glacé miroir",
      tags: { connect: [{ id: tagChocolat.id }] },
      ingredientGroups: {
        create: [
          {
            name: "Croustillant praliné",
            order: 0,
            ingredients: {
              create: [
                { order: 0, amount: 100, unit: "g", name: "praliné noisette" },
                { order: 1, amount: 50, unit: "g", name: "chocolat au lait" },
                { order: 2, amount: 60, unit: "g", name: "crêpes dentelles", note: "émiettées" },
              ],
            },
          },
          {
            name: "Biscuit noisette",
            order: 1,
            ingredients: {
              create: [
                { order: 0, amount: 80, unit: "g", name: "poudre de noisette" },
                { order: 1, amount: 80, unit: "g", name: "sucre glace" },
                { order: 2, amount: 2, unit: "", name: "œufs", isScalable: false },
                { order: 3, amount: 30, unit: "g", name: "farine" },
                { order: 4, amount: 20, unit: "g", name: "beurre fondu" },
              ],
            },
          },
          {
            name: "Mousse chocolat 70%",
            order: 2,
            ingredients: {
              create: [
                { order: 0, amount: 200, unit: "g", name: "chocolat noir 70%" },
                { order: 1, amount: 100, unit: "ml", name: "lait entier" },
                { order: 2, amount: 300, unit: "ml", name: "crème liquide 35%", note: "très froide" },
                { order: 3, amount: 2, unit: "g", name: "gélatine", note: "feuilles" },
              ],
            },
          },
          {
            name: "Glaçage miroir",
            order: 3,
            ingredients: {
              create: [
                { order: 0, amount: 100, unit: "g", name: "chocolat noir" },
                { order: 1, amount: 80, unit: "g", name: "sucre" },
                { order: 2, amount: 80, unit: "ml", name: "eau" },
                { order: 3, amount: 80, unit: "ml", name: "crème" },
                { order: 4, amount: 30, unit: "g", name: "cacao en poudre" },
                { order: 5, amount: 6, unit: "g", name: "gélatine" },
              ],
            },
          },
        ],
      },
      steps: {
        create: [
          {
            order: 1,
            title: "Croustillant",
            content:
              "Faites fondre chocolat au lait + praliné. Mélangez avec les crêpes dentelles. " +
              "Étalez en disque de 20 cm. Réservez au frais.",
          },
          {
            order: 2,
            title: "Biscuit noisette",
            content:
              "Montez œufs + sucre + poudre de noisette au ruban. Incorporez délicatement la farine " +
              "puis le beurre. Étalez sur plaque, cuisez 10 min à 180°C. Détaillez un disque 20 cm.",
          },
          {
            order: 3,
            title: "Mousse chocolat",
            content:
              "Faites fondre le chocolat. Chauffez le lait avec la gélatine ramollie. Versez sur " +
              "le chocolat, mélangez. À 35°C, incorporez la crème montée mousseuse en 3 fois.",
            tip: "Une crème trop ferme = mousse granuleuse. On veut une texture mousse à raser.",
          },
          {
            order: 4,
            title: "Montage à l'envers",
            content:
              "Dans un cercle 22 cm chemisé de rhodoïd, coulez la moitié de la mousse. Posez le biscuit, " +
              "puis le croustillant. Recouvrez du reste de mousse. Lissez. Congelez 8h minimum.",
          },
          {
            order: 5,
            title: "Glaçage miroir",
            content:
              "Cuisez sucre, eau, crème et cacao à 103°C. Hors feu, ajoutez la gélatine puis le chocolat. " +
              "Mixez sans incorporer d'air. Utilisez à 32-34°C sur l'entremet sortant du congélateur.",
            tip: "Filtrez le glaçage au chinois pour qu'il soit parfaitement lisse.",
          },
        ],
      },
    },
  });

  const count = await db.recipe.count();
  console.log(`✓ ${count} recettes créées`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
