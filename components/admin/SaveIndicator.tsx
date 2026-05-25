"use client";

import { useEffect, useState } from "react";
import type { SaveStatus } from "@/lib/hooks/useDebouncedSave";

type Props = { status: SaveStatus; savedAt: number | null };

function formatAgo(ms: number): string {
  if (ms < 5000) return "à l'instant";
  if (ms < 60_000) return `il y a ${Math.floor(ms / 1000)} s`;
  if (ms < 3_600_000) return `il y a ${Math.floor(ms / 60_000)} min`;
  return `il y a ${Math.floor(ms / 3_600_000)} h`;
}

export function SaveIndicator({ status, savedAt }: Props) {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  if (status === "saving") {
    return (
      <span className="text-xs text-[color:var(--brown-mute)]">Enregistrement…</span>
    );
  }
  if (status === "error") {
    return (
      <span className="text-xs text-[color:var(--terracotta-deep)]">
        ⚠ Erreur d'enregistrement
      </span>
    );
  }
  if (status === "saved" && savedAt) {
    return (
      <span className="text-xs text-[color:var(--brown-mute)]">
        ✓ Enregistré {formatAgo(Date.now() - savedAt)}
      </span>
    );
  }
  return null;
}
