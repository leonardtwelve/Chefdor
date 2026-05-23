export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} h`;
  return `${h} h ${m.toString().padStart(2, "0")}`;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  FACILE: "Facile",
  INTERMEDIAIRE: "Intermédiaire",
  AVANCE: "Avancé",
};

export function difficultyLabel(value: string): string {
  return DIFFICULTY_LABEL[value] ?? value;
}
