"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/components/uploadthing-client";
import { Input } from "@/components/ui/input";

type Props = {
  url: string;
  alt: string | null;
  onChange: (patch: { heroImageUrl?: string; heroImageAlt?: string | null; heroImageWidth?: number; heroImageHeight?: number }) => void;
};

export function HeroImageField({ url, alt, onChange }: Props) {
  const [replace, setReplace] = useState(false);
  const showDropzone = !url || replace;

  return (
    <div>
      <p className="eyebrow mb-3">Photo héro</p>

      {url && !replace && (
        <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden bg-[color:var(--rose)] mb-3 group">
          <Image
            src={url}
            alt={alt ?? ""}
            fill
            sizes="320px"
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={() => setReplace(true)}
            className="absolute inset-0 bg-brown/80 text-cream opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center btn-label"
          >
            Remplacer la photo
          </button>
        </div>
      )}

      {showDropzone && (
        <div className="mb-3">
          <UploadDropzone
            endpoint="recipeImage"
            onClientUploadComplete={(res) => {
              const file = res?.[0];
              if (file?.serverData) {
                onChange({
                  heroImageUrl: file.serverData.url,
                  heroImageWidth: file.serverData.width,
                  heroImageHeight: file.serverData.height,
                });
                setReplace(false);
              }
            }}
            onUploadError={(e) => alert(`Erreur upload : ${e.message}`)}
            appearance={{
              container:
                "border border-dashed border-[color:var(--border)] bg-[color:var(--cream-surface)] p-4 ut-uploading:opacity-60",
              label: "text-[color:var(--terracotta)] hover:text-[color:var(--terracotta-deep)]",
              allowedContent: "text-xs text-[color:var(--brown-mute)]",
              button:
                "ut-ready:bg-brown ut-ready:text-cream after:!bg-[color:var(--terracotta)] ut-uploading:after:!bg-[color:var(--terracotta)]",
            }}
            content={{
              label: "Choisir une photo ou la glisser ici",
              allowedContent: "JPEG, PNG, WebP — 8 Mo max",
            }}
          />
          {replace && (
            <button
              type="button"
              onClick={() => setReplace(false)}
              className="mt-2 text-xs text-[color:var(--brown-mute)] hover:text-[color:var(--terracotta-deep)]"
            >
              × Annuler le remplacement
            </button>
          )}
        </div>
      )}

      <label className="block">
        <span className="text-xs text-[color:var(--brown-mute)]">
          Texte alternatif (description courte)
        </span>
        <Input
          value={alt ?? ""}
          onChange={(e) => onChange({ heroImageAlt: e.target.value || null })}
          placeholder="ex : Tarte au citron tranchée"
          className="mt-1"
        />
      </label>
    </div>
  );
}
