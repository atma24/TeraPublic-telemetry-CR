import Link from "next/link";
import { Building2, Filter, MapPinned, RotateCcw, Search, ShieldCheck } from "lucide-react";

import { FacilityCard } from "@/components/facilities/facility-card";
import { FacilityMapClient } from "@/components/map/facility-map-dynamic";
import { Button, ButtonLink } from "@/components/ui/button";
import { inputClass, selectClass } from "@/components/ui/form";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { StatCard } from "@/components/ui/stat-card";
import {
  getDashboardOverview,
  getFacilities,
  getRegions,
  getRegionsGeoJSON,
} from "@/lib/api/public";
import { formatNumber, formatPercent } from "@/lib/format";
import { firstParam } from "@/lib/utils";
import type { SearchParams } from "@/types/api";
import type { PublicFacility, Region, RegionFeatureCollection } from "@/types/public";

const PER_PAGE = 12;

export async function FacilitiesExplorer({ searchParams }: { searchParams: SearchParams }) {
  const [facilitiesResult, regionsResult, geoResult, overviewResult] = await Promise.allSettled([
    getFacilities({ per_page: 100, page: 1 }).then(async (first) => {
      const lastPage = first.meta.last_page ?? 1;
      if (lastPage <= 1) return first.data;
      const rest = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, index) =>
          getFacilities({ per_page: 100, page: index + 2 }),
        ),
      );
      return [first, ...rest].flatMap((page) => page.data);
    }),
    getRegions(),
    getRegionsGeoJSON(),
    getDashboardOverview(),
  ]);

  if (facilitiesResult.status === "rejected") {
    return (
      <div className="container-page py-8 md:py-10">
        <ErrorState
          title="Direktori fasilitas belum dapat dimuat"
          description="Layanan data TeraPublic tidak merespons. Pastikan backend Laravel aktif, lalu muat ulang halaman."
          action={
            <ButtonLink href="/data" variant="secondary" size="sm">
              Muat ulang
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const facilities = facilitiesResult.value;
  const regions: Region[] = regionsResult.status === "fulfilled" ? regionsResult.value.data : [];
  const geo: RegionFeatureCollection | null =
    geoResult.status === "fulfilled" ? geoResult.value : null;
  const overview = overviewResult.status === "fulfilled" ? overviewResult.value.data : null;

  const q = (firstParam(searchParams.q) ?? "").trim().toLowerCase();
  const category = firstParam(searchParams.category) ?? "";
  const regionId = Number(firstParam(searchParams.region_id) ?? 0);
  const ramp = firstParam(searchParams.ramp) === "1";
  const tactile = firstParam(searchParams.tactile) === "1";
  const toilet = firstParam(searchParams.toilet) === "1";

  const filtered = facilities
    .filter((facility) => {
      if (q) {
        const haystack = `${facility.name} ${facility.address ?? ""} ${facility.region?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category && facility.category?.slug !== category) return false;
      if (regionId && facility.region_id !== regionId) return false;
      if (ramp && !facility.has_wheelchair_ramp) return false;
      if (tactile && !facility.has_tactile_paving) return false;
      if (toilet && !facility.has_disabled_toilet) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "id"));

  const page = Math.max(1, Number(firstParam(searchParams.page) ?? 1));
  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, lastPage);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const accessible = filtered.filter(
    (facility) =>
      facility.has_wheelchair_ramp || facility.has_tactile_paving || facility.has_disabled_toilet,
  ).length;
  const regionCount = new Set(filtered.map((facility) => facility.region_id)).size;
  const hasFilters = Boolean(q || category || regionId || ramp || tactile || toilet);

  const query = {
    q: q || undefined,
    category: category || undefined,
    region_id: regionId ? String(regionId) : undefined,
    ramp: ramp ? "1" : undefined,
    tactile: tactile ? "1" : undefined,
    toilet: toilet ? "1" : undefined,
  };

  return (
    <div className="container-page py-8 md:py-10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Fasilitas terdata"
          value={formatNumber(overview?.kpis.total_facilities ?? facilities.length)}
          hint="Sekolah dan pasar tradisional"
          icon={Building2}
        />
        <StatCard
          label="Aksesibilitas"
          value={formatPercent(overview?.kpis.accessibility_percentage ?? 0)}
          hint="Dukungan akses fisik"
          icon={ShieldCheck}
          tone="accent"
        />
        <StatCard
          label="Wilayah prioritas"
          value={formatNumber(overview?.kpis.underserved_districts ?? 0)}
          hint={`Dari ${formatNumber(overview?.kpis.total_districts ?? regions.length)} kecamatan`}
          icon={MapPinned}
          tone="warning"
        />
        <StatCard
          label="Hasil filter"
          value={formatNumber(filtered.length)}
          hint={hasFilters ? "Fasilitas cocok dengan filter" : "Seluruh fasilitas"}
          icon={Filter}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <form method="get" action="/data" className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-text">
                <Filter className="size-3.5 text-muted" aria-hidden="true" />
                Filter data
              </h2>
              {hasFilters ? (
                <Link
                  href="/data"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-interactive hover:underline"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  Reset
                </Link>
              ) : null}
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label htmlFor="q" className="text-[11px] font-semibold text-text">
                  Cari fasilitas
                </label>
                <div className="relative mt-1.5">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    id="q"
                    name="q"
                    type="search"
                    defaultValue={q}
                    placeholder="Nama atau alamat"
                    className={`${inputClass} h-9 pl-9 text-xs`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="text-[11px] font-semibold text-text">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={category}
                  className={`${selectClass} mt-1.5 h-9 text-xs`}
                >
                  <option value="">Semua kategori</option>
                  <option value="sekolah">Sekolah</option>
                  <option value="pasar-tradisional">Pasar Tradisional</option>
                </select>
              </div>

              <div>
                <label htmlFor="region_id" className="text-[11px] font-semibold text-text">
                  Kecamatan
                </label>
                <select
                  id="region_id"
                  name="region_id"
                  defaultValue={regionId || ""}
                  className={`${selectClass} mt-1.5 h-9 text-xs`}
                >
                  <option value="">Semua kecamatan</option>
                  {regions
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name, "id"))
                    .map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name} — {region.city}
                      </option>
                    ))}
                </select>
              </div>

              <fieldset>
                <legend className="text-[11px] font-semibold text-text">Dukungan akses</legend>
                <div className="mt-2 space-y-2">
                  <CheckRow name="ramp" label="Ramp kursi roda" defaultChecked={ramp} />
                  <CheckRow name="tactile" label="Ubin pemandu (tactile)" defaultChecked={tactile} />
                  <CheckRow name="toilet" label="Toilet disabilitas" defaultChecked={toilet} />
                </div>
              </fieldset>

              <Button type="submit" size="sm" className="w-full">
                Terapkan filter
              </Button>
            </div>
          </form>

          <div className="mt-3 rounded-lg border border-border bg-surface-2/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Ringkasan filter</p>
            <ul className="mt-2 space-y-1.5 text-[11px] text-muted">
              <li className="flex justify-between gap-2">
                <span>Aksesibel</span>
                <span className="tabular font-semibold text-text">{formatNumber(accessible)}</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Kecamatan tercakup</span>
                <span className="tabular font-semibold text-text">{formatNumber(regionCount)}</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Total hasil</span>
                <span className="tabular font-semibold text-text">{formatNumber(filtered.length)}</span>
              </li>
            </ul>
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div>
                <h2 className="font-display text-sm font-semibold text-text">Peta fasilitas</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  {formatNumber(filtered.length)} titik sesuai filter. Warna wilayah menunjukkan indeks pemerataan.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted">
                <span className="size-1.5 rounded-full bg-interactive" aria-hidden="true" />
                Data spasial
              </span>
            </div>
            <FacilityMapClient
              facilities={filtered}
              regions={geo}
              height={440}
              ariaLabel="Peta fasilitas publik sesuai filter"
            />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold tracking-[-0.03em] text-text">
                  Direktori fasilitas
                </h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  Menampilkan {visible.length} dari {formatNumber(filtered.length)} hasil
                  {hasFilters ? " (terfilter)" : ""}.
                </p>
              </div>
              <span className="text-[10px] text-muted">Halaman {safePage} / {lastPage}</span>
            </div>

            {visible.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((facility: PublicFacility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="Tidak ada fasilitas yang cocok"
                description="Coba longgarkan filter, gunakan kata kunci lain, atau reset seluruh filter."
                action={
                  <ButtonLink href="/data" variant="secondary" size="sm">
                    Reset filter
                  </ButtonLink>
                }
              />
            )}

            <Pagination
              basePath="/data"
              currentPage={safePage}
              lastPage={lastPage}
              query={query}
              className="mt-5"
            />
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-[10px] leading-relaxed text-muted">
              Catatan: status akses mengikuti atribut dukungan fisik pada data sumber. Keberadaan ramp,
              ubin pemandu, atau toilet belum tentu berarti fasilitas tersebut sepenuhnya dapat diakses.
              Verifikasi kondisi lapangan tetap diperlukan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckRow({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[11px] text-muted">
      <input
        type="checkbox"
        name={name}
        value="1"
        defaultChecked={defaultChecked}
        className="size-3.5 rounded border-border text-interactive accent-[var(--interactive)]"
      />
      {label}
    </label>
  );
}
