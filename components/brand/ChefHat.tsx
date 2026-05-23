type Variant = "outline" | "filled" | "light";

type Props = {
  size?: number;
  variant?: Variant;
  className?: string;
};

export function ChefHat({ size = 24, variant = "outline", className = "" }: Props) {
  const stroke = variant === "light" ? "#FAF5EC" : "#B8943D";
  const fill = variant === "filled" ? "#B8943D" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
    >
      <path
        d="M 28 50 Q 22 50, 22 42 Q 18 35, 25 30 Q 25 18, 38 20 Q 42 12, 50 14 Q 58 12, 62 20 Q 75 18, 75 30 Q 82 35, 78 42 Q 78 50, 72 50 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <line x1="28" y1="50" x2="72" y2="50" stroke={stroke} strokeWidth={2.5} />
      <rect
        x="28"
        y="50"
        width="44"
        height="22"
        fill={variant === "filled" ? stroke : "none"}
        stroke={stroke}
        strokeWidth={2.5}
      />
    </svg>
  );
}
