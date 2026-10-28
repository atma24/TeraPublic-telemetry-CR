"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  MessageSquare,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { AccountMenu } from "@/components/layout/account-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { logoutAction } from "@/lib/auth/actions";
import { ADMIN_LINKS, ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

const icons = {
  dashboard: LayoutDashboard,
  building: Building2,
  wallet: Wallet,
  message: MessageSquare,
  map: MapPinned,
} as const;

export function AdminShell({ user, children }: { user: User; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const current =
    [...ADMIN_LINKS]
      .reverse()
      .find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)) ?? ADMIN_LINKS[0];

  return (
    <div className="min-h-dvh bg-bg">
      {open ? (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-navy text-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Logo href="/admin" compact priority tone="inverse" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup navigasi"
            className="inline-flex size-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 pb-2 pt-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Panel administrasi</p>
        </div>

        <nav aria-label="Navigasi admin" className="flex-1 space-y-0.5 px-2.5">
          {ADMIN_LINKS.map((link) => {
            const Icon = icons[link.icon];
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-semibold transition-colors",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/60 hover:bg-white/6 hover:text-white",
                )}
              >
                <Icon
                  className={cn("size-4 transition-colors", active ? "text-brand-mint" : "text-white/40 group-hover:text-white/70")}
                  aria-hidden="true"
                />
                {link.label}
                {active ? <span className="ml-auto size-1.5 rounded-full bg-brand-mint" aria-hidden="true" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-3">
          <div className="rounded-md bg-white/6 px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">{ROLE_LABELS[user.role]}</p>
            <p className="mt-1 truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="truncate text-[10px] text-white/45">{user.email}</p>
          </div>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-[11px] font-semibold text-white/55 transition-colors hover:bg-white/6 hover:text-white"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Lihat situs publik
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[11px] font-semibold text-white/55 transition-colors hover:bg-white/6 hover:text-white"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Buka navigasi"
                aria-expanded={open}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-surface text-text lg:hidden"
              >
                <Menu className="size-4" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">Admin</p>
                <p className="truncate text-sm font-semibold text-text">{current.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-text sm:inline-flex"
              >
                Situs publik
                <ExternalLink className="size-3" aria-hidden="true" />
              </Link>
              <ThemeToggle />
              <AccountMenu user={user} />
            </div>
          </div>
        </header>

        <main id="main-content" className="px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
