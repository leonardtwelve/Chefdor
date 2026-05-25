"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";

type Props = {
  url: string;
  alt: string | null;
  onChange: (patch: { heroImageUrl?: string; heroImageAlt?: string | null }) => void;
};

export function HeroImageField({ url, alt, onChange }: Props) {
  return (
    <div>
      <p className="eyebrow mb-3">Photo héro</p>

      {url && (
        <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden bg-[color:var(--rose)] mb-3">
          <Image
            src={url}
            alt={alt ?? ""}
            fill
            sizes="320px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <label className="block">
        <span className="text-xs text-[color:var(--brown-mute)]">URL de l&apos;image</span>
        <Input
          value={url}
          onChange={(e) => onChange({ heroImageUrl: e.target.value })}
          placeholder="https://…"
          className="mt-1"
        />
      </label>

      <label className="block mt-3">
        <span className="text-xs text-[color:var(--brown-mute)]">
          Texte alternatif (description courte)
        </span>
        <Input
          value={alt ?? ""}
          onChange={(e) => onChange({ heroImageAlt: e.target.value || null })}
          placeholder="ex: Tarte au citron tranchée"
          className="mt-1"
        />
      </label>

      <p className="mt-3 text-xs italic text-[color:var(--brown-mute)]">
        Pour l&apos;instant, colle une URL d&apos;image (UploadThing arrive bientôt).
      </p>
    </div>
  );
}
