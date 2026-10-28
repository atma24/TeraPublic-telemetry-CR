import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accessibility,
  Bath,
  Building2,
  Bus,
  Footprints,
  Landmark,
  MapPin,
  MessageSquare,
  Users,
  Wallet,
} from "lucide-react";

import { FacilityMapClient } from "@/components/map/facility-map-dynamic";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState } from "@/components/ui/states";
import { getFacility } from "@/lib/api/public";
import { isApiError } from "@/lib/api/client";
import { FACILITY_STATUS, PROJECT_STATUS } from "@/lib/constants";
import {
  formatArea,
  formatCompactRupiah,
  formatDate,
  formatNumber,
  formatPercent,
  formatRupiah,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PublicFacility } from "@/types/public";

const statusTone: Record<PublicFacility["status"], BadgeTone> = {
  operational: "success",
  renovation: "warning",
  closed: "danger",
};

const projectTone: Record<string, BadgeTone> = {
  planning: "neutral",
  procurement: "info",
  tender: "info",
  in_progress: "warning",
  completed: "success",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await getFacility(id);
    const facility = response.data;
    return {
      title: facility.name,
      description: `${facility.category?.name ?? "Fasilitas publik"} di ${facility.region?.name ?? "DKI Jakarta"}. Lihat kapasitas, aksesibilitas, dan proyek anggaran terkait.`,
    };
  } catch {
    return { title: "Detail Fasilitas" };
  }
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let facility: PublicFacility;
  try {
    const response = await getFacility(id);
    facility = response.data;
  } catch (error) {
    if (isApiError(error) && error.status === 404) notFound();
    return (
      <>
        <PageHeader
          eyebrow="Fasilitas publik"
          title="Detail fasilitas"
          breadcrumbs={[{ label: "Data publik", href: "/data" }, { label: "Detail fasilitas" }]}
        />
        <div className="container-page py-8 md:py-10">
          <ErrorState
            title="Detail fasilitas belum dapat dimuat"
            description="Layanan data tidak merespons atau data sedang tidak tersedia. Coba kembali beberapa saat lagi."
            action={
              <ButtonLink href="/data" variant="secondary" size="sm">
                Kembali ke direktori
              </ButtonLink>
            }
          />
        </div>
      </>
    );
  }

  const status = FACILITY_STATUS[facility.status] ?? { label: facility.status, tone: "neutral" };
  const projects = facility.budgetProjects ?? facility.budget_projects ?? [];
  const feedbacks = facility.feedbacks ?? [];
  const totalAllocated = projects.reduce((sum, project) => sum + Number(project.budget_allocated), 0);
  const totalRealized = projects.reduce((sum, project) => sum + Number(project.budget_realized), 0);
  const accessCount = [
    facility.has_wheelchair_ramp,
    facility.has_tactile_paving,
    facility.has_disabled_toilet,
  ].filter(Boolean).length;
  const resolvedFeedbacks = feedbacks.filter((feedback) => feedback.status === "resolved").length;

  return (
    <>
      <PageHeader
        eyebrow={facility.category?.name ?? "Fasilitas publik"}
        title={facility.name}
        description={
          facility.address
            ? facility.address
            : `${facility.region?.name ?? "DKI Jakarta"}${facility.region?.city ? `, ${facility.region.city}` : ""}`
        }
        breadcrumbs={[
          { label: "Data publik", href: "/data" },
          { label: "Fasilitas", href: "/data" },
          { label: facility.name },
        ]}
        actions={
          <>
            <ButtonLink href={`/aduan/buat?fasilitas=${facility.id}`} size="sm">
              <MessageSquare className="size-3.5" aria-hidden="true" />
              Laporkan masalah
            </ButtonLink>
            <ButtonLink href="/data" variant="secondary" size="sm">
              Semua fasilitas
            </ButtonLink>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={statusTone[facility.status]}>{status.label}</Badge>
          <Badge tone="outline">{facility.is_state_owned ? "Milik negara" : "Swasta"}</Badge>
          {facility.npsn ? <Badge tone="outline">NPSN {facility.npsn}</Badge> : null}
          {facility.sub_category ? <Badge tone="outline">{facility.sub_category}</Badge> : null}
        </div>
      </PageHeader>

      <div className="container-page py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <section className="rounded-lg border border-border bg-surface">
              <div className="border-b border-border px-5 py-3.5">
                <h2 className="font-display text-sm font-semibold text-text">Profil aksesibilitas</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  {accessCount} dari 3 atribut dukungan akses tercatat pada data sumber.
                </p>
              </div>
              <div className="grid gap-px bg-border sm:grid-cols-3">
                <AccessItem
                  icon={Accessibility}
                  label="Ramp kursi roda"
                  active={facility.has_wheelchair_ramp}
                />
                <AccessItem
                  icon={Footprints}
                  label="Ubin pemandu"
                  active={facility.has_tactile_paving}
                />
                <AccessItem
                  icon={Bath}
                  label="Toilet disabilitas"
                  active={facility.has_disabled_toilet}
                />
              </div>
              <div className="grid gap-4 border-t border-border p-5 sm:grid-cols-2">
                <DataRow icon={Users} label="Kapasitas" value={`${formatNumber(facility.capacity)} orang`} />
                <DataRow
                  icon={Building2}
                  label="Kepemilikan"
                  value={facility.is_state_owned ? "Milik negara" : "Swasta"}
                />
                <DataRow
                  icon={MapPin}
                  label="Wilayah"
                  value={`${facility.region?.name ?? "—"}${facility.region?.city ? `, ${facility.region.city}` : ""}`}
                />
                <DataRow
                  icon={Bus}
                  label="Transportasi umum"
                  value={facility.public_transport_nearby || "Tidak tercatat"}
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                <div>
                  <h2 className="font-display text-sm font-semibold text-text">Lokasi</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Koordinat {Number(facility.latitude).toFixed(5)}, {Number(facility.longitude).toFixed(5)}
                  </p>
                </div>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${facility.latitude}&mlon=${facility.longitude}#map=17/${facility.latitude}/${facility.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-semibold text-interactive hover:underline"
                >
                  Buka di OpenStreetMap →
                </a>
              </div>
              <FacilityMapClient
                facilities={[facility]}
                height={360}
                ariaLabel={`Lokasi ${facility.name}`}
              />
            </section>

            <section className="rounded-lg border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <div>
                  <h2 className="font-display text-sm font-semibold text-text">Proyek anggaran terkait</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {projects.length > 0
                      ? `${formatNumber(projects.length)} proyek · ${formatPercent(totalAllocated > 0 ? (totalRealized / totalAllocated) * 100 : 0)} realisasi`
                      : "Belum ada proyek yang tertaut ke fasilitas ini."}
                  </p>
                </div>
                {projects.length > 0 ? (
                  <div className="text-right">
                    <p className="tabular text-sm font-bold text-text">{formatCompactRupiah(totalAllocated)}</p>
                    <p className="text-[10px] text-muted">total alokasi</p>
                  </div>
                ) : null}
              </div>

              {projects.length > 0 ? (
                <div className="divide-y divide-border">
                  {projects.map((project) => (
                    <article key={project.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold leading-snug text-text">
                            {project.project_name}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-muted">
                            {project.fiscal_year} · {project.funding_source}
                            {project.contractor_name ? ` · ${project.contractor_name}` : ""}
                          </p>
                        </div>
                        <Badge tone={projectTone[project.status] ?? "neutral"}>
                          {PROJECT_STATUS[project.status]?.label ?? project.status}
                        </Badge>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <MiniMetric label="Alokasi" value={formatRupiah(project.budget_allocated)} />
                        <MiniMetric label="Realisasi" value={formatRupiah(project.budget_realized)} />
                        <MiniMetric label="Progres fisik" value={formatPercent(project.progress_percentage, 0)} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted">
                        <span>Mulai {formatDate(project.start_date)}</span>
                        <span>Target {formatDate(project.target_completion_date)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Wallet className="size-3" aria-hidden="true" />
                          {project.funding_source}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-center text-xs text-muted">
                  Data proyek untuk fasilitas ini belum tersedia.
                </div>
              )}
            </section>

            <section className="rounded-lg border border-border bg-surface px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-sm font-semibold text-text">Laporan warga</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {formatNumber(feedbacks.length)} laporan tercatat · {formatNumber(resolvedFeedbacks)} selesai
                  </p>
                </div>
                <Link
                  href={`/aduan/buat?fasilitas=${facility.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                >
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  Buat laporan
                </Link>
              </div>
              <p className="mt-3 border-t border-border pt-3 text-[10px] leading-relaxed text-muted">
                Halaman publik hanya menampilkan jumlah agregat. Identitas dan isi laporan warga tidak
                ditampilkan untuk melindungi privasi pelapor.
              </p>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-display text-sm font-semibold text-text">Wilayah</h2>
              <p className="mt-1 text-lg font-display font-bold tracking-[-0.03em] text-text">
                {facility.region?.name ?? "Tidak diketahui"}
              </p>
              <p className="text-[11px] text-muted">{facility.region?.city ?? "DKI Jakarta"}</p>

              <dl className="mt-4 space-y-2.5 border-t border-border pt-4">
                <SidebarRow label="Penduduk" value={formatNumber(facility.region?.population)} />
                <SidebarRow label="Luas" value={formatArea(facility.region?.area_km2)} />
                <SidebarRow label="Kode wilayah" value={facility.region?.code ?? "—"} />
              </dl>

              <Link
                href={`/data?region_id=${facility.region_id}`}
                className="mt-4 inline-flex text-[11px] font-semibold text-interactive hover:underline"
              >
                Lihat fasilitas di kecamatan ini →
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-surface-2/60 p-5">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                <Landmark className="size-3.5" aria-hidden="true" />
                Catatan data
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Data fasilitas, kapasitas, dan akses mengikuti sumber sektor. Kondisi lapangan dapat
                berbeda. Gunakan tombol laporan jika menemukan ketidaksesuaian.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function AccessItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Accessibility;
  label: string;
  active: boolean;
}) {
  return (
    <div className={cn("p-5", active ? "bg-success/5" : "bg-surface")}>
      <span
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-md",
          active ? "bg-success/10 text-success" : "bg-surface-2 text-muted",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xs font-semibold text-text">{label}</p>
      <p className={cn("mt-1 text-[10px] font-semibold", active ? "text-success" : "text-muted")}>
        {active ? "Tercatat tersedia" : "Tidak tercatat"}
      </p>
    </div>
  );
}

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-2 text-muted">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
        <p className="mt-0.5 text-xs text-text">{value}</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-2/60 px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="tabular mt-0.5 text-[11px] font-semibold text-text">{value}</p>
    </div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="tabular text-[11px] font-semibold text-text">{value}</dd>
    </div>
  );
}
