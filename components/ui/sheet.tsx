"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Side = "left" | "right";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  side?: Side;
  children: React.ReactNode;
  className?: string;
};

export function Sheet({ open, onClose, side = "right", children, className }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const sideClass =
    side === "right" ? "right-0 border-l" : "left-0 border-r";

  return (
    <div
      className="fixed inset-0 z-50 bg-[color:var(--brown)]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className={cn(
          "absolute top-0 bottom-0 w-[90%] max-w-md bg-[color:var(--cream-surface)] border-[color:var(--border)] p-8 overflow-y-auto",
          sideClass,
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </aside>
    </div>
  );
}
