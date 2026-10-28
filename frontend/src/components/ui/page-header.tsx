import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden border-b border-border bg-surface", className)}>
      <div className="paper-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-page relative py-8 md:py-12">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-6" /> : null}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
            <h1 className="display-2 text-text">{title}</h1>
            {description ? <p className="lede mt-4 max-w-2xl">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </header>
  );
}
