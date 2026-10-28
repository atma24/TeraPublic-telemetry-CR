import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent" | "outline";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-2 text-muted",
  info: "border-interactive/20 bg-interactive/10 text-interactive",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-highlight/35 bg-highlight/15 text-[#8a5a00] dark:text-highlight",
  danger: "border-danger/20 bg-danger/10 text-danger",
  accent: "border-accent/30 bg-accent/12 text-interactive",
  outline: "border-border bg-transparent text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold leading-5",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function StatusDot({ tone = "neutral" }: { tone?: BadgeTone }) {
  const color =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
        ? "bg-highlight"
        : tone === "danger"
          ? "bg-danger"
          : tone === "info" || tone === "accent"
            ? "bg-interactive"
            : "bg-muted";
  return <span className={cn("size-1.5 rounded-full", color)} aria-hidden="true" />;
}
