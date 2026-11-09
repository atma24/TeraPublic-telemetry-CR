"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { formatCompactRupiah, formatDecimal } from "@/lib/format";
import type { MLClusterGroup, MLDistrict, Urgency } from "@/types/ml";

const urgencyTone: Record<string, BadgeTone> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

const urgencyLabel: Record<string, string> = {
  high: "Prioritas Tinggi (Kritis)",
  medium: "Perlu Perhatian",
  low: "Relatif Stabil",
};

export function RiskDistrictsTable({
  clusters,
}: {
  clusters: MLClusterGroup[];
}) {
  const [search, setSearch] = useState("");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");

  const allDistricts = useMemo(() => {
    const list: MLDistrict[] = [];
    for (const group of clusters) {
      for (const d of group.districts) {
        list.push({
          ...d,
          urgency: (group.urgency as Urgency) ?? d.urgency,
        });
      }
    }
    return list;
  }, [clusters]);

  const filtered = useMemo(() => {
    return allDistricts.filter((item) => {
      const matchSearch =
        search.trim() === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase());

      const matchUrgency = filterUrgency === "all" || item.urgency === filterUrgency;

      return matchSearch && matchUrgency;
    });
  }, [allDistricts, search, filterUrgency]);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kecamatan / kota..."
            className="w-full rounded-lg border border-border bg-surface-2/60 pl-9 pr-3 py-1.5 text-xs text-text placeholder:text-muted focus:border-interactive focus:outline-none focus:ring-1 focus:ring-interactive"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted mr-1">Status:</span>
          {[
            { id: "all", label: "Semua" },
            { id: "high", label: "Kritis" },
            { id: "medium", label: "Perhatian" },
            { id: "low", label: "Stabil" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterUrgency(tab.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                filterUrgency === tab.id
                  ? "bg-interactive text-white shadow-xs"
                  : "border border-border bg-surface text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted font-bold">
              <th className="py-2.5 pl-1 pr-3">Kecamatan</th>
              <th className="px-3 py-2.5">Wilayah</th>
              <th className="px-3 py-2.5">Tingkat Urgensi</th>
              <th className="px-3 py-2.5 text-right">Rasio / 10k</th>
              <th className="px-3 py-2.5 text-right">Pagu APBD</th>
              <th className="py-2.5 pl-3 pr-1 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={`${item.name}-${item.city}`} className="hover:bg-surface-2/40 transition-colors">
                  <td className="py-2.5 pl-1 pr-3 font-semibold text-text">{item.name}</td>
                  <td className="px-3 py-2.5 text-muted">{item.city}</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={urgencyTone[item.urgency] ?? "neutral"}>
                      {urgencyLabel[item.urgency] ?? item.urgency}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular text-text font-mono font-medium">
                    {formatDecimal(item.ratio_per_10k)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular text-muted font-mono">
                    {formatCompactRupiah(item.budget_allocated)}
                  </td>
                  <td className="py-2.5 pl-3 pr-1 text-right">
                    <Link
                      href={`/data?search=${encodeURIComponent(item.name)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-interactive hover:underline"
                    >
                      Buka
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-muted">
                  Tidak ada kecamatan yang cocok dengan kata kunci &quot;{search}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted border-t border-border/60 pt-2.5">
        <span>Menampilkan {filtered.length} dari {allDistricts.length} kecamatan</span>
        <span className="font-mono text-[10px]">ML CLUSTERING K-MEANS</span>
      </div>
    </div>
  );
}
