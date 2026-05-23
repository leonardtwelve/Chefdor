import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full bg-[color:var(--cream-surface)] border border-[color:var(--border)] px-3 text-sm text-brown",
        "placeholder:text-[color:var(--brown-mute)] focus:outline-none focus:border-[color:var(--terracotta)]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
