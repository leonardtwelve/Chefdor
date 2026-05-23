import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full bg-[color:var(--cream-surface)] border border-[color:var(--border)] px-3 py-2 text-sm text-brown",
        "placeholder:text-[color:var(--brown-mute)] focus:outline-none focus:border-[color:var(--terracotta)] resize-y",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
