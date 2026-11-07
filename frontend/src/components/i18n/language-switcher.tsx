"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/i18n/language-provider";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n/translations";

const languages: Array<{
  code: Language;
  label: string;
  native: string;
  badge: string;
}> = [
  { code: "id", label: "Bahasa Indonesia", native: "Indonesia", badge: "ID" },
  { code: "en", label: "English", native: "Inggris", badge: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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

  const handleSelect = (code: Language) => {
    if (code !== language) {
      setLanguage(code);
      showToast({
        title: code === "id" ? "Bahasa diubah" : "Language updated",
        description: code === "id" ? "Bahasa Indonesia aktif" : "English is now active",
        tone: "info",
      });
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("lang.switch_label", "Ganti bahasa")}
        title={t("lang.switch_label", "Ganti bahasa (ID / EN)")}
        className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-semibold text-muted transition-colors hover:border-interactive/50 hover:text-text"
      >
        <Languages className="size-4 text-interactive" aria-hidden="true" />
        <span className="font-bold uppercase tracking-wide text-text">{language}</span>
        <ChevronDown
          className={cn("size-3 text-muted/70 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("lang.select", "Pilih Bahasa")}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-52 overflow-hidden rounded-lg border border-border bg-surface p-1.5 shadow-lift animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="border-b border-border/70 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
            {t("lang.select", "Pilih Bahasa")}
          </div>

          <div className="mt-1 space-y-0.5">
            {languages.map((item) => {
              const active = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(item.code)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors",
                    active
                      ? "bg-interactive/10 font-bold text-interactive"
                      : "font-medium text-text hover:bg-surface-2",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-flex h-5 w-6 items-center justify-center rounded border text-[10px] font-bold tracking-wider",
                        active
                          ? "border-interactive/30 bg-interactive/15 text-interactive"
                          : "border-border/80 bg-surface-2 text-muted",
                      )}
                      aria-hidden="true"
                    >
                      {item.badge}
                    </span>
                    <span>
                      <span>{item.label}</span>
                      <span className="ml-1 text-[10px] text-muted">({item.native})</span>
                    </span>
                  </span>
                  {active ? <Check className="size-3.5 text-interactive" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
