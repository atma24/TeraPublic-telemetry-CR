"use client";

import Link from "next/link";
import {
  BarChart3,
  Bot,
  Building2,
  HelpCircle,
  Home,
  Layers,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLanguage } from "@/components/i18n/language-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS, PORTAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";
import { AccountMenu } from "./account-menu";

function getNavIcon(href: string) {
  switch (href) {
    case "/data":
      return Building2;
    case "/layanan-publik":
      return Layers;
    case "/analitik":
      return BarChart3;
    case "/tentang":
      return HelpCircle;
    case "/chatbot":
      return Bot;
    default:
      return Layers;
  }
}

export function SiteHeader({ user }: { user: User | null }) {
  const pathname = usePathname();
  const { t } = useLanguage();
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const getNavLabel = (href: string, fallback: string) => {
    switch (href) {
      case "/data":
        return t("nav.data", fallback);
      case "/layanan-publik":
        return t("nav.services", fallback);
      case "/analitik":
        return t("nav.analytics", fallback);
      case "/tentang":
        return t("nav.about", fallback);
      case "/aduan/saya":
        return t("nav.my_feedback", fallback);
      case "/aduan/buat":
        return t("nav.create_feedback", fallback);
      case "/chatbot":
        return t("nav.assistant", fallback);
      default:
        return fallback;
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border/80 bg-bg/88 backdrop-blur-md transition-shadow",
          scrolled && "shadow-soft",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-8">
            {/* Desktop Logo */}
            <div className="hidden lg:block">
              <Logo priority />
            </div>

            {/* Mobile Logo Button (Bisa buka/tutup navbar sidebar) */}
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex items-center text-left focus:outline-hidden lg:hidden"
              aria-label={open ? t("menu.close", "Tutup navigasi") : t("menu.open", "Buka navigasi")}
              aria-expanded={open}
            >
              <Logo priority />
            </button>

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
                  {getNavLabel(link.href, link.label)}
                  {isActive(link.href) ? (
                    <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-interactive" />
                  ) : null}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
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
                  {t("nav.login", "Masuk")}
                </Link>
                <ButtonLink href="/aduan/buat" size="sm">
                  {t("nav.create_feedback", "Buat aduan")}
                </ButtonLink>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? t("menu.close", "Tutup menu") : t("menu.open", "Buka menu")}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-text transition-colors hover:bg-surface-2 lg:hidden"
            >
              {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Drawer Mobile */}
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Mobile Vertical Sidebar Drawer */}
      <aside
        id="mobile-navigation"
        aria-label="Navigasi seluler vertikal"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[285px] max-w-[85vw] flex-col justify-between border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full pointer-events-none",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Header Drawer: Logo & Tombol Close */}
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3.5">
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex items-center text-left focus:outline-hidden"
              aria-label="Tutup navigasi"
            >
              <Logo compact />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("menu.close", "Tutup menu")}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-text transition-colors hover:bg-surface-3"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* List Menu Vertikal */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                Menu Utama
              </p>
              <nav aria-label="Navigasi seluler vertikal" className="mt-2 flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    pathname === "/"
                      ? "bg-interactive/10 text-interactive font-bold"
                      : "text-muted hover:bg-surface-2 hover:text-text",
                  )}
                >
                  <Home className="size-4 shrink-0" aria-hidden="true" />
                  <span>{t("nav.home", "Beranda")}</span>
                </Link>

                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  const Icon = getNavIcon(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        active
                          ? "bg-interactive/10 text-interactive font-bold"
                          : "text-muted hover:bg-surface-2 hover:text-text",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{getNavLabel(link.href, link.label)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {user ? (
              <div className="border-t border-border/80 pt-4">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Akun Warga
                </p>
                <nav aria-label="Navigasi akun seluler" className="mt-2 flex flex-col gap-1">
                  {PORTAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                        isActive(link.href)
                          ? "bg-interactive/10 text-interactive font-bold"
                          : "text-muted hover:bg-surface-2 hover:text-text",
                      )}
                    >
                      <span>{getNavLabel(link.href, link.label)}</span>
                    </Link>
                  ))}
                  {user.role === "admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-interactive hover:bg-surface-2"
                    >
                      <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                      <span>{t("nav.admin", "Panel admin")}</span>
                    </Link>
                  ) : null}
                </nav>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Drawer: User Profile / Auth Button & Settings */}
        <div className="border-t border-border p-4 space-y-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-xl bg-surface-2/70 p-2.5">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-bg">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-text">{user.name}</p>
                <p className="truncate text-[10px] text-muted">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink
                href="/login"
                variant="secondary"
                size="sm"
                onClick={() => setOpen(false)}
                className="w-full justify-center text-center"
              >
                {t("nav.login", "Masuk")}
              </ButtonLink>
              <ButtonLink
                href="/register"
                size="sm"
                onClick={() => setOpen(false)}
                className="w-full justify-center text-center"
              >
                Daftar
              </ButtonLink>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-surface-2/40 px-3 py-2">
            <span className="text-xs font-medium text-muted">Pengaturan</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
