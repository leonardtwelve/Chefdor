import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  active: boolean;
  children: React.ReactNode;
};

export function FilterChip({ href, active, children }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "btn-label px-4 py-2 border transition-colors whitespace-nowrap",
        active
          ? "bg-brown text-cream border-brown"
          : "bg-transparent text-brown border-[color:var(--border)] hover:border-brown",
      )}
    >
      {children}
    </Link>
  );
}
