"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { formatCompactRupiah, formatDecimal, formatNumber, formatPercent } from "@/lib/format";
import type { DashboardOverview } from "@/types/public";

interface LiveTelemetryRadarProps {
  overview: DashboardOverview | null;
  isOnline: boolean;
  isEn?: boolean;
  today: string;
}

export function LiveTelemetryRadar({
  overview,
  isOnline,
  isEn = false,
  today,
}: LiveTelemetryRadarProps) {
  const [activeTab, setActiveTab] = useState<"ringkasan" | "apbd" | "warga">("ringkasan");

  if (!isOnline || !overview) {
    return (
      <div className="card-hover overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-1 shadow-lift backdrop-blur-md">
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm font-semibold text-text">
            {isEn ? "Summary Currently Unavailable" : "Ringkasan belum tersedia"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {isEn
              ? "Data service is not responding. Other public pages remain accessible."
              : "Layanan data sedang tidak merespons. Angka akan muncul setelah koneksi data pulih."}
          </p>
        </div>
      </div>
    );
  }

  const kpis = overview.kpis;

  return (
    <div className="card-hover overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-1 shadow-lift backdrop-blur-md">
      <div className="rounded-xl border border-border bg-surface">
        {/* Live Top Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border px-3.5 py-2.5 sm:px-4 sm:py-3 bg-surface-2/40">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              {isEn ? "SYS // LIVE TELEMETRY RADAR" : "SYS // TELEMETRI WAKTU NYATA"}
            </span>
          </div>
          <span className="tabular text-[10px] font-medium text-muted">{today}</span>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex border-b border-border bg-surface-2/20 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("ringkasan")}
            className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === "ringkasan"
                ? "border-interactive text-interactive bg-surface"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {isEn ? "Overview" : "Ringkasan"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("apbd")}
            className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === "apbd"
                ? "border-interactive text-interactive bg-surface"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {isEn ? "APBD Telemetry" : "Telemetri APBD"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("warga")}
            className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === "warga"
                ? "border-interactive text-interactive bg-surface"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {isEn ? "Citizen Voice" : "Suara Warga"}
          </button>
        </div>

        {/* Tab 1: Ringkasan 4 Metrik */}
        {activeTab === "ringkasan" && (
          <>
            <div className="grid grid-cols-2 border-b border-border">
              <div className="border-r border-b border-border p-3 sm:p-3.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Fasilitas Terdata</span>
                <p className="mt-1 font-display text-lg font-bold text-text">{formatNumber(kpis.total_facilities)}</p>
                <p className="text-[10px] text-muted">{kpis.total_districts} kecamatan</p>
              </div>
              <div className="border-b border-border p-3 sm:p-3.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Aksesibilitas</span>
                <p className="mt-1 font-display text-lg font-bold text-text">{formatPercent(kpis.accessibility_percentage)}</p>
                <p className="text-[10px] text-muted">{kpis.accessible_facilities} ramah disabilitas</p>
              </div>
              <div className="border-r border-border p-3 sm:p-3.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Alokasi APBD</span>
                <p className="mt-1 font-display text-lg font-bold text-text">{formatCompactRupiah(kpis.total_budget_allocated)}</p>
                <p className="text-[10px] text-muted">Realisasi {formatPercent(kpis.realization_percentage)}</p>
              </div>
              <div className="p-3 sm:p-3.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Aduan Warga</span>
                <p className="mt-1 font-display text-lg font-bold text-text">{formatNumber(kpis.total_citizen_feedbacks)}</p>
                <p className="text-[10px] text-muted">{kpis.resolved_citizen_feedbacks} ditindaklanjuti</p>
              </div>
            </div>

            <div className="px-4 py-3 bg-surface">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  Kecamatan Titik Perhatian
                </p>
                <Link
                  href="/analitik"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-interactive hover:underline"
                >
                  Semua wilayah
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
              <ol className="mt-2.5 space-y-2">
                {overview.top_underserved.slice(0, 2).map((metric, index) => (
                  <li key={metric.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-text">
                      <span className="tabular text-muted mr-1.5 font-mono">0{index + 1}.</span>
                      {metric.region?.name ?? `Wilayah ${metric.region_id}`}
                    </span>
                    <span className="tabular font-mono text-[10px] text-muted">
                      {formatDecimal(metric.ratio_per_10k_population)} / 10rb
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        {/* Tab 2: APBD Telemetry Detail */}
        {activeTab === "apbd" && (
          <div className="p-4 space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted font-medium">Realisasi Belanja Modal APBD</span>
                <span className="font-bold text-text">{formatPercent(kpis.realization_percentage)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden border border-border/80">
                <div
                  className="h-full bg-interactive transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(5, kpis.realization_percentage))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                <span>{formatCompactRupiah(kpis.total_budget_realized)}</span>
                <span>Pagu {formatCompactRupiah(kpis.total_budget_allocated)}</span>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-surface-2/40 p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">Total Paket Proyek:</span>
                <span className="font-semibold text-text">{formatNumber(kpis.total_projects)} paket riil</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Cakupan Wilayah:</span>
                <span className="font-semibold text-text">5 Kota + Kep. Seribu</span>
              </div>
            </div>

            <Link
              href="/analitik"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-interactive px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-interactive-hover transition-colors"
            >
              Buka Visualisasi Grafik APBD Lengkap
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Tab 3: Citizen Voice Detail */}
        {activeTab === "warga" && (
          <div className="p-4 space-y-3.5">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-border bg-surface-2/40 p-2.5">
                <p className="text-[10px] uppercase font-bold text-muted">Aduan Masuk</p>
                <p className="font-display text-base font-bold text-text mt-0.5">{kpis.total_citizen_feedbacks}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface-2/40 p-2.5">
                <p className="text-[10px] uppercase font-bold text-muted">Ditindaklanjuti</p>
                <p className="font-display text-base font-bold text-emerald-600 mt-0.5">{kpis.resolved_citizen_feedbacks}</p>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Warga dapat melihat laporan secara transparan, memberikan konfirmasi kendala lapangan, atau mendaftarkan laporan fasilitas baru.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/lacak?tab=publik"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-interactive px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-interactive-hover transition-colors"
              >
                Pantau Feed Laporan Terbuka
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/aduan/buat"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-text hover:bg-surface-2 transition-colors"
              >
                Kirim Aduan Fasilitas Baru
              </Link>
            </div>
          </div>
        )}

        {/* Bottom 1-Click Access Action Bar */}
        <div className="flex items-center justify-between border-t border-border bg-surface-2/60 px-4 py-2.5">
          <Link
            href="/analitik"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
          >
            <span>Buka Telemetri Lengkap</span>
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
            1-CLICK ACCESS
          </span>
        </div>
      </div>
    </div>
  );
}
