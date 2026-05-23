import { ChefHat } from "./ChefHat";

type Size = "sm" | "md" | "lg";

type Props = {
  size?: Size;
  mono?: boolean;
  className?: string;
};

const sizeMap: Record<Size, { hat: number; chefdor: string; cakes: string; gap: string }> = {
  sm: { hat: 22, chefdor: "text-sm", cakes: "text-base", gap: "gap-2" },
  md: { hat: 32, chefdor: "text-base", cakes: "text-2xl", gap: "gap-3" },
  lg: { hat: 56, chefdor: "text-lg", cakes: "text-4xl", gap: "gap-4" },
};

export function Logo({ size = "md", mono = false, className = "" }: Props) {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {!mono && <ChefHat size={s.hat} variant="outline" />}
      <div className="flex flex-col leading-none">
        <span
          className={`btn-label ${s.chefdor} text-brown`}
          style={{ letterSpacing: "0.22em" }}
        >
          CHEFDOR
        </span>
        <span
          className={`font-serif italic ${s.cakes}`}
          style={{ color: "var(--terracotta)", marginTop: "-0.15em" }}
        >
          cakes
        </span>
      </div>
    </div>
  );
}
