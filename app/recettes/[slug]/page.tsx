type Props = { params: Promise<{ slug: string }> };

export default async function RecettePage({ params }: Props) {
  const { slug } = await params;
  return (
    <main className="min-h-screen px-6 py-24 max-w-3xl mx-auto">
      <p className="eyebrow">Recette</p>
      <h1 className="font-serif text-5xl mt-4 capitalize">{slug.replace(/-/g, " ")}</h1>
      <p className="mt-6 text-[color:var(--brown-soft)]">
        Stub — fiche recette à construire en S2.
      </p>
    </main>
  );
}
