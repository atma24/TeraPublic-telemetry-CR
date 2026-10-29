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
        "card-hover group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:border-interactive/35",
        tone === "accent" && "border-interactive/25 bg-interactive/[0.03]",
        tone === "warning" && "border-highlight/35 bg-highlight/[0.04]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-muted transition-colors group-hover:text-text">{label}</p>
        {Icon ? (
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-surface-2 text-muted transition-colors duration-200 group-hover:bg-interactive/10 group-hover:text-interactive">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="tabular mt-3.5 font-display text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-text">
        {value}
      </p>
      {hint ? <p className="mt-2.5 text-[11px] leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}
