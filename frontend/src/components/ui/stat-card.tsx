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
        "card-hover group relative overflow-hidden rounded-xl border border-border bg-surface p-3.5 sm:p-5 transition-all duration-200 hover:border-interactive/35",
        tone === "accent" && "border-interactive/25 bg-interactive/[0.03]",
        tone === "warning" && "border-highlight/35 bg-highlight/[0.04]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <p className="min-w-0 flex-1 break-words text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors group-hover:text-text leading-snug">
          {label}
        </p>
        {Icon ? (
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted transition-colors duration-200 group-hover:bg-interactive/10 group-hover:text-interactive sm:size-8">
            <Icon className="size-3.5 sm:size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="tabular mt-2.5 sm:mt-3.5 font-display text-xl sm:text-2xl md:text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-text break-words">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-[10px] sm:text-[11px] leading-relaxed text-muted break-words">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
