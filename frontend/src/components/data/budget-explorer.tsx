import Link from "next/link";
import { Filter, Landmark, RotateCcw, Search, TrendingUp, Wallet } from "lucide-react";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { inputClass, selectClass } from "@/components/ui/form";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { StatCard } from "@/components/ui/stat-card";
import { getBudgetProjects } from "@/lib/api/public";
import { PROJECT_STATUS } from "@/lib/constants";
import {
  formatCompactRupiah,
  formatDate,
  formatNumber,
  formatPercent,
  formatRupiah,
} from "@/lib/format";
import { firstParam } from "@/lib/utils";
import type { SearchParams } from "@/types/api";
import type { BudgetProject } from "@/types/public";

const PER_PAGE = 20;

const statusTone: Record<string, BadgeTone> = {
  planning: "neutral",
  procurement: "info",
  tender: "info",
  in_progress: "warning",
  completed: "success",
};

export async function BudgetExplorer({ searchParams }: { searchParams: SearchParams }) {
  let projects: BudgetProject[] = [];
  let summary:
    | {
        total_projects: number;
        total_budget_allocated: number;
        total_budget_realized: number;
        realization_percentage: number;
      }
    | null = null;

  try {
    const response = await getBudgetProjects();
    projects = response.data;
    summary = response.summary;
  } catch {
    return (
      <div className="container-page py-8 md:py-10">
        <ErrorState
          title="Data anggaran belum dapat dimuat"
          description="Layanan data TeraPublic tidak merespons. Pastikan backend Laravel aktif, lalu muat ulang halaman."
          action={
            <ButtonLink href="/data?tab=anggaran" variant="secondary" size="sm">
              Muat ulang
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const q = (firstParam(searchParams.q) ?? "").trim().toLowerCase();
  const year = firstParam(searchParams.tahun) ?? "";
  const status = firstParam(searchParams.status) ?? "";
  const funding = firstParam(searchParams.sumber) ?? "";

  const years = [...new Set(projects.map((project) => project.fiscal_year))].sort((a, b) => b - a);
  const fundingSources = [...new Set(projects.map((project) => project.funding_source))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );

  const filtered = projects
    .filter((project) => {
      if (q) {
        const haystack = `${project.project_name} ${project.contractor_name ?? ""} ${project.region?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (year && project.fiscal_year !== Number(year)) return false;
      if (status && project.status !== status) return false;
      if (funding && project.funding_source !== funding) return false;
      return true;
    })
    .sort((a, b) => b.fiscal_year - a.fiscal_year || b.id - a.id);

  const totalAllocated = filtered.reduce((sum, project) => sum + Number(project.budget_allocated), 0);
  const totalRealized = filtered.reduce((sum, project) => sum + Number(project.budget_realized), 0);
  const realization = totalAllocated > 0 ? (totalRealized / totalAllocated) * 100 : 0;
  const completed = filtered.filter((project) => project.status === "completed").length;
  const hasFilters = Boolean(q || year || status || funding);

  const page = Math.max(1, Number(firstParam(searchParams.page) ?? 1));
  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, lastPage);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const query = {
    tahun: year || undefined,
    status: status || undefined,
    sumber: funding || undefined,
    q: q || undefined,
  };

  const topFunding = Object.entries(
    filtered.reduce<Record<string, number>>((groups, project) => {
      groups[project.funding_source] = (groups[project.funding_source] ?? 0) + Number(project.budget_allocated);
      return groups;
    }, {}),
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);
  const fundingTotal = topFunding.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div className="container-page py-8 md:py-10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Proyek terdata"
          value={formatNumber(hasFilters ? filtered.length : (summary?.total_projects ?? projects.length))}
          hint={hasFilters ? "Sesuai filter aktif" : "Seluruh proyek anggaran"}
          icon={Landmark}
        />
        <StatCard
          label="Alokasi"
          value={formatCompactRupiah(totalAllocated)}
          hint={hasFilters ? "Total hasil filter" : "Total alokasi publik"}
          icon={Wallet}
        />
        <StatCard
          label="Realisasi"
          value={formatPercent(realization)}
          hint={formatCompactRupiah(totalRealized)}
          icon={TrendingUp}
          tone="accent"
        />
        <StatCard
          label="Proyek selesai"
          value={formatNumber(completed)}
          hint="Dari hasil filter saat ini"
          icon={Landmark}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <form
            method="get"
            action="/data"
            className="rounded-lg border border-border bg-surface"
          >
            <input type="hidden" name="tab" value="anggaran" />
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-text">
                <Filter className="size-3.5 text-muted" aria-hidden="true" />
                Filter anggaran
              </h2>
              {hasFilters ? (
                <Link
                  href="/data?tab=anggaran"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-interactive hover:underline"
                >
                  <RotateCcw className="size-3" aria-hidden="true" />
                  Reset
                </Link>
              ) : null}
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label htmlFor="q-budget" className="text-[11px] font-semibold text-text">
                  Cari proyek
                </label>
                <div className="relative mt-1.5">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    id="q-budget"
                    name="q"
                    type="search"
                    defaultValue={q}
                    placeholder="Nama proyek atau kontraktor"
                    className={`${inputClass} h-9 pl-9 text-xs`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tahun" className="text-[11px] font-semibold text-text">
                  Tahun anggaran
                </label>
                <select
                  id="tahun"
                  name="tahun"
                  defaultValue={year}
                  className={`${selectClass} mt-1.5 h-9 text-xs`}
                >
                  <option value="">Semua tahun</option>
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="text-[11px] font-semibold text-text">
                  Status proyek
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={status}
                  className={`${selectClass} mt-1.5 h-9 text-xs`}
                >
                  <option value="">Semua status</option>
                  {Object.entries(PROJECT_STATUS).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sumber" className="text-[11px] font-semibold text-text">
                  Sumber dana
                </label>
                <select
                  id="sumber"
                  name="sumber"
                  defaultValue={funding}
                  className={`${selectClass} mt-1.5 h-9 text-xs`}
                >
                  <option value="">Semua sumber</option>
                  {fundingSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" size="sm" className="w-full">
                Terapkan filter
              </Button>
            </div>
          </form>

          <div className="mt-3 rounded-lg border border-border bg-surface-2/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              Komposisi sumber dana
            </p>
            <ul className="mt-3 space-y-2.5">
              {topFunding.map(([source, amount]) => {
                const share = fundingTotal > 0 ? (amount / fundingTotal) * 100 : 0;
                return (
                  <li key={source}>
                    <div className="flex justify-between gap-2 text-[10px]">
                      <span className="truncate text-muted">{source}</span>
                      <span className="tabular font-semibold text-text">{formatPercent(share, 0)}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full bg-interactive" style={{ width: `${share}%` }} />
                    </div>
                  </li>
                );
              })}
              {topFunding.length === 0 ? <li className="text-[11px] text-muted">Tidak ada data.</li> : null}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-sm font-semibold text-text">Serapan anggaran</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  {formatRupiah(totalRealized)} dari {formatRupiah(totalAllocated)}
                </p>
              </div>
              <span className="tabular font-display text-xl font-bold text-text">{formatPercent(realization)}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-interactive transition-[width]"
                style={{ width: `${Math.max(0, Math.min(100, realization))}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold tracking-[-0.03em] text-text">Daftar proyek</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Menampilkan {visible.length} dari {formatNumber(filtered.length)} proyek
                {hasFilters ? " (terfilter)" : ""}.
              </p>
            </div>
            <span className="text-[10px] text-muted">Halaman {safePage} / {lastPage}</span>
          </div>

          {visible.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-2/60 text-[10px] uppercase tracking-[0.08em] text-muted">
                      <th scope="col" className="px-4 py-2.5 font-semibold">Proyek</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold">Tahun</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-semibold">Alokasi</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-semibold">Realisasi</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold">Progres</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visible.map((project) => (
                      <tr key={project.id} className="align-top text-xs hover:bg-surface-2/40">
                        <td className="px-4 py-3">
                          <p className="max-w-[280px] font-semibold leading-snug text-text">
                            {project.project_name}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                            {project.region?.name ?? "Wilayah tidak diketahui"} · {project.funding_source}
                          </p>
                          {project.contractor_name ? (
                            <p className="mt-0.5 text-[10px] text-muted">Kontraktor: {project.contractor_name}</p>
                          ) : null}
                        </td>
                        <td className="tabular px-3 py-3 text-muted">{project.fiscal_year}</td>
                        <td className="tabular px-3 py-3 text-right font-medium text-text">
                          {formatCompactRupiah(project.budget_allocated)}
                        </td>
                        <td className="tabular px-3 py-3 text-right text-muted">
                          {formatCompactRupiah(project.budget_realized)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-2">
                              <div
                                className="h-full rounded-full bg-interactive"
                                style={{
                                  width: `${Math.max(0, Math.min(100, Number(project.progress_percentage)))}%`,
                                }}
                              />
                            </div>
                            <span className="tabular text-[10px] text-muted">
                              {formatPercent(project.progress_percentage, 0)}
                            </span>
                          </div>
                          {project.target_completion_date ? (
                            <p className="mt-1 text-[10px] text-muted">
                              Target {formatDate(project.target_completion_date)}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={statusTone[project.status] ?? "neutral"}>
                            {PROJECT_STATUS[project.status]?.label ?? project.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Tidak ada proyek yang cocok"
              description="Ubah kata kunci, tahun, status, atau sumber dana untuk melihat proyek lain."
              action={
                <ButtonLink href="/data?tab=anggaran" variant="secondary" size="sm">
                  Reset filter
                </ButtonLink>
              }
            />
          )}

          <Pagination
            basePath="/data"
            currentPage={safePage}
            lastPage={lastPage}
            query={{ tab: "anggaran", ...query }}
          />
        </div>
      </div>
    </div>
  );
}
