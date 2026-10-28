import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-surface-2 text-muted">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="font-display text-base font-semibold text-text">{title}</h3>
      {description ? <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Data belum dapat dimuat",
  description = "Layanan data TeraPublic tidak merespons. Coba muat ulang halaman atau kembali beberapa saat lagi.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-lg border border-danger/25 bg-danger/5 px-5 py-5",
        className,
      )}
    >
      <span className="inline-flex size-9 items-center justify-center rounded-md bg-danger/10 text-danger">
        <AlertTriangle className="size-4" aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-display text-sm font-semibold text-text">{title}</h3>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
