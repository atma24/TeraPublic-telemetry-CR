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
  title = "Punya temuan di sekitar Anda?",
  highlightText = "Jadikan data.",
  description = "Laporkan kerusakan fasilitas atau hambatan aksesibilitas di Jakarta. Setiap laporan warga diverifikasi menjadi data terbuka yang dapat dipantau bersama dinas terkait.",
  badgeLabel = `KANAL PARTISIPASI WARGA · ${TEAM_NAME}`,
  reportHref = "/aduan/buat",
  reportLabel = "Buat aduan sekarang",
  ticketCode = "#ADU-JKT-8492",
  ticketTitle = "Ubin Pemandu Tunanetra Rusak di Trotoar",
  ticketMeta = "Kec. Menteng, Jakarta Pusat · Fasilitas Pejalan Kaki",
  className,
}: CivicCtaCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-[#10273a] via-[#15324b] to-[#0c1e2d] p-6 text-white shadow-xl md:p-10 lg:p-12",
        className,
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-mint/70 to-transparent"
        aria-hidden="true"
      />

      <div className="paper-grid absolute inset-0 opacity-[0.05]" aria-hidden="true" />

      <div
        className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-brand-teal/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 size-80 rounded-full bg-brand-mint/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-mint/30 bg-brand-mint/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-mint backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-mint opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-mint" />
            </span>
            {badgeLabel}
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-[-0.035em] text-white md:text-4xl lg:text-[40px]">
            {title} <span className="text-brand-mint">{highlightText}</span>
          </h2>

          <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/75">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand-mint shrink-0" aria-hidden="true" />
              Kode pelacakan unik
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-brand-mint shrink-0" aria-hidden="true" />
              Diverifikasi 1x24 jam
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-brand-mint shrink-0" aria-hidden="true" />
              Terbuka untuk semua warga
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={reportHref}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-mint px-5 text-sm font-bold text-brand-navy shadow-sm transition-all hover:bg-[#68dac5] hover:shadow-md hover:shadow-brand-mint/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
              {reportLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/chatbot"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10"
            >
              <Bot className="size-4 text-brand-mint" aria-hidden="true" />
              Tanya asisten data
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-brand-mint">
                  {ticketCode}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/70">
                  PUBLIK
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/40 bg-brand-teal/20 px-2.5 py-0.5 text-[10px] font-semibold text-brand-mint">
                <span className="size-1.5 rounded-full bg-brand-mint animate-pulse" />
                Ditindaklanjuti
              </span>
            </div>

            <div className="mt-3.5 space-y-1.5">
              <p className="text-sm font-semibold text-white">
                {ticketTitle}
              </p>
              <p className="text-xs text-white/60">
                {ticketMeta}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-black/20 p-3">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
                <span className="text-brand-mint">1. Terkirim</span>
                <span className="text-brand-mint">2. Terverifikasi</span>
                <span className="text-white/40">3. Selesai</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-teal to-brand-mint" />
              </div>
              <p className="mt-2 text-[10px] text-white/50">
                Target respon: <span className="font-semibold text-white/80">&lt; 24 jam kerja</span>
              </p>
            </div>

            <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/60">
              <span>Lacak riwayat dengan kode tiket</span>
              <Link
                href="/lacak"
                className="inline-flex items-center gap-1 font-semibold text-brand-mint hover:underline"
              >
                Lacak aduan
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
