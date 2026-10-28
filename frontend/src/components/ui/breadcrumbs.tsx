import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

export function Breadcrumbs({
  items,
  className,
}: {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-[11px] text-muted", className)}>
      <Link href="/" aria-label="Beranda" className="inline-flex items-center gap-1 hover:text-text">
        <Home className="size-3" aria-hidden="true" />
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href ?? "current"}`} className="inline-flex items-center gap-1.5">
          <ChevronRight className="size-3 text-muted/60" aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-text">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-text">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
