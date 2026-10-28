import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "accent" | "warning";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-surface p-5",
        tone === "accent" && "border-interactive/25 bg-interactive/5",
        tone === "warning" && "border-highlight/35 bg-highlight/8",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted">{label}</p>
        {Icon ? (
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-surface-2 text-muted">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="tabular mt-3 font-display text-[1.7rem] font-bold leading-none tracking-[-0.04em] text-text">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[11px] leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}
