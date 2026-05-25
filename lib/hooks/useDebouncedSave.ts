"use client";

import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type Options<T> = {
  value: T;
  delay?: number;
  save: (value: T) => Promise<void>;
  /** Si vrai au montage, on saute le 1er save (pas de save initial). */
  skipFirst?: boolean;
};

export function useDebouncedSave<T>({ value, delay = 800, save, skipFirst = true }: Options<T>) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skip = useRef(skipFirst);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setStatus("saving");
    timer.current = setTimeout(async () => {
      try {
        await save(value);
        setStatus("saved");
        setSavedAt(Date.now());
      } catch {
        setStatus("error");
      }
    }, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { status, savedAt };
}
