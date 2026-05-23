import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

type Props = {
  basePath: string;
  current?: string;
};

export function CategoryFilter({ basePath, current }: Props) {
  const items = [{ slug: undefined as string | undefined, label: "Tout" }, ...CATEGORIES];

  return (
    <nav className="flex flex-wrap items-center gap-2 md:gap-1">
      {items.map((item) => {
        const isActive = item.slug === current || (!item.slug && !current);
        const href = item.slug ? `${basePath}?category=${item.slug}` : basePath;
        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              "btn-label px-4 py-2 border transition-colors",
              isActive
                ? "bg-brown text-cream border-brown"
                : "bg-transparent text-brown border-[color:var(--border)] hover:border-brown",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
