import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Search,
  Store,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { getDashboardOverview, getAllFacilities } from "@/lib/api/public";
import { formatNumber, formatPercent } from "@/lib/format";
import type { PublicFacility } from "@/types/public";

export const metadata: Metadata = {
  title: "Layanan & Fasilitas",
  description:
    "Panduan membaca layanan sekolah dan pasar tradisional Jakarta, termasuk aksesibilitas dan cara melaporkan masalah.",
};

export default async function PublicServicesPage() {
  const [facilitiesResult, overviewResult] = await Promise.allSettled([
    getAllFacilities(),
    getDashboardOverview(),
  ]);

  const facilities: PublicFacility[] =
    facilitiesResult.status === "fulfilled" ? facilitiesResult.value : [];
  const overview = overviewResult.status === "fulfilled" ? overviewResult.value.data : null;
  const schools = facilities.filter((facility) => facility.category?.slug === "sekolah");
  const markets = facilities.filter((facility) => facility.category?.slug === "pasar-tradisional");
  const accessible = (items: PublicFacility[]) =>
    items.filter(
      (facility) =>
        facility.has_wheelchair_ramp || facility.has_tactile_paving || facility.has_disabled_toilet,
    ).length;
  const hasData = facilities.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Layanan publik"
        title="Sekolah dan pasar, dibaca lebih dekat"
        description="Temukan fasilitas yang Anda butuhkan, periksa dukungan aksesnya, lalu gunakan data untuk meminta perbaikan."
        breadcrumbs={[{ label: "Layanan & fasilitas" }]}
        actions={
          <ButtonLink href="/data" size="sm">
            Buka direktori
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </ButtonLink>
        }
      />

      <div className="container-page py-8 md:py-12">
        <div className="grid gap-4 md:grid-cols-2">
          <ServiceCard
            icon={GraduationCap}
            title="Sekolah"
            count={hasData ? schools.length : null}
            accessible={hasData ? accessible(schools) : null}
            description="Fasilitas pendidikan dari jenjang dasar hingga menengah. Periksa kapasitas, status, dan dukungan akses fisik."
            href="/data?category=sekolah"
            cta="Cari sekolah"
          />
          <ServiceCard
            icon={Store}
            title="Pasar tradisional"
            count={hasData ? markets.length : null}
            accessible={hasData ? accessible(markets) : null}
            description="Pasar rakyat dan pasar binaan daerah. Lihat lokasi, kapasitas, serta atribut akses yang tercatat."
            href="/data?category=pasar-tradisional"
            cta="Cari pasar"
          />
        </div>

        {overview ? (
          <div className="mt-4 grid gap-3 rounded-lg border border-border bg-surface p-5 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Total fasilitas</p>
              <p className="tabular mt-1 font-display text-2xl font-bold text-text">
                {formatNumber(overview.kpis.total_facilities)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Aksesibilitas</p>
              <p className="tabular mt-1 font-display text-2xl font-bold text-text">
                {formatPercent(overview.kpis.accessibility_percentage)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Kecamatan</p>
              <p className="tabular mt-1 font-display text-2xl font-bold text-text">
                {formatNumber(overview.kpis.total_districts)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-highlight/30 bg-highlight/8 px-5 py-4 text-xs leading-relaxed text-muted">
            Ringkasan jumlah fasilitas belum dapat dimuat. Direktori tetap dapat dibuka jika layanan data
            kembali tersedia.
          </div>
        )}

        <section className="mt-12">
          <p className="eyebrow">Alur sederhana</p>
          <h2 className="display-3 mt-3 text-text">Dari mencari sampai melapor</h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            <Step
              number="01"
              icon={Search}
              title="Cari fasilitas"
              body="Gunakan nama, alamat, kategori, atau kecamatan untuk menemukan fasilitas."
            />
            <Step
              number="02"
              icon={Accessibility}
              title="Periksa akses"
              body="Lihat atribut ramp, ubin pemandu, dan toilet disabilitas yang tercatat."
            />
            <Step
              number="03"
              icon={MessageSquare}
              title="Laporkan temuan"
              body="Kirim aduan dengan lokasi dan uraian yang jelas, lalu pantau kode pelacakannya."
            />
          </div>
        </section>

        <section className="mt-12 grid gap-6 rounded-xl border border-border bg-surface p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-text">
              Fasilitas belum ada di data?
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted">
              Gunakan aduan warga untuk menandai fasilitas yang belum terdata, kondisi rusak, atau hambatan
              akses. Admin dapat menindaklanjuti laporan setelah verifikasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/aduan/buat" size="sm">
              Buat aduan
            </ButtonLink>
            <ButtonLink href="/lacak" variant="secondary" size="sm">
              Lacak aduan
            </ButtonLink>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
            Data fasilitas dari sumber sektor
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
            Laporan warga terlacak
          </span>
          <Link href="/tentang" className="font-semibold text-interactive hover:underline">
            Baca metodologi
          </Link>
        </div>
      </div>
    </>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  count,
  accessible,
  description,
  href,
  cta,
}: {
  icon: typeof GraduationCap;
  title: string;
  count: number | null;
  accessible: number | null;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-interactive/35">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex size-11 items-center justify-center rounded-md bg-interactive/8 text-interactive">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="text-right">
          <p className="tabular font-display text-2xl font-bold leading-none text-text">
            {count !== null ? formatNumber(count) : "—"}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted">fasilitas</p>
        </div>
      </div>
      <h2 className="mt-5 font-display text-xl font-bold tracking-[-0.03em] text-text">{title}</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted">{description}</p>
      <p className="mt-4 text-[11px] text-muted">
        {accessible !== null ? `${formatNumber(accessible)} tercatat memiliki dukungan akses.` : "Data akses belum tersedia."}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-interactive"
      >
        {cta}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

function Step({
  number,
  icon: Icon,
  title,
  body,
}: {
  number: string;
  icon: typeof Search;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="tabular text-[10px] font-bold text-muted">{number}</span>
        <Icon className="size-4 text-muted" aria-hidden="true" />
      </div>
      <h3 className="mt-6 font-display text-sm font-semibold text-text">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}
