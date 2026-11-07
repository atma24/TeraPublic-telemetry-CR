"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FilePlus2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { TEAM_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface CivicCtaCardProps {
  title?: string;
  highlightText?: string;
  description?: string;
  badgeLabel?: string;
  reportHref?: string;
  reportLabel?: string;
  ticketCode?: string;
  ticketTitle?: string;
  ticketMeta?: string;
  className?: string;
}

export function CivicCtaCard({
  title,
  highlightText,
  description,
  badgeLabel,
  reportHref = "/aduan/buat",
  reportLabel,
  ticketCode = "#ADU-JKT-8492",
  ticketTitle,
  ticketMeta,
  className,
}: CivicCtaCardProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const resolvedTitle = title ?? (isEn ? "Have findings in your neighborhood?" : "Punya temuan di sekitar Anda?");
  const resolvedHighlight = highlightText ?? (isEn ? "Turn it into data." : "Jadikan data.");
  const resolvedDescription =
    description ??
    (isEn
      ? "Report damaged public facilities or accessibility obstacles in Jakarta. Every citizen report is verified into open data to monitor repairs together with municipal agencies."
      : "Laporkan kerusakan fasilitas atau hambatan aksesibilitas di Jakarta. Setiap laporan warga diverifikasi menjadi data terbuka yang dapat dipantau bersama dinas terkait.");
  const resolvedBadge = badgeLabel ?? (isEn ? `CITIZEN PARTICIPATION CHANNEL · ${TEAM_NAME}` : `KANAL PARTISIPASI WARGA · ${TEAM_NAME}`);
  const resolvedReportLabel = reportLabel ?? (isEn ? "Submit report now" : "Buat aduan sekarang");
  const resolvedTicketTitle = ticketTitle ?? (isEn ? "Damaged Tactile Paving on Sidewalk" : "Ubin Pemandu Tunanetra Rusak di Trotoar");
  const resolvedTicketMeta = ticketMeta ?? (isEn ? "Menteng, Central Jakarta · Pedestrian Facility" : "Kec. Menteng, Jakarta Pusat · Fasilitas Pejalan Kaki");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-[#10273a] via-[#15324b] to-[#0c1e2d] p-5 text-white shadow-xl sm:p-8 md:p-10 lg:p-12",
        className,
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-mint/70 to-transparent"
        aria-hidden="true"
      />

      <div className="paper-grid absolute inset-0 opacity-[0.05]" aria-hidden="true" />

      {/* Responsive blur ambient background */}
      <div
        className="pointer-events-none absolute -left-16 -top-16 size-44 rounded-full bg-brand-teal/20 blur-xl sm:-left-20 sm:-top-20 sm:size-72 sm:blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-0 size-48 rounded-full bg-brand-mint/10 blur-xl sm:-bottom-20 sm:size-80 sm:blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-mint/30 bg-brand-mint/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-brand-mint backdrop-blur-sm sm:text-[11px]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-mint opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-mint" />
            </span>
            {resolvedBadge}
          </div>

          <h2 className="mt-3.5 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-[40px]">
            {resolvedTitle} <span className="text-brand-mint">{resolvedHighlight}</span>
          </h2>

          <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm sm:leading-relaxed">
            {resolvedDescription}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2 text-xs text-white/80 sm:mt-6 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-brand-mint" aria-hidden="true" />
              {isEn ? "Unique tracking code" : "Kode pelacakan unik"}
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-brand-mint" aria-hidden="true" />
              {isEn ? "Verified within 24h" : "Diverifikasi 1x24 jam"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="size-4 shrink-0 text-brand-mint" aria-hidden="true" />
              {isEn ? "Open to all citizens" : "Terbuka untuk semua warga"}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href={reportHref}
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-mint px-5 text-xs font-bold text-brand-navy shadow-sm transition-all hover:bg-[#68dac5] hover:shadow-md hover:shadow-brand-mint/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint sm:w-auto sm:text-sm"
            >
              <FilePlus2 className="size-4 shrink-0" aria-hidden="true" />
              {resolvedReportLabel}
              <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/chatbot"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10 sm:w-auto sm:text-sm"
            >
              <Bot className="size-4 shrink-0 text-brand-mint" aria-hidden="true" />
              {isEn ? "Ask data assistant" : "Tanya asisten data"}
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-brand-mint">
                  {ticketCode}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/70">
                  {isEn ? "PUBLIC" : "PUBLIK"}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/40 bg-brand-teal/20 px-2 py-0.5 text-[10px] font-semibold text-brand-mint">
                <span className="size-1.5 rounded-full bg-brand-mint animate-pulse" />
                {isEn ? "In Progress" : "Ditindaklanjuti"}
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs font-semibold text-white sm:text-sm">
                {resolvedTicketTitle}
              </p>
              <p className="text-[11px] text-white/60 sm:text-xs">
                {resolvedTicketMeta}
              </p>
            </div>

            <div className="mt-3.5 rounded-lg bg-black/20 p-2.5 sm:p-3">
              <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/50 text-center">
                <span className="truncate text-brand-mint">{isEn ? "1. Sent" : "1. Terkirim"}</span>
                <span className="truncate text-brand-mint">{isEn ? "2. Verified" : "2. Terverifikasi"}</span>
                <span className="truncate text-white/40">{isEn ? "3. Resolved" : "3. Selesai"}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-teal to-brand-mint" />
              </div>
              <p className="mt-2 text-[10px] text-white/50">
                {isEn ? "Response target:" : "Target respon:"}{" "}
                <span className="font-semibold text-white/80">{isEn ? "< 24 business hours" : "< 24 jam kerja"}</span>
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] text-white/60">
              <span className="truncate">{isEn ? "Track history with ticket code" : "Lacak riwayat dengan kode tiket"}</span>
              <Link
                href="/lacak"
                className="inline-flex items-center gap-1 font-semibold text-brand-mint hover:underline shrink-0"
              >
                {isEn ? "Track report" : "Lacak aduan"}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
