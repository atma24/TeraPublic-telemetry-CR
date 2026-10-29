import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BarChart3, Building2, MapPinned, ShieldCheck, Sparkles, Users, Wallet } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SITE_TAGLINE, TEAM_NAME } from "@/lib/constants";

const points = [
  {
    icon: MapPinned,
    title: "Pemetaan & Akses",
    text: "Telusuri fasilitas sekolah dan pasar per kecamatan serta kondisi akses disabilitas.",
  },
  {
    icon: Wallet,
    title: "Transparansi Anggaran",
    text: "Bandingkan alokasi dan realisasi proyek APBD langsung dari sumber data resmi.",
  },
  {
    icon: ShieldCheck,
    title: "Partisipasi Terverifikasi",
    text: "Kirim aduan warga dan pantau status tindak lanjut dengan kode pelacakan unik.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-[0.95fr_1.05fr]">
      {/* Kolom Kiri: Branding & Civic Atmosphere */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0c1c2b] via-[#15324b] to-[#091724] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        {/* Latar Belakang Animasi & Ambient Grid */}
        <div className="paper-grid absolute inset-0 opacity-[0.08]" aria-hidden="true" />
        <div
          className="animate-orb-drift pointer-events-none absolute -right-24 -top-20 size-[420px] rounded-full bg-brand-mint/15 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="animate-float-soft pointer-events-none absolute -bottom-24 -left-20 size-[380px] rounded-full bg-interactive/20 blur-[100px]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -bottom-36 -right-24 size-96 rounded-full border border-white/[0.07]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -right-12 size-64 rounded-full border border-white/[0.07]" aria-hidden="true" />

        {/* Brand & Headline */}
        <div className="relative z-10 flex flex-col items-start">
          <div className="block pb-6">
            <Logo href="/" imageClassName="h-10" tone="inverse" priority />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-brand-mint/25 bg-brand-mint/10 px-3 py-1 text-xs font-semibold text-brand-mint backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-mint opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-mint" />
            </span>
            <span>Platform Data Terbuka · DKI Jakarta</span>
          </div>

          <h1 className="mt-5 max-w-md font-display text-4xl font-bold leading-[1.1] tracking-[-0.04em] text-white xl:text-5xl">
            Data publik terbuka yang bisa dibaca dan diuji.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Masuk untuk mengirim laporan aduan, memantau proses tindak lanjut, serta berdialog bersama asisten data analitik TeraPublic.
          </p>

          {/* Mini Live Stats Card */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <Building2 className="size-3.5 text-brand-mint" />
              <span className="font-semibold">Fasilitas Publik</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <Wallet className="size-3.5 text-brand-mint" />
              <span className="font-semibold">Proyek APBD</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
              <Users className="size-3.5 text-brand-mint" />
              <span className="font-semibold">Suara Warga</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Glassmorphic */}
        <div className="relative z-10 my-10 space-y-3">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-brand-mint/40 hover:bg-white/[0.07] hover:translate-x-1"
              >
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand-mint/30 bg-brand-mint/15 text-brand-mint transition-colors duration-200 group-hover:bg-brand-mint group-hover:text-brand-navy">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xs font-semibold text-white group-hover:text-brand-mint transition-colors">
                    {point.title}
                  </h2>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/65">
                    {point.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Watermark / Attribution */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-white/45">
          <span>Inisiatif tim {TEAM_NAME}</span>
          <span>© 2026 TeraPublic · Data Publik Jakarta</span>
        </div>
      </aside>

      {/* Kolom Kanan: Form Area */}
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-interactive/8 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-brand-mint/6 blur-3xl" aria-hidden="true" />

        {/* Mobile Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-border/80 bg-surface/80 px-5 py-4 backdrop-blur-md lg:hidden">
          <Logo href="/" compact priority />
          <ThemeToggle />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-8 md:py-14">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/90 px-3.5 py-1.5 text-xs font-semibold text-muted shadow-2xs backdrop-blur-sm transition-all duration-200 hover:border-interactive/40 hover:text-text hover:shadow-xs"
              >
                <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
                Kembali ke beranda
              </Link>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
