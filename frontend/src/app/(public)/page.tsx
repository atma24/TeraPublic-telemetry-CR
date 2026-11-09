import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Database,
  Landmark,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { FacilityMapClient } from "@/components/map/facility-map-dynamic";
import { CivicJourneyStepper } from "@/components/home/civic-journey-stepper";
import { HeroBadge } from "@/components/home/hero-badge";
import { LiveTelemetryRadar } from "@/components/home/live-telemetry-radar";
import { CivicCtaCard } from "@/components/feedback/civic-cta-card";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardOverview, getFacilities, getRegionsGeoJSON } from "@/lib/api/public";
import { SITE_TAGLINE } from "@/lib/constants";
import { formatCompactRupiah, formatDecimal, formatNumber, formatPercent } from "@/lib/format";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("tp-locale")?.value;
  const isEn = rawLang === "en";

  const [overviewResult, facilitiesResult, regionsResult] = await Promise.allSettled([
    getDashboardOverview(),
    getFacilities({ per_page: 100, page: 1 }),
    getRegionsGeoJSON(),
  ]);

  const overview = overviewResult.status === "fulfilled" ? overviewResult.value.data : null;
  const facilities = facilitiesResult.status === "fulfilled" ? facilitiesResult.value.data : [];
  const regions = regionsResult.status === "fulfilled" ? regionsResult.value : null;
  const isOnline = overview !== null;

  const today = new Intl.DateTimeFormat(isEn ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const readingRooms = [
    {
      number: "01",
      title: isEn ? "Facilities & access" : "Fasilitas & akses",
      description: isEn
        ? "Browse schools and traditional markets, and verify whether buildings accommodate wheelchair users and people with disabilities."
        : "Telusuri sekolah dan pasar tradisional, lalu lihat apakah bangunannya ramah bagi pengguna kursi roda dan disabilitas.",
      href: "/data",
      action: isEn ? "Open directory" : "Buka direktori",
      icon: MapPinned,
    },
    {
      number: "02",
      title: isEn ? "Budgets & projects" : "Anggaran & proyek",
      description: isEn
        ? "Compare allocations with expenditures, track projects by district, and identify areas requiring early attention."
        : "Bandingkan alokasi dengan realisasi, lacak proyek per wilayah, dan temukan daerah yang perlu perhatian lebih awal.",
      href: "/data?tab=anggaran",
      action: isEn ? "Explore budget" : "Telusuri anggaran",
      icon: Wallet,
    },
    {
      number: "03",
      title: isEn ? "Citizen voices" : "Suara warga",
      description: isEn
        ? "Report physical damage or accessibility obstacles. Every submission receives a tracking code and follow-up timeline."
        : "Laporkan kerusakan atau hambatan akses. Setiap laporan mendapat kode pelacakan dan ruang tindak lanjut.",
      href: "/aduan/buat",
      action: isEn ? "Submit report" : "Kirim aduan",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-surface to-surface-2/30">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-interactive/50 to-transparent"
          aria-hidden="true"
        />
        <div className="paper-grid absolute inset-0 opacity-45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-16 size-[280px] rounded-full bg-interactive/10 blur-xl sm:size-[550px] sm:blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 size-[240px] rounded-full bg-brand-mint/10 blur-xl sm:size-[420px] sm:blur-3xl"
          aria-hidden="true"
        />

        {/* Telemetry live header watermark */}
        <div
          className="pointer-events-none absolute right-8 top-6 hidden select-none font-mono text-[9px] uppercase tracking-[0.25em] text-muted/20 lg:block"
          aria-hidden="true"
        >
          {isEn ? "SYS // TERAPUBLIC TELEMETRY LIVE · OPEN DATA" : "SYS // TERAPUBLIC TELEMETRY LIVE"}
        </div>

        <div className="container-page relative grid gap-12 py-14 md:py-20 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-10 xl:gap-14">
          <div>
            <HeroBadge />

            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.035em] text-text sm:mt-6 sm:text-4xl md:text-5xl md:max-w-[14ch] lg:display-1">
              {isEn ? (
                <>
                  Public facilities that are <span className="text-interactive">visible.</span> Budgets that can be traced.
                </>
              ) : (
                <>
                  Fasilitas publik yang <span className="text-interactive">terlihat.</span> Anggaran yang bisa ditelusuri.
                </>
              )}
            </h1>

            <p className="lede mt-6 max-w-xl text-base md:text-lg">
              {isEn
                ? "TeraPublic unifies educational and market facility data, budget projects, and citizen voices in one transparent portal anyone can inspect."
                : "TeraPublic menyatukan data fasilitas pendidikan dan pasar, proyek anggaran, serta suara warga dalam satu ruang baca yang bisa diperiksa."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink
                href="/data"
                size="lg"
                className="group shadow-md shadow-interactive/15 transition-all hover:shadow-lg hover:shadow-interactive/25"
              >
                {isEn ? "Explore data" : "Jelajahi data"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/layanan-publik" variant="secondary" size="lg" className="hover:border-interactive/40">
                {isEn ? "View services" : "Lihat layanan"}
              </ButtonLink>
            </div>

            {/* Akses Cepat Kategori */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5 sm:mt-8">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted mr-0.5">
                {isEn ? "Quick Access:" : "Akses Cepat:"}
              </span>
              <Link
                href="/data?category=sekolah"
                className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Building2 className="size-3 text-interactive" />
                {isEn ? "Schools" : "Sekolah"}
              </Link>
              <Link
                href="/data?category=pasar-tradisional"
                className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Landmark className="size-3 text-interactive" />
                {isEn ? "Traditional Markets" : "Pasar Tradisional"}
              </Link>
              <Link
                href="/data?tab=anggaran"
                className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Wallet className="size-3 text-interactive" />
                {isEn ? "1,731 APBD Projects" : "1.731 Proyek APBD"}
              </Link>
              <Link
                href="/analitik"
                className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text transition-all hover:border-interactive hover:bg-interactive/5 hover:text-interactive"
              >
                <Sparkles className="size-3 text-interactive" />
                {isEn ? "District Clusters" : "Klaster Wilayah"}
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-interactive" aria-hidden="true" />
                {isEn ? "Verified data sources (APBD & BPS)" : "Sumber data terverifikasi (APBD & BPS)"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-interactive" aria-hidden="true" />
                {isEn ? "Transparent citizen participation" : "Partisipasi warga transparan"}
              </span>
              <span className="uppercase tracking-[0.14em] text-[10px] font-semibold text-muted">
                {SITE_TAGLINE}
              </span>
            </div>
          </div>

          {/* Hero Right Widget - Interactive Live Telemetry Radar */}
          <Reveal delay={80} className="lg:pl-4">
            <div className="relative sm:animate-float-soft">
              <LiveTelemetryRadar overview={overview} isOnline={isOnline} isEn={isEn} today={today} />

              {/* Floating Hero Quick Chips */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="size-3.5 text-interactive" aria-hidden="true" />
                  {isEn ? "100% Official BPS & LPSE Data" : "100% Data BPS & LPSE Resmi"}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Sparkles className="size-3.5 text-interactive" aria-hidden="true" />
                  {isEn ? "Integrated ML Intelligence" : "ML Intelligence Terintegrasi"}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. STATS RIBBON BANNER */}
      {overview ? (
        <section className="border-b border-border bg-surface-2/40 py-5">
          <div className="container-page">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4 sm:divide-x sm:divide-border/60">
              <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-surface/60 p-2.5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:px-2">
                <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <Building2 className="size-3.5 sm:size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base sm:text-lg font-bold text-text truncate">
                    {formatNumber(overview.kpis.total_facilities)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted truncate">
                    {isEn ? "Public Facilities" : "Fasilitas Publik"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-surface/60 p-2.5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:px-4">
                <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <ShieldCheck className="size-3.5 sm:size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base sm:text-lg font-bold text-text truncate">
                    {formatPercent(overview.kpis.accessibility_percentage)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted truncate">
                    {isEn ? "Accessibility" : "Aksesibilitas"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-surface/60 p-2.5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:px-4">
                <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <Wallet className="size-3.5 sm:size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base sm:text-lg font-bold text-text truncate">
                    {formatCompactRupiah(overview.kpis.total_budget_allocated)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted truncate">
                    {isEn ? "APBD Allocation" : "Alokasi APBD"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-surface/60 p-2.5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:px-4">
                <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                  <MapPinned className="size-3.5 sm:size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base sm:text-lg font-bold text-text truncate">
                    {formatNumber(overview.kpis.total_districts)} {isEn ? "Dist." : "Kec."}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted truncate">
                    {isEn ? "Across Jakarta" : "Seluruh Jakarta"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. INTERACTIVE CIVIC JOURNEY STEPPER */}
      <CivicJourneyStepper
        overview={overview}
        facilities={facilities}
        regions={regions}
      />

      {/* 4. TIGA RUANG BACA (Pillars) */}
      <section className="section-tight border-b border-border bg-bg">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-3">
            {readingRooms.map((room, index) => {
              const Icon = room.icon;
              return (
                <Reveal key={room.number} delay={index * 70}>
                  <Link
                    href={room.href}
                    className="card-hover group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-xl border border-border bg-surface p-4 sm:p-6 shadow-soft transition-all hover:border-interactive/50 hover:shadow-lift"
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
              eyebrow={isEn ? "Today's snapshot" : "Potret hari ini"}
              title={isEn ? "Insights from the data" : "Yang bisa dibaca dari data"}
              description={
                isEn
                  ? "The figures below come directly from verified TeraPublic services. Use them as an entry point, then explore district and project breakdowns."
                  : "Angka di bawah berasal langsung dari layanan TeraPublic. Gunakan sebagai pintu masuk, lalu periksa detail per wilayah dan per proyek."
              }
              action={
                <ButtonLink href="/analitik" variant="secondary" size="sm" className="hover:border-interactive/40">
                  {isEn ? "Read analytics" : "Baca analitik"}
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
                    label={isEn ? "Public facilities" : "Fasilitas publik"}
                    value={formatNumber(overview.kpis.total_facilities)}
                    hint={isEn ? "Schools and traditional markets" : "Sekolah dan pasar tradisional"}
                    icon={Building2}
                    className="card-hover transition-all"
                  />
                </Reveal>
                <Reveal delay={60}>
                  <StatCard
                    label={isEn ? "Accessibility" : "Aksesibilitas"}
                    value={formatPercent(overview.kpis.accessibility_percentage)}
                    hint={isEn ? "Facilities with access support" : "Fasilitas dengan dukungan akses"}
                    icon={ShieldCheck}
                    tone="accent"
                    className="card-hover transition-all"
                  />
                </Reveal>
                <Reveal delay={120}>
                  <StatCard
                    label={isEn ? "Budget allocation" : "Alokasi anggaran"}
                    value={formatCompactRupiah(overview.kpis.total_budget_allocated)}
                    hint={isEn ? `Realized ${formatPercent(overview.kpis.realization_percentage)}` : `Realisasi ${formatPercent(overview.kpis.realization_percentage)}`}
                    icon={Wallet}
                    className="card-hover transition-all"
                  />
                </Reveal>
                <Reveal delay={180}>
                  <StatCard
                    label={isEn ? "Priority districts" : "Wilayah prioritas"}
                    value={formatNumber(overview.kpis.underserved_districts)}
                    hint={isEn ? `Of ${formatNumber(overview.kpis.total_districts)} districts` : `Dari ${formatNumber(overview.kpis.total_districts)} kecamatan`}
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
                        <h3 className="font-display text-sm font-semibold text-text">
                          {isEn ? "Interactive Coverage Map" : "Peta jangkauan interaktif"}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-muted">
                          {isEn ? "District colors indicate the access equity index." : "Warna wilayah menunjukkan indeks pemerataan akses per kecamatan."}
                        </p>
                      </div>
                      <Link
                        href="/data"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                      >
                        {isEn ? "Full map" : "Peta penuh"}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                    <FacilityMapClient
                      facilities={facilities}
                      regions={regions}
                      height={410}
                      ariaLabel={isEn ? "Facility coverage and equity map of DKI Jakarta" : "Peta jangkauan fasilitas dan pemerataan wilayah DKI Jakarta"}
                    />
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <div className="flex h-full flex-col rounded-xl border border-border bg-surface shadow-soft">
                    <div className="border-b border-border px-5 py-3.5">
                      <h3 className="font-display text-sm font-semibold text-text">
                        {isEn ? "Areas of Attention" : "Titik perhatian"}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {isEn ? "Districts with lowest facility access ratios." : "Kecamatan dengan akses paling rendah."}
                      </p>
                    </div>
                    <div className="flex-1 px-5 py-4">
                      <ol className="space-y-4">
                        {overview.top_underserved.slice(0, 5).map((metric) => {
                          const score = Math.max(0, Math.min(100, Number(metric.equity_index)));
                          return (
                            <li key={metric.id}>
                              <div className="flex min-w-0 items-baseline justify-between gap-2">
                                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-text">
                                  {metric.region?.name ?? `Wilayah ${metric.region_id}`}
                                </span>
                                <span className="shrink-0 tabular text-[10px] text-muted">
                                  {formatNumber(metric.facility_count)} {isEn ? "facilities" : "fasilitas"}
                                </span>
                              </div>
                              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                                <div
                                  className="h-full rounded-full bg-highlight transition-all duration-700"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <div className="mt-1 flex justify-between text-[10px] text-muted">
                                <span>{isEn ? "Index" : "Indeks"} {formatDecimal(metric.equity_index)}</span>
                                <span>{isEn ? "Ratio" : "Rasio"} {formatNumber(metric.ratio_per_10k_population)} {isEn ? "/ 10k pop." : "/ 10rb"}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                    <div className="border-t border-border px-5 py-3 bg-surface-2/30">
                      <Link
                        href="/analitik"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                      >
                        {isEn ? "View full equity analysis" : "Lihat analisis pemerataan lengkap"}
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
                title={isEn ? "Data Summary Unavailable" : "Ringkasan data belum dapat dimuat"}
                description={
                  isEn
                    ? "Frontend cannot reach Laravel API. Ensure backend is running, then reload this page."
                    : "Frontend tidak dapat menjangkau API Laravel. Nyalakan backend di http://127.0.0.1:8000, lalu muat ulang halaman ini."
                }
                action={
                  <ButtonLink href="/" variant="secondary" size="sm">
                    {isEn ? "Reload" : "Muat ulang"}
                  </ButtonLink>
                }
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* 5. FITUR DATA KOTA ADMINISTRASI */}
      {overview?.city_breakdown && overview.city_breakdown.length > 0 ? (
        <section className="section-y border-t border-border bg-surface">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow={isEn ? "Territorial Equity" : "Pemerataan Teritorial"}
                title={isEn ? "Data distribution across 6 DKI Jakarta regions" : "Distribusi data 6 wilayah DKI Jakarta"}
                description={
                  isEn
                    ? "Comparison of budget allocations, absorption percentages, and public facility distribution across each administrative city and regency."
                    : "Perbandingan alokasi anggaran, persentase penyerapan, dan sebaran fasilitas publik di setiap kota dan kabupaten administrasi."
                }
                action={
                  <ButtonLink href="/data" variant="secondary" size="sm" className="hover:border-interactive/40">
                    {isEn ? "Open data by district" : "Buka data per wilayah"}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </ButtonLink>
                }
              />
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overview.city_breakdown.map((city, idx) => (
                <Reveal key={city.city} delay={idx * 50}>
                  <div className="card-hover group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-3.5 sm:p-5 shadow-soft transition-all hover:border-interactive/50 hover:shadow-lift">
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
                          {city.district_count} {isEn ? "Districts" : "Kecamatan"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border/60 py-3">
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {isEn ? "Facilities" : "Fasilitas"}
                          </span>
                          <span className="mt-0.5 font-display text-base font-bold text-text">
                            {formatNumber(city.facility_count)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {isEn ? "APBD Allocation" : "Alokasi APBD"}
                          </span>
                          <span className="mt-0.5 font-display text-base font-bold text-text">
                            {formatCompactRupiah(city.budget_allocated)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">{isEn ? "Execution Rate" : "Tingkat Realisasi"}</span>
                        <span className="font-bold text-text">{formatPercent(city.realization_rate)}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.max(4, city.realization_rate))}%` }}
                        />
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 text-[10px] text-muted">
                        <span>{isEn ? "Executed:" : "Realisasi:"} {formatCompactRupiah(city.budget_realized)}</span>
                        <Link
                          href={`/data?search=${encodeURIComponent(city.city.replace("Kota ", "").replace("Kab. ", ""))}`}
                          className="font-semibold text-interactive hover:underline inline-flex items-center gap-0.5"
                        >
                          {isEn ? "View details" : "Lihat detail"} <ArrowUpRight className="size-3" />
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
            <p className="eyebrow">{isEn ? "How to read" : "Cara membaca"}</p>
            <h2 className="display-3 mt-3 text-text">
              {isEn ? "Every number has a trail." : "Setiap angka punya jejak."}
            </h2>
            <p className="lede mt-4 text-sm">
              {isEn
                ? "TeraPublic does not replace official documents. This platform helps you formulate the right questions before examining the original records."
                : "TeraPublic tidak mengganti dokumen resmi. Platform ini membantu Anda menemukan pertanyaan yang tepat sebelum memeriksa sumber data aslinya."}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="divide-y divide-border border-y border-border">
              <ReadingRow
                icon={Database}
                title={isEn ? "Facilities" : "Fasilitas"}
                body={
                  isEn
                    ? "Names, locations, capacities, and accessibility tags from municipal data."
                    : "Nama, lokasi, kapasitas, dan penanda akses dari data sektor pemerintah."
                }
                href="/data"
              />
              <ReadingRow
                icon={Landmark}
                title={isEn ? "Budgets" : "Anggaran"}
                body={
                  isEn
                    ? "APBD allocations, expenditure realization, physical progress, and yearly project status."
                    : "Alokasi APBD, realisasi penyerapan, progres fisik, dan status proyek per tahun."
                }
                href="/data?tab=anggaran"
              />
              <ReadingRow
                icon={Sparkles}
                title={isEn ? "Analytics" : "Analitik"}
                body={
                  isEn
                    ? "District clusters, budget prioritization, and predictive absorption models."
                    : "Klaster wilayah, prioritas anggaran, dan proyeksi model penyerapan data."
                }
                href="/analitik"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. CTA PARTISIPASI WARGA */}
      <section className="section-tight bg-bg">
        <div className="container-page">
          <Reveal>
            <CivicCtaCard />
          </Reveal>
        </div>
      </section>
    </>
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
