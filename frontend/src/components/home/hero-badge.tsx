"use client";

import { useLanguage } from "@/components/i18n/language-provider";

export function HeroBadge() {
  const { language } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-interactive/25 bg-surface-2/90 px-3.5 py-1 text-xs font-semibold text-interactive shadow-2xs backdrop-blur-md">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-interactive opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-interactive" />
      </span>
      <span>{language === "en" ? "Open Data · DKI Jakarta" : "Data Terbuka · DKI Jakarta"}</span>
    </div>
  );
}
