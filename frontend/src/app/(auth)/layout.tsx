import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BarChart3, MapPinned, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SITE_TAGLINE, TEAM_NAME } from "@/lib/constants";

const points = [
  { icon: MapPinned, text: "Telusuri fasilitas dan pemerataan akses per kecamatan." },
  { icon: BarChart3, text: "Baca anggaran, realisasi, dan prioritas wilayah." },
  { icon: ShieldCheck, text: "Kirim aduan dengan kode pelacakan yang jelas." },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden bg-brand-navy p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="paper-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-24 size-96 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -bottom-20 -right-12 size-64 rounded-full border border-white/10" aria-hidden="true" />

        <div className="relative">
          <Logo href="/" imageClassName="h-10" tone="inverse" />
          <p className="mt-16 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-mint">
            {SITE_TAGLINE}
          </p>
          <h1 className="mt-4 max-w-md font-display text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-white xl:text-5xl">
            Data publik yang bisa dibaca semua orang.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Masuk untuk mengirim aduan, memantau tindak lanjut, dan bertanya pada asisten data
            TeraPublic.
          </p>
        </div>

        <ul className="relative mt-14 space-y-4">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.text} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/5 text-brand-mint">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span className="max-w-xs text-xs leading-relaxed text-white/70">{point.text}</span>
              </li>
            );
          })}
        </ul>

        <p className="relative mt-14 text-[10px] text-white/40">
          Data ditampilkan dari layanan TeraPublic · Inisiatif {TEAM_NAME}. Verifikasi dokumen resmi untuk keputusan formal.
        </p>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <Logo href="/" compact />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-start justify-center px-5 py-10 sm:px-8 md:py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-text"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
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
