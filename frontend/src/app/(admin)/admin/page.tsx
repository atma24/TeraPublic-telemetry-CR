import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleAlert,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldAlert,
  Wallet,
} from "lucide-react";

import { FeedbackStatusBadge } from "@/components/feedback/feedback-status-badge";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminFeedbacks } from "@/lib/api/admin";
import { getDashboardOverview } from "@/lib/api/public";
import { requireAdmin } from "@/lib/auth/session";
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from "@/lib/constants";
import { formatCompactRupiah, formatDecimal, formatNumber, formatPercent, formatRelative } from "@/lib/format";

export const metadata = { title: "Ringkasan" };

const pendingStatuses = new Set(["submitted", "verified", "in_review"]);

export default async function AdminDashboardPage() {
  const session = await requireAdmin("/admin");

  const [overviewResult, feedbackResult] = await Promise.allSettled([
    getDashboardOverview(),
    getAdminFeedbacks(session.token, { per_page: 100 }),
  ]);

  const overview = overviewResult.status === "fulfilled" ? overviewResult.value.data : null;
  const feedbacks = feedbackResult.status === "fulfilled" ? feedbackResult.value.data : [];
  const pending = feedbacks.filter((feedback) => pendingStatuses.has(feedback.status));
  const loadedFeedbackTotal =
    feedbackResult.status === "fulfilled" ? feedbackResult.value.meta.total : 0;
  const statusCounts = {
    submitted: feedbacks.filter((item) => item.status === "submitted").length,
    verified: feedbacks.filter((item) => item.status === "verified").length,
    in_review: feedbacks.filter((item) => item.status === "in_review").length,
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Ringkasan operasional</p>
          <h1 className="display-3 mt-2 text-text">Selamat datang, {session.user.name.split(" ")[0]}</h1>
          <p className="mt-1.5 text-sm text-muted">
            Pantau antrean aduan dan kondisi data fasilitas serta anggaran.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/fasilitas?baru=1" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            Fasilitas
          </ButtonLink>
          <ButtonLink href="/admin/anggaran?baru=1" variant="secondary" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            Proyek
          </ButtonLink>
        </div>
      </div>

      {!overview ? (
        <ErrorState
          title="Ringkasan data belum tersedia"
          description="Backend tidak merespons saat halaman dimuat. Antrean aduan di bawah mungkin masih dapat digunakan."
          action={
            <a
              href="/admin"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-text hover:bg-surface-2"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Muat ulang
            </a>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Fasilitas"
              value={formatNumber(overview.kpis.total_facilities)}
              hint={`${formatPercent(overview.kpis.accessibility_percentage)} memiliki atribut akses`}
              icon={Building2}
            />
            <StatCard
              label="Anggaran terserap"
              value={formatPercent(overview.kpis.realization_percentage)}
              hint={`${formatCompactRupiah(overview.kpis.total_budget_realized)} dari ${formatCompactRupiah(overview.kpis.total_budget_allocated)}`}
              icon={Wallet}
              tone="accent"
            />
            <StatCard
              label="Aduan masuk"
              value={formatNumber(overview.kpis.total_citizen_feedbacks)}
              hint={`${formatNumber(overview.kpis.resolved_citizen_feedbacks)} sudah selesai`}
              icon={MessageSquare}
            />
            <StatCard
              label="Kecamatan tertinggal"
              value={`${formatNumber(overview.kpis.underserved_districts)} / ${formatNumber(overview.kpis.total_districts)}`}
              hint="Indeks pemerataan di bawah ambang"
              icon={ShieldAlert}
              tone="warning"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="card-hover overflow-hidden rounded-xl border border-border bg-surface shadow-2xs transition-all duration-200">
              <div className="flex items-center justify-between gap-3 border-b border-border/80 px-5 py-3.5 bg-surface-2/30">
                <div>
                  <h2 className="font-display text-sm font-semibold text-text">Kecamatan prioritas</h2>
                  <p className="mt-0.5 text-[10px] text-muted">Tiga wilayah dengan indeks pemerataan terendah.</p>
                </div>
                <Link
                  href="/analitik"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive transition-colors hover:underline"
                >
                  Analitik
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
              <div className="divide-y divide-border/70">
                {overview.top_underserved.slice(0, 5).map((region) => (
                  <div key={region.region_id} className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-surface-2/50">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-text">
                        {region.region?.name ?? `Kecamatan #${region.region_id}`}
                      </p>
                      <p className="text-[10px] text-muted">
                        {formatNumber(region.facility_count)} fasilitas ·{" "}
                        {formatNumber(region.region?.population ?? 0)} penduduk
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="tabular text-[11px] font-semibold text-muted">
                        {formatDecimal(region.ratio_per_10k_population)} / 10rb
                      </span>
                      <Badge tone={region.equity_index < 30 ? "danger" : "warning"}>
                        {formatDecimal(region.equity_index)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-hover overflow-hidden rounded-xl border border-border bg-surface shadow-2xs transition-all duration-200">
              <div className="border-b border-border/80 px-5 py-3.5 bg-surface-2/30">
                <h2 className="font-display text-sm font-semibold text-text">Status antrean aduan</h2>
                <p className="mt-0.5 text-[10px] text-muted">
                  {formatNumber(loadedFeedbackTotal)} aduan tercatat di sistem.
                </p>
              </div>
              <div className="space-y-3 px-5 py-4">
                {(
                  [
                    ["submitted", statusCounts.submitted],
                    ["verified", statusCounts.verified],
                    ["in_review", statusCounts.in_review],
                  ] as const
                ).map(([status, count]) => {
                  const total = Math.max(1, loadedFeedbackTotal);
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-2 font-semibold text-text">
                          <FeedbackStatusBadge status={status} />
                        </span>
                        <span className="tabular text-muted">{formatNumber(count)}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-interactive/70"
                          style={{ width: `${Math.min(100, (count / total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {feedbacks.length === 0 ? (
                  <p className="pt-2 text-[11px] leading-relaxed text-muted">
                    {feedbackResult.status === "rejected"
                      ? "Antrean aduan belum dapat dimuat dari server."
                      : "Belum ada aduan warga yang masuk."}
                  </p>
                ) : null}
              </div>
            </section>
          </div>
        </>
      )}

      <section className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="font-display text-sm font-semibold text-text">Perlu ditindaklanjuti</h2>
            <p className="mt-0.5 text-[10px] text-muted">Aduan berstatus diajukan, terverifikasi, atau ditinjau.</p>
          </div>
          <ButtonLink href="/admin/aduan" variant="secondary" size="sm">
            Semua aduan
          </ButtonLink>
        </div>

        {pending.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={MessageSquare}
              title="Tidak ada aduan menunggu"
              description="Antrean saat ini bersih, atau data aduan belum dapat dimuat."
              className="border-0 bg-transparent py-8"
            />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pending.slice(0, 6).map((feedback) => (
              <Link
                key={feedback.id}
                href={`/admin/aduan?status=${feedback.status}`}
                className="flex flex-wrap items-start justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2/60"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <FeedbackStatusBadge status={feedback.status} />
                    <span className="text-[10px] text-muted">
                      {FEEDBACK_CATEGORIES[feedback.category] ?? feedback.category}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-xs font-semibold text-text">{feedback.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {feedback.citizen_name}
                    {feedback.facility ? ` · ${feedback.facility.name}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[10px] text-muted">{formatRelative(feedback.created_at)}</span>
                  <ArrowRight className="size-3.5 text-muted" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {pending.length > 0 ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-highlight/35 bg-highlight/8 px-4 py-3">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
          <p className="text-[11px] leading-relaxed text-muted">
            {formatNumber(pending.length)} aduan pada halaman ini belum selesai. Buka{" "}
            <Link href="/admin/aduan" className="font-semibold text-text underline underline-offset-2">
              Aduan Warga
            </Link>{" "}
            untuk memverifikasi dan menuliskan tanggapan. Status akhir: {FEEDBACK_STATUS.resolved.label}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
