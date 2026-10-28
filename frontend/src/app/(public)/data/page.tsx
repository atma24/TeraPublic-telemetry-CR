import type { Metadata } from "next";
import Link from "next/link";

import { BudgetExplorer } from "@/components/data/budget-explorer";
import { FacilitiesExplorer } from "@/components/data/facilities-explorer";
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
      >
        <div
          className="inline-flex rounded-md border border-border bg-bg p-1"
          role="tablist"
          aria-label="Jenis data"
        >
          <Link
            href="/data"
            role="tab"
            aria-selected={tab === "fasilitas"}
            className={`inline-flex h-8 items-center rounded-sm px-3 text-[11px] font-semibold transition-colors ${
              tab === "fasilitas" ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
            }`}
          >
            Fasilitas & akses
          </Link>
          <Link
            href="/data?tab=anggaran"
            role="tab"
            aria-selected={tab === "anggaran"}
            className={`inline-flex h-8 items-center rounded-sm px-3 text-[11px] font-semibold transition-colors ${
              tab === "anggaran" ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text"
            }`}
          >
            Anggaran & proyek
          </Link>
        </div>
      </PageHeader>

      {tab === "anggaran" ? (
        <BudgetExplorer searchParams={params} />
      ) : (
        <FacilitiesExplorer searchParams={params} />
      )}
    </>
  );
}
