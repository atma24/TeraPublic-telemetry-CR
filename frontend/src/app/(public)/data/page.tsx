import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPinned, ShieldCheck, Wallet } from "lucide-react";

import { BudgetExplorer } from "@/components/data/budget-explorer";
import { FacilitiesExplorer } from "@/components/data/facilities-explorer";
import { CivicCtaCard } from "@/components/feedback/civic-cta-card";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { firstParam } from "@/lib/utils";
import type { SearchParams } from "@/types/api";

export const metadata: Metadata = {
  title: "Data Publik",
  description:
    "Telusuri fasilitas publik, aksesibilitas, proyek anggaran, dan realisasi APBD DKI Jakarta.",
};

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tab = firstParam(params.tab) === "anggaran" ? "anggaran" : "fasilitas";

  return (
    <>
      <PageHeader
        eyebrow="Ruang baca data"
        title="Data publik Jakarta"
        description="Mulai dari satu fasilitas, satu kecamatan, atau satu proyek. Setiap tampilan menyimpan jejak ke sumber datanya."
        breadcrumbs={[{ label: "Data publik" }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/tentang" variant="secondary" size="sm">
              Sumber & metodologi
            </ButtonLink>
            <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
              <ShieldCheck className="size-3.5 text-interactive" aria-hidden="true" />
              Sinkronisasi LPSE & BPS 2026
            </span>
          </div>
        }
        widget={
          <div className="w-full rounded-2xl border border-border/80 bg-surface/95 p-4 shadow-soft backdrop-blur-md transition-all duration-300 hover:border-interactive/35">
            {/* Widget Top Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                  Cakupan Data Terbuka
                </span>
              </div>
              <span className="rounded-full bg-interactive/10 px-2.5 py-0.5 text-[10px] font-bold text-interactive">
                DKI Jakarta
              </span>
            </div>

            {/* 3 Metrics Perfectly Aligned in One Horizontal Row */}
            <div className="mt-3.5 grid grid-cols-3 divide-x divide-border/60">
              <div className="flex flex-col items-center px-2 text-center sm:px-3">
                <span className="mb-1.5 flex size-8 items-center justify-center rounded-lg bg-interactive/10 text-interactive transition-colors hover:bg-interactive hover:text-white">
                  <Building2 className="size-4" aria-hidden="true" />
                </span>
                <span className="font-display text-base font-bold tracking-tight text-text sm:text-lg">
                  214
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Fasilitas
                </span>
                <span className="text-[9px] text-muted/70">
                  Sekolah & Pasar
                </span>
              </div>

              <div className="flex flex-col items-center px-2 text-center sm:px-3">
                <span className="mb-1.5 flex size-8 items-center justify-center rounded-lg bg-interactive/10 text-interactive transition-colors hover:bg-interactive hover:text-white">
                  <MapPinned className="size-4" aria-hidden="true" />
                </span>
                <span className="font-display text-base font-bold tracking-tight text-text sm:text-lg">
                  44
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Kecamatan
                </span>
                <span className="text-[9px] text-muted/70">
                  Wilayah BPS
                </span>
              </div>

              <div className="flex flex-col items-center px-2 text-center sm:px-3">
                <span className="mb-1.5 flex size-8 items-center justify-center rounded-lg bg-interactive/10 text-interactive transition-colors hover:bg-interactive hover:text-white">
                  <Wallet className="size-4" aria-hidden="true" />
                </span>
                <span className="font-display text-base font-bold tracking-tight text-text sm:text-lg">
                  1.731
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Paket APBD
                </span>
                <span className="text-[9px] text-muted/70">
                  Proyek Fisik
                </span>
              </div>
            </div>
          </div>
        }
      >
        <div
          className="inline-flex rounded-xl border border-border/80 bg-surface-2/80 p-1.5 shadow-2xs backdrop-blur-sm"
          role="tablist"
          aria-label="Jenis data"
        >
          <Link
            href="/data"
            role="tab"
            aria-selected={tab === "fasilitas"}
            className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all duration-200 ${
              tab === "fasilitas"
                ? "bg-surface text-text shadow-xs font-bold"
                : "text-muted hover:text-text hover:bg-surface/50"
            }`}
          >
            <Building2 className={`size-3.5 ${tab === "fasilitas" ? "text-interactive" : "text-muted"}`} />
            Fasilitas & Akses
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                tab === "fasilitas" ? "bg-interactive/10 text-interactive" : "bg-surface-2 text-muted"
              }`}
            >
              214
            </span>
          </Link>
          <Link
            href="/data?tab=anggaran"
            role="tab"
            aria-selected={tab === "anggaran"}
            className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all duration-200 ${
              tab === "anggaran"
                ? "bg-surface text-text shadow-xs font-bold"
                : "text-muted hover:text-text hover:bg-surface/50"
            }`}
          >
            <Wallet className={`size-3.5 ${tab === "anggaran" ? "text-interactive" : "text-muted"}`} />
            Anggaran & Proyek
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                tab === "anggaran" ? "bg-interactive/10 text-interactive" : "bg-surface-2 text-muted"
              }`}
            >
              1.731
            </span>
          </Link>
        </div>
      </PageHeader>

      {tab === "anggaran" ? (
        <BudgetExplorer searchParams={params} />
      ) : (
        <FacilitiesExplorer searchParams={params} />
      )}

      <section className="container-page pb-16 pt-6">
        <CivicCtaCard />
      </section>
    </>
  );
}
