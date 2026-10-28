"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, MessageSquare, Send, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { logoutAction } from "@/lib/auth/actions";
import { ROLE_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";
import type { User } from "@/types/auth";

export function AccountMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface pl-1.5 pr-2.5 text-left transition-colors hover:border-interactive/40"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-[5px] bg-primary text-[10px] font-bold text-bg">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-32 truncate text-xs font-semibold text-text sm:block">
          {user.name}
        </span>
        <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-64 overflow-hidden rounded-lg border border-border bg-surface shadow-lift"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-text">{user.name}</p>
            <p className="truncate text-[11px] text-muted">{user.email}</p>
            <p className="mt-1.5 inline-flex rounded-sm bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <div className="p-1.5">
            <MenuLink href="/aduan/saya" icon={UserRound} onClick={() => setOpen(false)}>
              Aduan saya
            </MenuLink>
            <MenuLink href="/aduan/buat" icon={Send} onClick={() => setOpen(false)}>
              Buat aduan
            </MenuLink>
            <MenuLink href="/chatbot" icon={MessageSquare} onClick={() => setOpen(false)}>
              Asisten data
            </MenuLink>
            {user.role === "admin" ? (
              <MenuLink href="/admin" icon={LayoutDashboard} onClick={() => setOpen(false)}>
                Panel admin
              </MenuLink>
            ) : null}
          </div>
          <form action={logoutAction} className="border-t border-border p-1.5">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-semibold text-danger transition-colors hover:bg-danger/8"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Keluar
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: typeof UserRound;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </Link>
  );
}
