import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  widget,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  widget?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-surface to-surface-2/30",
        className,
      )}
    >
      {/* Top Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-interactive/50 to-transparent"
        aria-hidden="true"
      />
      <div className="paper-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-interactive/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-brand-mint/8 blur-3xl"
        aria-hidden="true"
      />

      {/* Modern Civic Telemetry Watermark */}
      <div
        className="pointer-events-none absolute right-8 top-5 hidden select-none font-mono text-[9px] uppercase tracking-[0.25em] text-muted/20 lg:block"
        aria-hidden="true"
      >
        SYS // TERAPUBLIC TELEMETRY
      </div>

      <div className="container-page relative py-8 md:py-11">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-5" /> : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
          <div className="max-w-3xl">
            {eyebrow ? (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/90 px-3 py-1 shadow-2xs backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-interactive animate-pulse" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
                  {eyebrow}
                </span>
                <span className="text-[10px] text-muted" aria-hidden="true">
                  ·
                </span>
                <span className="text-[10px] font-medium text-muted">DKI Jakarta</span>
              </div>
            ) : null}

            <h1 className="display-2 text-text">{title}</h1>
            {description ? <p className="lede mt-3 max-w-2xl text-sm md:text-base">{description}</p> : null}

            {actions ? <div className="mt-5 flex flex-wrap items-center gap-2.5">{actions}</div> : null}
          </div>

          <div className="shrink-0 lg:max-w-md">
            {widget ? (
              widget
            ) : (
              <div className="hidden flex-col items-end gap-1.5 text-right lg:flex">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-3.5 py-1.5 text-xs font-semibold text-text shadow-2xs backdrop-blur-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  <span>Data Terbuka Terintegrasi</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  44 KECAMATAN · TELEMETRY-CR
                </p>
              </div>
            )}
          </div>
        </div>

        {children ? <div className="mt-6 md:mt-7">{children}</div> : null}
      </div>
    </header>
  );
}
