import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Search,
  ShieldCheck,
  Store,
} from "lucide-react";

import { CivicCtaCard } from "@/components/feedback/civic-cta-card";
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
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/data" size="sm">
              Buka direktori
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/aduan/buat" variant="secondary" size="sm">
              Laporkan masalah
            </ButtonLink>
          </div>
        }
        widget={
          <div className="rounded-xl border border-border/80 bg-surface/90 p-4 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <ShieldCheck className="size-3.5 text-interactive" />
                Dukungan Akses Disabilitas
              </span>
              <span className="rounded-full bg-interactive/10 px-2 py-0.5 text-[10px] font-bold text-interactive">
                58.4% Terdata
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-center flex-1">
                <p className="text-[9px] font-semibold text-muted">Ramp Akses</p>
                <p className="font-display text-xs font-bold text-text">106 Lokasi</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-center flex-1">
                <p className="text-[9px] font-semibold text-muted">Ubin Pemandu</p>
                <p className="font-display text-xs font-bold text-text">18 Jalur</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-center flex-1">
                <p className="text-[9px] font-semibold text-muted">Toilet Difabel</p>
                <p className="font-display text-xs font-bold text-text">86 Unit</p>
              </div>
            </div>
          </div>
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
          <div className="mt-6 grid gap-4 rounded-xl border border-border bg-surface p-6 shadow-2xs sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-interactive/10 p-2.5 text-interactive">
                <Search className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Total fasilitas</p>
                <p className="tabular mt-1 font-display text-2xl font-bold text-text">
                  {formatNumber(overview.kpis.total_facilities)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">Terdaftar di DKI Jakarta</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-t border-border/60 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div className="rounded-lg bg-success/10 p-2.5 text-success">
                <Accessibility className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Aksesibilitas</p>
                <p className="tabular mt-1 font-display text-2xl font-bold text-text">
                  {formatPercent(overview.kpis.accessibility_percentage)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">Memiliki atribut inklusi</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-t border-border/60 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div className="rounded-lg bg-highlight/15 p-2.5 text-highlight">
                <Store className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Kecamatan</p>
                <p className="tabular mt-1 font-display text-2xl font-bold text-text">
                  {formatNumber(overview.kpis.total_districts)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">Cakupan wilayah layanan</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-highlight/30 bg-highlight/8 px-5 py-4 text-xs leading-relaxed text-muted">
            Ringkasan jumlah fasilitas belum dapat dimuat. Direktori tetap dapat dibuka jika layanan data
            kembali tersedia.
          </div>
        )}

        <section className="mt-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
            <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
            Alur sederhana
          </div>
          <h2 className="display-3 mt-3 text-text">Dari mencari sampai melapor</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Step
              number="01"
              icon={Search}
              title="Cari fasilitas"
              body="Gunakan nama, alamat, kategori, atau kecamatan untuk menemukan fasilitas dengan cepat."
            />
            <Step
              number="02"
              icon={Accessibility}
              title="Periksa akses"
              body="Lihat atribut ramp kursi roda, ubin pemandu (tactile), dan toilet ramah disabilitas yang tercatat."
            />
            <Step
              number="03"
              icon={MessageSquare}
              title="Laporkan temuan"
              body="Kirim aduan dengan lokasi dan uraian yang jelas, lalu pantau kode pelacakannya secara real-time."
            />
          </div>
        </section>

        <section className="mt-14">
          <CivicCtaCard />
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
    <article className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:border-interactive/45 hover:shadow-lift">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-interactive/5 blur-2xl transition-all duration-300 group-hover:bg-interactive/10" aria-hidden="true" />
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-interactive/10 text-interactive transition-colors duration-200 group-hover:bg-interactive group-hover:text-white">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div className="text-right">
            <p className="tabular font-display text-3xl font-bold leading-none text-text">
              {count !== null ? formatNumber(count) : "—"}
            </p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">fasilitas terdata</p>
          </div>
        </div>
        <h2 className="mt-6 font-display text-xl font-bold tracking-[-0.03em] text-text">{title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted">{description}</p>
      </div>

      <div className="mt-6 border-t border-border/70 pt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted">
            {accessible !== null ? (
              <span className="font-semibold text-success">{formatNumber(accessible)} fasilitas</span>
            ) : (
              "Data akses"
            )}{" "}
            beraksesibilitas
          </span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 font-semibold text-interactive transition-colors group-hover:text-interactive-strong"
          >
            {cta}
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
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
    <div className="card-hover group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:border-interactive/35">
      <div className="flex items-center justify-between">
        <span className="tabular inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-surface-2 text-[11px] font-bold text-text group-hover:border-interactive/30 group-hover:bg-interactive/10 group-hover:text-interactive">
          {number}
        </span>
        <Icon className="size-4 text-muted transition-colors duration-200 group-hover:text-interactive" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-base font-semibold text-text">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}
