import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPinned, Wallet } from "lucide-react";

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
          <ButtonLink href="/tentang" variant="secondary" size="sm">
            Sumber & metodologi
          </ButtonLink>
        }
        widget={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-surface/90 px-3.5 py-2.5 shadow-2xs backdrop-blur-md">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                <Building2 className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 pr-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Fasilitas</p>
                <p className="font-display text-sm font-bold text-text">214 Lokasi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-surface/90 px-3.5 py-2.5 shadow-2xs backdrop-blur-md">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                <MapPinned className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 pr-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Kecamatan</p>
                <p className="font-display text-sm font-bold text-text">44 Wilayah</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-surface/90 px-3.5 py-2.5 shadow-2xs backdrop-blur-md">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                <Wallet className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 pr-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Paket APBD</p>
                <p className="font-display text-sm font-bold text-text">1.731 Proyek</p>
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
