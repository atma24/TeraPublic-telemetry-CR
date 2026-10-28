import Link from "next/link";
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
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="paper-grid absolute inset-0 opacity-55" aria-hidden="true" />
        <div className="absolute -right-40 top-20 size-[520px] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

        <div className="container-page relative grid gap-14 py-14 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">
              <span className="inline-block size-1.5 rounded-full bg-interactive" aria-hidden="true" />
              Data terbuka · DKI Jakarta
            </p>
            <h1 className="display-1 mt-6 max-w-[13ch] text-text">
              Fasilitas publik yang <span className="text-interactive">terlihat.</span> Anggaran yang bisa
              ditelusuri.
            </h1>
            <p className="lede mt-6 max-w-xl">
              TeraPublic menyatukan data fasilitas pendidikan dan pasar, proyek anggaran, serta suara warga
              dalam satu ruang baca yang bisa diperiksa.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/data" size="lg">
                Jelajahi data
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/layanan-publik" variant="secondary" size="lg">
                Lihat layanan
              </ButtonLink>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-interactive" aria-hidden="true" />
                Sumber data terverifikasi
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-interactive" aria-hidden="true" />
                Partisipasi warga
              </span>
              <span className="uppercase tracking-[0.14em]">{SITE_TAGLINE}</span>
            </div>
          </div>

          <Reveal delay={80} className="lg:pl-4">
            <div className="relative">
              <div className="absolute -left-3 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-highlight md:block" aria-hidden="true" />
              <div className="absolute -left-[3.55rem] top-1 hidden size-2 rounded-full bg-highlight md:block" aria-hidden="true" />
              <div className="rounded-lg border border-border bg-bg/95 p-1.5 shadow-lift">
                <div className="rounded-md border border-border bg-surface">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                      Terapublic / Ringkasan
                    </span>
                    <span className="tabular text-[10px] text-muted">{today}</span>
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
                          hint={`${formatNumber(overview.kpis.accessible_facilities)} fasilitas aksesibel`}
                        />
                        <LedgerMetric
                          label="Anggaran"
                          value={formatCompactRupiah(overview.kpis.total_budget_allocated)}
                          hint={`Realisasi ${formatPercent(overview.kpis.realization_percentage)}`}
                        />
                        <LedgerMetric
                          label="Aduan warga"
                          value={formatNumber(overview.kpis.total_citizen_feedbacks)}
                          hint={`${formatNumber(overview.kpis.resolved_citizen_feedbacks)} selesai`}
                        />
                      </div>

                      <div className="px-4 py-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                            Kecamatan prioritas
                          </p>
                          <Link
                            href="/data"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-interactive hover:underline"
                          >
                            Semua
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
                                {formatNumber(metric.ratio_per_10k_population)} / 10rb
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
                      {isOnline ? "Terhubung ke layanan data" : "Layanan data offline"}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-tight border-b border-border bg-bg">
        <div className="container-page">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {readingRooms.map((room, index) => {
              const Icon = room.icon;
              return (
                <Reveal key={room.number} delay={index * 70}>
                  <Link
                    href={room.href}
                    className="group flex h-full flex-col justify-between gap-8 bg-surface p-6 transition-colors hover:bg-surface-2/60"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="tabular text-[10px] font-bold text-muted">{room.number}</span>
                        <Icon className="size-4 text-muted transition-colors group-hover:text-interactive" aria-hidden="true" />
                      </div>
                      <h2 className="mt-8 font-display text-xl font-bold tracking-[-0.03em] text-text">
                        {room.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{room.description}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive">
                      {room.action}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-bg">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Potret hari ini"
              title="Yang bisa dibaca dari data"
              description="Angka di bawah berasal langsung dari layanan TeraPublic. Gunakan sebagai pintu masuk, lalu periksa detail per wilayah dan per proyek."
              action={
                <ButtonLink href="/insight" variant="secondary" size="sm">
                  Baca insight
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </ButtonLink>
              }
            />
          </Reveal>

          {overview ? (
            <>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal>
                  <StatCard
                    label="Fasilitas publik"
                    value={formatNumber(overview.kpis.total_facilities)}
                    hint="Sekolah dan pasar tradisional"
                    icon={Building2}
                  />
                </Reveal>
                <Reveal delay={60}>
                  <StatCard
                    label="Aksesibilitas"
                    value={formatPercent(overview.kpis.accessibility_percentage)}
                    hint="Fasilitas dengan dukungan akses"
                    icon={ShieldCheck}
                    tone="accent"
                  />
                </Reveal>
                <Reveal delay={120}>
                  <StatCard
                    label="Alokasi anggaran"
                    value={formatCompactRupiah(overview.kpis.total_budget_allocated)}
                    hint={`Realisasi ${formatPercent(overview.kpis.realization_percentage)}`}
                    icon={Wallet}
                  />
                </Reveal>
                <Reveal delay={180}>
                  <StatCard
                    label="Wilayah prioritas"
                    value={formatNumber(overview.kpis.underserved_districts)}
                    hint={`Dari ${formatNumber(overview.kpis.total_districts)} kecamatan`}
                    icon={MapPinned}
                    tone="warning"
                  />
                </Reveal>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <Reveal>
                  <div className="overflow-hidden rounded-lg border border-border bg-surface">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                      <div>
                        <h3 className="font-display text-sm font-semibold text-text">Peta jangkauan</h3>
                        <p className="mt-0.5 text-[11px] text-muted">
                          Warna wilayah menunjukkan indeks pemerataan akses.
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
                  <div className="flex h-full flex-col rounded-lg border border-border bg-surface">
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
                                  className="h-full rounded-full bg-highlight"
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
                    <div className="border-t border-border px-5 py-3">
                      <Link
                        href="/insight"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                      >
                        Lihat analisis pemerataan
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

      <section className="border-y border-border bg-surface">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-20">
          <Reveal>
            <p className="eyebrow">Cara membaca</p>
            <h2 className="display-3 mt-3 text-text">Setiap angka punya jejak.</h2>
            <p className="lede mt-4 text-sm">
              TeraPublic tidak mengganti dokumen resmi. Ia membantu Anda menemukan pertanyaan yang tepat
              sebelum memeriksa sumber aslinya.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="divide-y divide-border border-y border-border">
              <ReadingRow
                icon={Database}
                title="Fasilitas"
                body="Nama, lokasi, kapasitas, dan penanda akses dari data sektor."
                href="/data"
              />
              <ReadingRow
                icon={Landmark}
                title="Anggaran"
                body="Alokasi, realisasi, progres fisik, dan status proyek per tahun."
                href="/data?tab=anggaran"
              />
              <ReadingRow
                icon={Sparkles}
                title="Insight"
                body="Klaster wilayah, prioritas anggaran, dan proyeksi penyerapan."
                href="/insight"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-tight bg-bg">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl bg-brand-navy px-6 py-10 text-white md:px-10 md:py-12">
              <div className="absolute -right-16 -top-16 size-56 rounded-full border border-white/10" aria-hidden="true" />
              <div className="absolute -bottom-24 right-24 size-64 rounded-full border border-white/10" aria-hidden="true" />
              <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-mint">
                    Partisipasi warga
                  </p>
                  <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-white md:text-4xl">
                    Punya temuan di sekitar Anda? Jadikan data.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
                    Laporkan kerusakan fasilitas atau hambatan akses. Setiap laporan mendapat kode
                    pelacakan dan dapat ditindaklanjuti oleh admin.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                  <ButtonLink href="/aduan/buat" variant="amber" size="md">
                    Buat aduan
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                  <Link
                    href="/chatbot"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    Tanya asisten
                  </Link>
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
    <div className="p-4">
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
    <Link href={href} className="group flex items-start gap-4 py-5">
      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-muted transition-colors group-hover:text-interactive">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-semibold text-text">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">{body}</span>
      </span>
      <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-interactive" aria-hidden="true" />
    </Link>
  );
}
