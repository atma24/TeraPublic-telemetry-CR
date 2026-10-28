"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS, PORTAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";
import { AccountMenu } from "./account-menu";

export function SiteHeader({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-bg/88 backdrop-blur-md transition-shadow",
        scrolled && "shadow-soft",
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <Logo priority />
          <nav aria-label="Navigasi utama" className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-text",
                  isActive(link.href) && "text-text",
                )}
              >
                {link.label}
                {isActive(link.href) ? (
                  <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-interactive" />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden sm:block">
              <AccountMenu user={user} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-xs font-semibold text-muted transition-colors hover:text-text"
              >
                Masuk
              </Link>
              <ButtonLink href="/aduan/buat" size="sm">
                Buat aduan
              </ButtonLink>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-text lg:hidden"
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t border-border bg-surface lg:hidden">
          <div className="container-wide py-4">
            <nav aria-label="Navigasi seluler" className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-text",
                    isActive(link.href) && "bg-surface-2 text-text",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="my-3 border-t border-border" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-bg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{user.name}</p>
                    <p className="truncate text-[11px] text-muted">{user.email}</p>
                  </div>
                </div>
                <nav aria-label="Navigasi akun" className="mt-1 grid gap-1">
                  {PORTAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-text"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user.role === "admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-interactive hover:bg-surface-2"
                    >
                      <ShieldCheck className="size-4" aria-hidden="true" />
                      Panel admin
                    </Link>
                  ) : null}
                </nav>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-1">
                <ButtonLink href="/login" variant="secondary" size="sm" onClick={() => setOpen(false)}>
                  Masuk
                </ButtonLink>
                <ButtonLink href="/register" size="sm" onClick={() => setOpen(false)}>
                  Daftar
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
