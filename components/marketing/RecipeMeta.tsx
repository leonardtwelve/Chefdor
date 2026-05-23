import { formatDuration, difficultyLabel } from "@/lib/format";

type Props = {
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number;
  difficulty: string;
  format: string | null;
};

export function RecipeMeta({ prepMinutes, cookMinutes, restMinutes, difficulty, format }: Props) {
  const items: { label: string; value: string }[] = [
    { label: "Préparation", value: formatDuration(prepMinutes) },
  ];
  if (cookMinutes > 0) items.push({ label: "Cuisson", value: formatDuration(cookMinutes) });
  if (restMinutes > 0) items.push({ label: "Repos", value: formatDuration(restMinutes) });
  items.push({ label: "Difficulté", value: difficultyLabel(difficulty) });
  if (format) items.push({ label: "Format", value: format });

  return (
    <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4 py-6 border-y border-[color:var(--border)]">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col">
          <dt className="eyebrow">{item.label}</dt>
          <dd className="font-serif text-xl text-brown mt-1.5">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
