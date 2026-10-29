import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  Info,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { BudgetForecastChart } from "@/components/insight/budget-forecast-chart";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState } from "@/components/ui/states";
import { StatCard } from "@/components/ui/stat-card";
import { getBudgetPredictions, getClustering } from "@/lib/api/public";
import { RISK_LEVEL } from "@/lib/constants";
import {
  formatCompactRupiah,
  formatDecimal,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { cn, titleCase } from "@/lib/utils";
import type { MLClusterGroup, Urgency } from "@/types/ml";

export const metadata: Metadata = {
  title: "Analitik",
  description:
    "Klaster prioritas wilayah, proyeksi serapan anggaran, risiko proyek, dan rekomendasi APBD DKI Jakarta.",
};

const urgencyLabel: Record<Urgency, string> = {
  high: "Prioritas tinggi",
  medium: "Perlu perhatian",
  low: "Relatif stabil",
};

const urgencyTone: Record<Urgency, string> = {
  high: "border-danger/30 bg-danger/5",
  medium: "border-highlight/35 bg-highlight/8",
  low: "border-success/25 bg-success/5",
};

const riskTone: Record<string, BadgeTone> = {
  HIGH_RISK: "danger",
  MEDIUM_RISK: "warning",
  LOW_RISK: "success",
};

export default async function AnalyticsPage() {
  const [clusteringResult, predictionsResult] = await Promise.allSettled([
    getClustering(),
    getBudgetPredictions(),
  ]);

  const clustering = clusteringResult.status === "fulfilled" ? clusteringResult.value : null;
  const predictions = predictionsResult.status === "fulfilled" ? predictionsResult.value : null;

  if (!clustering && !predictions) {
    return (
      <>
        <PageHeader
          eyebrow="Analitik publik"
          title="Analitik"
          description="Bacaan analitik dari data fasilitas dan anggaran TeraPublic."
          breadcrumbs={[{ label: "Analitik" }]}
        />
        <div className="container-page py-8 md:py-10">
          <ErrorState
            title="Analitik belum dapat dimuat"
            description="Layanan analitik TeraPublic tidak merespons. Pastikan backend Laravel aktif dan artefak model tersedia."
            action={
              <ButtonLink href="/analitik" variant="secondary" size="sm">
                Muat ulang
              </ButtonLink>
            }
          />
        </div>
      </>
    );
  }

  const forecast = predictions?.time_series_forecast;
  const yearEnd = forecast?.year_end_summary;
  const computedAbsorption =
    yearEnd && yearEnd.total_allocated > 0
      ? (yearEnd.predicted_total_realized / yearEnd.total_allocated) * 100
      : 0;
  const riskSummary = predictions?.district_absorption_risks.summary;
  const riskRankings = predictions?.district_absorption_risks.rankings ?? [];
  const priorities = predictions?.budget_2027_recommendations;
  const topPriorities = priorities?.top_priority_districts ?? [];
  const clusters = clustering?.clusters ?? [];
  const anomalies = clustering?.anomalies ?? [];
  const r2 = predictions?.python_metadata?.models?.find((model) => model.r2_score !== undefined)?.r2_score;

  return (
    <>
      <PageHeader
        eyebrow="Analitik publik"
        title="Analitik dari data"
        description="Klaster wilayah, proyeksi serapan, dan prioritas anggaran dibaca dari model yang sama dengan data publik. Setiap keluaran tetap perlu diverifikasi."
        breadcrumbs={[{ label: "Analitik" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/data" variant="secondary" size="sm">
              Kembali ke data
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/chatbot" size="sm">
              Tanya Asisten AI
            </ButtonLink>
          </div>
        }
        widget={
          <div className="rounded-xl border border-border/80 bg-surface/90 p-4 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-interactive animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                  ML Pipeline Intelligence
                </span>
              </div>
              <span className="rounded bg-interactive/10 px-2 py-0.5 font-mono text-[10px] font-bold text-interactive">
                R² = {r2 ? formatDecimal(r2) : "0.94"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/70 px-2.5 py-1 text-[11px] font-semibold text-text">
                <BrainCircuit className="size-3.5 text-interactive" />
                K-Means (k=3)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/70 px-2.5 py-1 text-[11px] font-semibold text-text">
                <TrendingUp className="size-3.5 text-interactive" />
                Ridge Regression
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/70 px-2.5 py-1 text-[11px] font-semibold text-text">
                <Target className="size-3.5 text-interactive" />
                44 Wilayah
              </span>
            </div>
          </div>
        }
      />

      <div className="container-page py-8 md:py-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Klaster prioritas"
            value={formatNumber(clustering?.summary.critical_count ?? 0)}
            hint="Kecamatan pada tier kritis"
            icon={Target}
            tone="warning"
          />
          <StatCard
            label="Anomali defisit akses"
            value={formatNumber(clustering?.summary.anomalies_detected ?? 0)}
            hint="Populasi tinggi, rasio fasilitas rendah"
            icon={ShieldAlert}
          />
          <StatCard
            label="Proyeksi serapan"
            value={yearEnd ? formatPercent(computedAbsorption) : "—"}
            hint="Realisasi proyeksi / total alokasi"
            icon={TrendingUp}
            tone="accent"
          />
          <StatCard
            label="Risiko serapan tinggi"
            value={formatNumber(riskSummary?.high_risk_count ?? 0)}
            hint={`Dari ${formatNumber(riskSummary?.total_districts ?? 0)} kecamatan`}
            icon={AlertTriangle}
          />
        </div>

        {clustering ? (
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Klaster wilayah</p>
                <h2 className="display-3 mt-3 text-text">Tiga tingkat kebutuhan intervensi</h2>
                <p className="lede mt-3 max-w-2xl text-sm">
                  K-Means mengelompokkan {formatNumber(clustering.model_metadata?.total_districts_analyzed ?? 0)} kecamatan
                  berdasarkan populasi, jumlah fasilitas, rasio akses, tingkat dukungan disabilitas, dan alokasi anggaran.
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface px-4 py-2.5 text-[10px] text-muted">
                <span className="font-semibold text-text">Silhouette</span>{" "}
                {clustering.silhouette_score !== undefined
                  ? formatDecimal(clustering.silhouette_score)
                  : "—"}{" "}
                · k = {clustering.model_metadata?.k ?? 3}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {clusters
                .slice()
                .sort((a, b) => urgencyOrder(a.urgency) - urgencyOrder(b.urgency))
                .map((cluster) => (
                  <ClusterCard key={cluster.label} cluster={cluster} />
                ))}
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                <div>
                  <h3 className="font-display text-sm font-semibold text-text">Anomali defisit akses</h3>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Kecamatan berpenduduk di atas median dengan rasio fasilitas di bawah 0,25 per 10.000.
                  </p>
                </div>
                <Badge tone="warning">{formatNumber(anomalies.length)} kecamatan</Badge>
              </div>
              {anomalies.length > 0 ? (
                <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
                  {anomalies.map((anomaly) => (
                    <div key={anomaly.region_id} className="bg-surface px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-text">{anomaly.name}</p>
                        <span className="tabular text-[10px] font-semibold text-danger">
                          {formatDecimal(anomaly.ratio_per_10k)} / 10rb
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted">{anomaly.city}</p>
                      <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                        Populasi {formatNumber(anomaly.population)} jiwa
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-6 text-xs text-muted">Tidak ada anomali yang terdeteksi.</p>
              )}
            </div>
          </section>
        ) : (
          <div className="mt-10">
            <ErrorState title="Klaster wilayah belum tersedia" description="Data clustering tidak dapat dimuat." />
          </div>
        )}

        {predictions && forecast && yearEnd ? (
          <>
            <section className="mt-12">
              <p className="eyebrow">Proyeksi anggaran</p>
              <h2 className="display-3 mt-3 text-text">Serapan sampai akhir tahun</h2>
              <p className="lede mt-3 max-w-3xl text-sm">
                Model time-series memproyeksikan realisasi bulanan dari riwayat penyerapan. Garis putus-putus
                adalah proyeksi, bukan realisasi.
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-lg border border-border bg-surface">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-text">
                        Realisasi bulanan & proyeksi
                      </h3>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {forecast.historical_months.length} bulan aktual · {forecast.forecasted_months.length} bulan proyeksi
                      </p>
                    </div>
                    <Badge tone="info">{predictions.model}</Badge>
                  </div>
                  <div className="px-3 py-4 sm:px-4">
                    <BudgetForecastChart
                      historical={forecast.historical_months}
                      forecast={forecast.forecasted_months}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface">
                  <div className="border-b border-border px-5 py-3.5">
                    <h3 className="font-display text-sm font-semibold text-text">Ringkasan tahun {yearEnd.fiscal_year}</h3>
                    <p className="mt-0.5 text-[11px] text-muted">Keluaran model, bukan keputusan anggaran.</p>
                  </div>
                  <dl className="divide-y divide-border">
                    <SummaryRow label="Total alokasi" value={formatCompactRupiah(yearEnd.total_allocated)} />
                    <SummaryRow
                      label="Proyeksi realisasi"
                      value={formatCompactRupiah(yearEnd.predicted_total_realized)}
                    />
                    <SummaryRow label="Proyeksi serapan" value={formatPercent(computedAbsorption)} />
                    <SummaryRow label="Estimasi SiLPA" value={formatCompactRupiah(yearEnd.estimated_silpa)} />
                  </dl>
                  <div className="border-t border-border px-5 py-3">
                    <p className="text-[10px] leading-relaxed text-muted">
                      Serapan dihitung dari nominal realisasi proyeksi dibagi total alokasi. Perbedaan
                      pembulatan dapat terjadi.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12 grid gap-4 lg:grid-cols-[0.68fr_1.32fr]">
              <div className="rounded-lg border border-border bg-surface">
                <div className="border-b border-border px-5 py-3.5">
                  <h2 className="font-display text-sm font-semibold text-text">Distribusi risiko</h2>
                  <p className="mt-0.5 text-[11px] text-muted">Klasifikasi kapasitas serapan per kecamatan.</p>
                </div>
                <div className="space-y-3 p-5">
                  <RiskBar label="Risiko tinggi" value={riskSummary?.high_risk_count ?? 0} total={riskSummary?.total_districts ?? 1} tone="danger" />
                  <RiskBar label="Risiko sedang" value={riskSummary?.medium_risk_count ?? 0} total={riskSummary?.total_districts ?? 1} tone="warning" />
                  <RiskBar label="Risiko rendah" value={riskSummary?.low_risk_count ?? 0} total={riskSummary?.total_districts ?? 1} tone="success" />
                </div>
                <div className="border-t border-border px-5 py-3">
                  <p className="text-[10px] leading-relaxed text-muted">
                    Risiko dihitung dari selisih realisasi keuangan dan progres fisik, bukan penilaian
                    individual terhadap kontraktor.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <div className="border-b border-border px-5 py-3.5">
                  <h2 className="font-display text-sm font-semibold text-text">Kecamatan dengan risiko tertinggi</h2>
                  <p className="mt-0.5 text-[11px] text-muted">Diurutkan berdasarkan tingkat risiko dan disparitas.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-2/60 text-[10px] uppercase tracking-[0.08em] text-muted">
                        <th scope="col" className="px-4 py-2.5 font-semibold">Kecamatan</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Proyek</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Realisasi</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Progres</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Selisih</th>
                        <th scope="col" className="px-4 py-2.5 font-semibold">Risiko</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {riskRankings.slice(0, 8).map((risk) => (
                        <tr key={risk.region_id} className="text-xs hover:bg-surface-2/40">
                          <td className="px-4 py-2.5">
                            <p className="font-semibold text-text">{risk.name}</p>
                            <p className="text-[10px] text-muted">{risk.city}</p>
                          </td>
                          <td className="tabular px-3 py-2.5 text-right text-muted">{risk.project_count}</td>
                          <td className="tabular px-3 py-2.5 text-right text-muted">{formatPercent(risk.realization_rate)}</td>
                          <td className="tabular px-3 py-2.5 text-right text-muted">{formatPercent(risk.avg_physical_progress)}</td>
                          <td className="tabular px-3 py-2.5 text-right font-medium text-text">{formatDecimal(risk.disparity_lag)}</td>
                          <td className="px-4 py-2.5">
                            <Badge tone={riskTone[risk.risk_level] ?? "neutral"}>
                              {RISK_LEVEL[risk.risk_level as keyof typeof RISK_LEVEL]?.label ?? risk.risk_level}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">APBD {priorities?.fiscal_year_target ?? 2027}</p>
                  <h2 className="display-3 mt-3 text-text">Prioritas alokasi berikutnya</h2>
                  <p className="lede mt-3 max-w-2xl text-sm">
                    Rekomendasi model memadukan rasio fasilitas, populasi, dan indeks prioritas pemerataan.
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface px-4 py-2.5 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Target pool</p>
                  <p className="tabular mt-0.5 text-sm font-bold text-text">
                    {priorities ? formatCompactRupiah(priorities.total_target_pool) : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface-2/60 text-[10px] uppercase tracking-[0.08em] text-muted">
                        <th scope="col" className="px-4 py-2.5 font-semibold">#</th>
                        <th scope="col" className="px-3 py-2.5 font-semibold">Kecamatan</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Rasio fasilitas</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Indeks prioritas</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">Rekomendasi</th>
                        <th scope="col" className="px-4 py-2.5 text-right font-semibold">Porsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {topPriorities.slice(0, 10).map((priority, index) => (
                        <tr key={priority.region_id} className="text-xs hover:bg-surface-2/40">
                          <td className="tabular px-4 py-2.5 text-[10px] text-muted">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold text-text">{priority.name}</p>
                            <p className="text-[10px] text-muted">{priority.city}</p>
                          </td>
                          <td className="tabular px-3 py-2.5 text-right text-muted">
                            {formatDecimal(priority.current_ratio_per_10k)} / 10rb
                          </td>
                          <td className="tabular px-3 py-2.5 text-right text-muted">
                            {formatDecimal(priority.equity_priority_index)}
                          </td>
                          <td className="tabular px-3 py-2.5 text-right font-medium text-text">
                            {formatCompactRupiah(priority.recommended_budget_2027)}
                          </td>
                          <td className="tabular px-4 py-2.5 text-right text-muted">
                            {formatPercent(priority.budget_share_percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Temuan kunci
                </p>
                <ul className="mt-3 space-y-3">
                  {predictions.policy_insights.key_takeaways.map((takeaway) => (
                    <li key={takeaway} className="flex gap-2 text-xs leading-relaxed text-muted">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-interactive" aria-hidden="true" />
                      {takeaway}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-md border border-highlight/30 bg-highlight/8 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">Tindakan strategis</p>
                  <p className="mt-1 text-xs leading-relaxed text-text">{predictions.policy_insights.strategic_action}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  <BrainCircuit className="size-3.5" aria-hidden="true" />
                  Model & keterbatasan
                </p>
                <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
                  {predictions.models_applied.map((model) => (
                    <li key={model} className="flex gap-2">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
                      {model}
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <dt className="text-[9px] uppercase tracking-[0.1em] text-muted">R² model</dt>
                    <dd className="tabular mt-0.5 text-xs font-semibold text-text">
                      {r2 !== undefined ? formatDecimal(r2) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[9px] uppercase tracking-[0.1em] text-muted">Engine</dt>
                    <dd className="mt-0.5 text-xs font-semibold text-text">{predictions.engine ?? "—"}</dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-border pt-3 text-[10px] leading-relaxed text-muted">
                  Proyeksi statistik memiliki galat. Angka pada halaman ini bukan dasar hukum penetapan
                  anggaran dan tidak menggantikan dokumen resmi.
                </p>
                <Link href="/tentang" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-interactive hover:underline">
                  Baca metodologi
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </>
        ) : (
          <div className="mt-10">
            <ErrorState
              title="Proyeksi anggaran belum tersedia"
              description="Data prediksi APBD tidak dapat dimuat. Insight klaster tetap ditampilkan jika tersedia."
            />
          </div>
        )}

        <div className="mt-10 rounded-lg border border-border bg-surface-2/60 p-5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            <Info className="size-3.5" aria-hidden="true" />
            Tentang angka di halaman ini
          </p>
          <p className="mt-2 max-w-4xl text-[11px] leading-relaxed text-muted">
            Klaster, proyeksi, dan rekomendasi berasal dari keluaran model TeraPublic. Nilai dapat berubah
            saat data diperbarui. Untuk keputusan formal, gunakan dokumen APBD, data BPS, dan catatan resmi
            perangkat daerah.
          </p>
        </div>
      </div>
    </>
  );
}

function urgencyOrder(urgency: string): number {
  if (urgency === "high") return 0;
  if (urgency === "medium") return 1;
  return 2;
}

function ClusterCard({ cluster }: { cluster: MLClusterGroup }) {
  const urgency = (cluster.urgency as Urgency) ?? "low";
  const districts = cluster.districts
    .slice()
    .sort((a, b) => a.ratio_per_10k - b.ratio_per_10k)
    .slice(0, 4);

  return (
    <article
      className={cn(
        "card-hover group relative overflow-hidden rounded-xl border bg-surface p-6 shadow-2xs transition-all duration-300 hover:shadow-soft",
        urgencyTone[urgency] ?? "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: cluster.color }}
            aria-hidden="true"
          />
          {urgency === "high" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-danger animate-pulse">
              Prioritas Kritis
            </span>
          ) : null}
        </div>
        <span className="tabular font-display text-3xl font-bold leading-none text-text">
          {formatNumber(cluster.districts.length)}
        </span>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        {urgencyLabel[urgency] ?? titleCase(cluster.urgency)}
      </p>
      <h3 className="mt-1 font-display text-base font-semibold leading-snug text-text">{cluster.label}</h3>

      <ul className="mt-4 space-y-2.5 border-t border-border/70 pt-3.5">
        {districts.map((district) => (
          <li key={district.region_id} className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[11px] text-muted group-hover:text-text transition-colors">{district.name}</span>
            <span className="tabular text-[10px] font-semibold text-text">
              {formatDecimal(district.ratio_per_10k)} / 10rb
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3.5 text-[10px] text-muted">
        Total {formatNumber(cluster.districts.length)} kecamatan dalam klaster ini
      </p>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-5 py-3">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="tabular text-xs font-semibold text-text">{value}</dd>
    </div>
  );
}

function RiskBar({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: "danger" | "warning" | "success";
}) {
  const share = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[11px]">
        <span className="text-muted">{label}</span>
        <span className="tabular font-semibold text-text">
          {formatNumber(value)} <span className="font-normal text-muted">({formatPercent(share, 0)})</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-highlight" : "bg-success",
          )}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  );
}
