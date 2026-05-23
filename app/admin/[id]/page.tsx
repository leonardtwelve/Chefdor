type Props = { params: Promise<{ id: string }> };

export default async function EditRecettePage({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <p className="eyebrow">Édition</p>
      <h1 className="font-serif text-5xl mt-4">Recette #{id}</h1>
      <p className="mt-6 text-[color:var(--brown-soft)]">
        Stub — éditeur en S3.
      </p>
    </div>
  );
}
