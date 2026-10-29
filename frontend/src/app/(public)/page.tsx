import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  Database,
  FilePlus2,
  Landmark,
  Layers,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { FacilityMapClient } from "@/components/map/facility-map-dynamic";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardOverview, getFacilities, getRegionsGeoJSON } from "@/lib/api/public";
import { SITE_TAGLINE } from "@/lib/constants";
import { formatCompactRupiah, formatDecimal, formatNumber, formatPercent } from "@/lib/format";

const readingRooms = [
  {
    number: "01",
    title: "Fasilitas & akses",
    description:
      "Telusuri sekolah dan pasar tradisional, lalu lihat apakah bangunannya ramah bagi pengguna kursi roda dan disabilitas.",
    href: "/data",
    action: "Buka direktori",
    icon: MapPinned,
  },
  {
    number: "02",
    title: "Anggaran & proyek",
    description:
      "Bandingkan alokasi dengan realisasi, lacak proyek per wilayah, dan temukan daerah yang perlu perhatian lebih awal.",
    href: "/data?tab=anggaran",
    action: "Telusuri anggaran",
    icon: Wallet,
  },
  {
    number: "03",
    title: "Suara warga",
    description:
      "Laporkan kerusakan atau hambatan akses. Setiap laporan mendapat kode pelacakan dan ruang tindak lanjut.",
    href: "/aduan/buat",
    action: "Kirim aduan",
    icon: MessageSquare,
  },
];

