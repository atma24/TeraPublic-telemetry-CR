import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function Pagination({
  basePath,
  currentPage,
  lastPage,
  query = {},
  className,
}: {
  basePath: string;
  currentPage: number;
  lastPage: number;
  query?: Record<string, string | undefined>;
  className?: string;
}) {
  if (lastPage <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  const pages = new Set<number>([1, lastPage, currentPage - 1, currentPage, currentPage + 1]);
  const visible = [...pages].filter((page) => page >= 1 && page <= lastPage).sort((a, b) => a - b);

  return (
    <nav className={cn("flex items-center justify-between gap-4", className)} aria-label="Navigasi halaman">
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-muted transition-colors hover:text-text",
          currentPage <= 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        Sebelumnya
      </Link>

      <div className="flex items-center gap-1">
        {visible.map((page, index) => {
          const previous = visible[index - 1];
          return (
            <span key={page} className="flex items-center gap-1">
              {previous !== undefined && page - previous > 1 ? (
                <span className="px-1 text-xs text-muted">…</span>
              ) : null}
              <Link
                href={hrefFor(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
                  page === currentPage
                    ? "border-interactive bg-interactive text-bg"
                    : "border-border bg-surface text-muted hover:text-text",
                )}
              >
                {page}
              </Link>
            </span>
          );
        })}
      </div>

      <Link
        href={hrefFor(Math.min(lastPage, currentPage + 1))}
        aria-disabled={currentPage >= lastPage}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-muted transition-colors hover:text-text",
          currentPage >= lastPage && "pointer-events-none opacity-40",
        )}
      >
        Berikutnya
        <ChevronRight className="size-3.5" aria-hidden="true" />
      </Link>
    </nav>
  );
}