export default async function LandingPage() {
  const [overviewResult, facilitiesResult, regionsResult] = await Promise.allSettled([
    getDashboardOverview(),
    getFacilities({ per_page: 100, page: 1 }),
    getRegionsGeoJSON(),
  ]);

  const overview = overviewResult.status === "fulfilled" ? overviewResult.value.data : null;
  const facilities = facilitiesResult.status === "fulfilled" ? facilitiesResult.value.data : [];
  const regions = regionsResult.status === "fulfilled" ? regionsResult.value : null;
  const isOnline = overview !== null;

  const today = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="paper-grid absolute inset-0 opacity-45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-16 size-[550px] rounded-full bg-interactive/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 size-[420px] rounded-full bg-brand-mint/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page relative grid gap-12 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-interactive/20 bg-interactive/5 px-3 py-1 text-xs font-semibold text-interactive backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-interactive opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-interactive" />
              </span>
              Data terbuka · DKI Jakarta
            </div>

            {/* Judul awal tetap dipertahankan sesuai permintaan */}
            <h1 className="display-1 mt-6 max-w-[13ch] text-text">
              Fasilitas publik yang <span className="text-interactive">terlihat.</span> Anggaran yang bisa
              ditelusuri.
            </h1>

            <p className="lede mt-6 max-w-xl text-base md:text-lg">
              TeraPublic menyatukan data fasilitas pendidikan dan pasar, proyek anggaran, serta suara warga
              dalam satu ruang baca yang bisa diperiksa.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink
                href="/data"
                size="lg"
                className="group shadow-md shadow-interactive/15 transition-all hover:shadow-lg hover:shadow-interactive/25"
              >
                Jelajahi data
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/layanan-publik" variant="secondary" size="lg" className="hover:border-interactive/40">
                Lihat layanan
              </ButtonLink>
            </div>

            {/* Akses Cepat Kategori */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Akses Cepat:</span>
              <Link
                href="/data?category=sekolah"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Building2 className="size-3 text-interactive" />
                Sekolah
              </Link>
              <Link
                href="/data?category=pasar-tradisional"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Landmark className="size-3 text-interactive" />
                Pasar Tradisional
              </Link>
              <Link
                href="/data?tab=anggaran"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Wallet className="size-3 text-interactive" />
                1.731 Proyek APBD
              </Link>
              <Link
                href="/insight"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Sparkles className="size-3 text-interactive" />
                Klaster Wilayah
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-interactive" aria-hidden="true" />
                Sumber data terverifikasi (APBD & BPS)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-interactive" aria-hidden="true" />
                Partisipasi warga transparan
              </span>
              <span className="uppercase tracking-[0.14em] text-[10px] font-semibold text-muted">
                {SITE_TAGLINE}
              </span>
            </div>
          </div>

          {/* Hero Right Widget - Animated Civic Ledger Card */}
          <Reveal delay={80} className="lg:pl-4">
            <div className="animate-float-soft relative">
              <div className="card-hover overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-1 shadow-lift backdrop-blur-md">
                <div className="rounded-xl border border-border bg-surface">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-2/40">
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-success" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                        TERAPUBLIC / RINGKASAN DATA
                      </span>
                    </div>
                    <span className="tabular text-[10px] font-medium text-muted">{today}</span>
                  </div>

                  {isOnline ? (
                    <>
                      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                        <LedgerMetric
                          label="Fasilitas terdata"
                          value={formatNumber(overview.kpis.total_facilities)}
                          hint={`${formatNumber(overview.kpis.total_districts)} kecamatan`}
                        />
                        <LedgerMetric
                          label="Aksesibilitas"
                          value={formatPercent(overview.kpis.accessibility_percentage)}
                          hint={`${formatNumber(overview.kpis.accessible_facilities)} fasilitas ramah akses`}
                        />
                        <LedgerMetric
                          label="Alokasi APBD"
                          value={formatCompactRupiah(overview.kpis.total_budget_allocated)}
                          hint={`Realisasi ${formatPercent(overview.kpis.realization_percentage)}`}
                        />
                        <LedgerMetric
                          label="Aduan warga"
                          value={formatNumber(overview.kpis.total_citizen_feedbacks)}
                          hint={`${formatNumber(overview.kpis.resolved_citizen_feedbacks)} ditangani`}
                        />
                      </div>

                      <div className="px-4 py-4 bg-surface">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                            Kecamatan titik perhatian
                          </p>
                          <Link
                            href="/insight"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-interactive hover:underline"
                          >
                            Semua wilayah
                            <ArrowUpRight className="size-3" aria-hidden="true" />
                          </Link>
                        </div>
                        <ol className="mt-3 space-y-2.5">
                          {overview.top_underserved.slice(0, 3).map((metric, index) => (
                            <li key={metric.id} className="flex items-center gap-3">
                              <span className="tabular text-[10px] font-bold text-muted">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-text">
                                {metric.region?.name ?? `Wilayah ${metric.region_id}`}
                              </span>
                              <span className="tabular text-[10px] text-muted">
                                {formatNumber(metric.ratio_per_10k_population)} / 10rb jiwa
                              </span>
                            </li>
                          ))}
                          {overview.top_underserved.length === 0 ? (
                            <li className="text-xs text-muted">Tidak ada wilayah prioritas pada data ini.</li>
                          ) : null}
                        </ol>
                      </div>
                    </>
                  ) : (
                    <div className="px-5 py-10">
                      <p className="text-sm font-semibold text-text">Ringkasan belum tersedia</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        Layanan data sedang tidak merespons. Halaman publik lain tetap dapat dibuka, dan
                        angka akan muncul setelah koneksi data pulih.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border bg-surface-2/60 px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-muted">
                      <span
                        className={`size-1.5 rounded-full ${isOnline ? "bg-success" : "bg-danger"}`}
                        aria-hidden="true"
                      />
                      {isOnline ? "Terhubung ke API Backend Terbuka" : "Layanan data offline"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-interactive/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-interactive">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. STATS RIBBON BANNER */}
      {overview ? (
        <section className="border-b border-border bg-surface-2/40 py-5">
          <div className="container-page">
            <div className="grid grid-cols-2 gap-4 divide-y divide-border/60 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-border/60">
              <div className="flex items-center gap-3 px-2 pt-2 sm:pt-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <Building2 className="size-4" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-text">
                    {formatNumber(overview.kpis.total_facilities)}
                  </p>
                  <p className="text-[11px] text-muted">Fasilitas Publik Terdata</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2 sm:px-4 sm:pt-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-text">
                    {formatPercent(overview.kpis.accessibility_percentage)}
                  </p>
                  <p className="text-[11px] text-muted">Aksesibilitas Ramah</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2 sm:px-4 sm:pt-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <Wallet className="size-4" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-text">
                    {formatCompactRupiah(overview.kpis.total_budget_allocated)}
                  </p>
                  <p className="text-[11px] text-muted">Alokasi APBD 2024–2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2 sm:px-4 sm:pt-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <MapPinned className="size-4" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-text">
                    {formatNumber(overview.kpis.total_districts)} Kecamatan
                  </p>
                  <p className="text-[11px] text-muted">Cakupan Seluruh Jakarta</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. TIGA RUANG BACA (Pillars) */}
      <section className="section-tight border-b border-border bg-bg">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-3">
            {readingRooms.map((room, index) => {
              const Icon = room.icon;
              return (
                <Reveal key={room.number} delay={index * 70}>
                  <Link
                    href={room.href}
                    className="card-hover group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-soft transition-all hover:border-interactive/50 hover:shadow-lift"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[2px] w-0 bg-interactive transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="tabular text-[10px] font-bold text-muted">{room.number}</span>
                        <span className="flex size-8 items-center justify-center rounded-md bg-surface-2 text-muted transition-colors group-hover:bg-interactive/10 group-hover:text-interactive">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                      </div>
                      <h2 className="mt-6 font-display text-xl font-bold tracking-[-0.03em] text-text transition-colors group-hover:text-interactive">
                        {room.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{room.description}</p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-interactive">
                      {room.action}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. POTRET HARI INI (KPIs & Map) */}
      <section className="section-y bg-bg">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Potret hari ini"
              title="Yang bisa dibaca dari data"
              description="Angka di bawah berasal langsung dari layanan TeraPublic. Gunakan sebagai pintu masuk, lalu periksa detail per wilayah dan per proyek."
              action={
                <ButtonLink href="/insight" variant="secondary" size="sm" className="hover:border-interactive/40">
                  Baca insight
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </ButtonLink>
              }
            />
          </Reveal>

          {overview ? (
            <>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal>
                  <StatCard
                    label="Fasilitas publik"
                    value={formatNumber(overview.kpis.total_facilities)}
                    hint="Sekolah dan pasar tradisional"
                    icon={Building2}
                    className="card-hover transition-all"
                  />
                </Reveal>
                <Reveal delay={60}>
                  <StatCard
                    label="Aksesibilitas"
                    value={formatPercent(overview.kpis.accessibility_percentage)}
                    hint="Fasilitas dengan dukungan akses"
                    icon={ShieldCheck}
                    tone="accent"
                    className="card-hover transition-all"
                  />
                </Reveal>
                <Reveal delay={120}>
                  <StatCard
                    label="Alokasi anggaran"
                    value={formatCompactRupiah(overview.kpis.total_budget_allocated)}
                    hint={`Realisasi ${formatPercent(overview.kpis.realization_percentage)}`}
                    icon={Wallet}
                    className="card-hover transition-all"
                  />
                </Reveal>
                <Reveal delay={180}>
                  <StatCard
                    label="Wilayah prioritas"
                    value={formatNumber(overview.kpis.underserved_districts)}
                    hint={`Dari ${formatNumber(overview.kpis.total_districts)} kecamatan`}
                    icon={MapPinned}
                    tone="warning"
                    className="card-hover transition-all"
                  />
                </Reveal>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <Reveal>
                  <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                      <div>
                        <h3 className="font-display text-sm font-semibold text-text">Peta jangkauan interaktif</h3>
                        <p className="mt-0.5 text-[11px] text-muted">
                          Warna wilayah menunjukkan indeks pemerataan akses per kecamatan.
                        </p>
                      </div>
                      <Link
                        href="/data"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                      >
                        Peta penuh
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                    <FacilityMapClient
                      facilities={facilities}
                      regions={regions}
                      height={410}
                      ariaLabel="Peta jangkauan fasilitas dan pemerataan wilayah DKI Jakarta"
                    />
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <div className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-soft">
                    <div className="border-b border-border px-5 py-3.5">
                      <h3 className="font-display text-sm font-semibold text-text">Titik perhatian</h3>
                      <p className="mt-0.5 text-[11px] text-muted">Kecamatan dengan akses paling rendah.</p>
                    </div>
                    <div className="flex-1 px-5 py-4">
                      <ol className="space-y-4">
                        {overview.top_underserved.slice(0, 5).map((metric) => {
                          const score = Math.max(0, Math.min(100, Number(metric.equity_index)));
                          return (
                            <li key={metric.id}>
                              <div className="flex items-baseline justify-between gap-3">
                                <span className="truncate text-xs font-semibold text-text">
                                  {metric.region?.name ?? `Wilayah ${metric.region_id}`}
                                </span>
                                <span className="tabular text-[10px] text-muted">
                                  {formatNumber(metric.facility_count)} fasilitas
                                </span>
                              </div>
                              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                                <div
                                  className="h-full rounded-full bg-highlight transition-all duration-700"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <div className="mt-1 flex justify-between text-[10px] text-muted">
                                <span>Indeks {formatDecimal(metric.equity_index)}</span>
                                <span>Rasio {formatNumber(metric.ratio_per_10k_population)} / 10rb</span>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                    <div className="border-t border-border px-5 py-3 bg-surface-2/30">
                      <Link
                        href="/insight"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                      >
                        Lihat analisis pemerataan lengkap
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </div>
            </>
          ) : (
            <Reveal className="mt-10">
              <ErrorState
                title="Ringkasan data belum dapat dimuat"
                description="Frontend tidak dapat menjangkau API Laravel. Nyalakan backend di http://127.0.0.1:8000, lalu muat ulang halaman ini."
                action={
                  <ButtonLink href="/" variant="secondary" size="sm">
                    Muat ulang
                  </ButtonLink>
                }
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* 5. FITUR DATA KOTA ADMINISTRASI (Using city_breakdown from Backend) */}
      {overview?.city_breakdown && overview.city_breakdown.length > 0 ? (
        <section className="section-y border-t border-border bg-surface">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow="Pemerataan Teritorial"
                title="Distribusi data 6 wilayah DKI Jakarta"
                description="Perbandingan alokasi anggaran, persentase penyerapan, dan sebaran fasilitas publik di setiap kota dan kabupaten administrasi."
                action={
                  <ButtonLink href="/data" variant="secondary" size="sm" className="hover:border-interactive/40">
                    Buka data per wilayah
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </ButtonLink>
                }
              />
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overview.city_breakdown.map((city, idx) => (
                <Reveal key={city.city} delay={idx * 50}>
                  <div className="card-hover group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-soft transition-all hover:border-interactive/50 hover:shadow-lift">
                    <div
                      className="absolute inset-x-0 top-0 h-[2px] w-0 bg-gradient-to-r from-brand-teal to-brand-mint transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-text transition-colors group-hover:text-interactive">
                          {city.city}
                        </span>
                        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-semibold text-muted">
                          {city.district_count} Kecamatan
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border/60 py-3">
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Fasilitas
                          </span>
                          <span className="mt-0.5 font-display text-base font-bold text-text">
                            {formatNumber(city.facility_count)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Alokasi APBD
                          </span>
                          <span className="mt-0.5 font-display text-base font-bold text-text">
                            {formatCompactRupiah(city.budget_allocated)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">Tingkat Realisasi</span>
                        <span className="font-bold text-text">{formatPercent(city.realization_rate)}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(4, city.realization_rate))}%` }}
                        />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted">
                        <span>Realisasi: {formatCompactRupiah(city.budget_realized)}</span>
                        <Link
                          href={`/data?search=${encodeURIComponent(city.city.replace("Kota ", "").replace("Kab. ", ""))}`}
                          className="font-semibold text-interactive hover:underline inline-flex items-center gap-0.5"
                        >
                          Lihat detail <ArrowUpRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. CARA MEMBACA (Methodology / Layers) */}
      <section className="border-y border-border bg-surface">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-20">
          <Reveal>
            <p className="eyebrow">Cara membaca</p>
            <h2 className="display-3 mt-3 text-text">Setiap angka punya jejak.</h2>
            <p className="lede mt-4 text-sm">
              TeraPublic tidak mengganti dokumen resmi. Platform ini membantu Anda menemukan pertanyaan yang tepat
              sebelum memeriksa sumber data aslinya.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="divide-y divide-border border-y border-border">
              <ReadingRow
                icon={Database}
                title="Fasilitas"
                body="Nama, lokasi, kapasitas, dan penanda akses dari data sektor pemerintah."
                href="/data"
              />
              <ReadingRow
                icon={Landmark}
                title="Anggaran"
                body="Alokasi APBD, realisasi penyerapan, progres fisik, dan status proyek per tahun."
                href="/data?tab=anggaran"
              />
              <ReadingRow
                icon={Sparkles}
                title="Insight"
                body="Klaster wilayah, prioritas anggaran, dan proyeksi model penyerapan data."
                href="/insight"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. CTA PARTISIPASI WARGA (Bespoke Civic Ticket Architecture) */}
      <section className="section-tight bg-bg">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-[#10273a] via-[#15324b] to-[#0c1e2d] p-6 text-white shadow-xl md:p-10 lg:p-12">
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
                    KANAL PARTISIPASI WARGA
                  </div>

                  <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-[-0.035em] text-white md:text-4xl lg:text-[40px]">
                    Punya temuan di sekitar Anda?{" "}
                    <span className="text-brand-mint">Jadikan data.</span>
                  </h2>

                  <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/75">
                    Laporkan kerusakan fasilitas atau hambatan aksesibilitas di Jakarta. Setiap laporan warga
                    diverifikasi menjadi data terbuka yang dapat dipantau bersama dinas terkait.
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
                      href="/aduan/buat"
                      className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-mint px-5 text-sm font-bold text-brand-navy shadow-sm transition-all hover:bg-[#68dac5] hover:shadow-md hover:shadow-brand-mint/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
                    >
                      <FilePlus2 className="size-4" aria-hidden="true" />
                      Buat aduan sekarang
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
                          #ADU-JKT-8492
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
                        Ubin Pemandu Tunanetra Rusak di Trotoar
                      </p>
                      <p className="text-xs text-white/60">
                        Kec. Menteng, Jakarta Pusat · Fasilitas Pejalan Kaki
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
          </Reveal>
        </div>
      </section>
    </>
  );
}

function LedgerMetric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="p-4 transition-colors hover:bg-surface-2/40">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="tabular mt-1.5 font-display text-xl font-bold tracking-[-0.04em] text-text">{value}</p>
      <p className="mt-1 text-[10px] leading-relaxed text-muted">{hint}</p>
    </div>
  );
}

function ReadingRow({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof Database;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="card-hover group flex items-start gap-4 py-5 px-3 rounded-lg transition-all hover:bg-surface-2/50">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted transition-all group-hover:bg-interactive/10 group-hover:text-interactive group-hover:scale-105">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-semibold text-text group-hover:text-interactive transition-colors">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">{body}</span>
      </span>
      <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-interactive" aria-hidden="true" />
    </Link>
  );
}
