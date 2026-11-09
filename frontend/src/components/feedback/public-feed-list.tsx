"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, FileText, Search } from "lucide-react";

import { EmptyState } from "@/components/ui/states";
import type { CitizenFeedback } from "@/types/public";
import { PublicFeedbackCard } from "./public-feedback-card";

export function PublicFeedList({
  initialFeedbacks,
}: {
  initialFeedbacks: CitizenFeedback[];
}) {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"latest" | "most_confirmed">("latest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...initialFeedbacks];

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.facility?.name.toLowerCase().includes(q) ||
          item.tracking_code.toLowerCase().includes(q),
      );
    }

    if (sort === "most_confirmed") {
      result.sort((a, b) => (b.confirmations_count ?? 0) - (a.confirmations_count ?? 0));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialFeedbacks, category, sort, search]);

  return (
    <div className="space-y-6">
      {/* Filters & Control Bar */}
      <div className="flex flex-col gap-3.5 rounded-xl border border-border bg-surface p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kata kunci, fasilitas..."
            className="w-full rounded-lg border border-border bg-surface-2/60 pl-9 pr-3 py-1.5 text-xs text-text placeholder:text-muted focus:border-interactive focus:outline-none focus:ring-1 focus:ring-interactive"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown/Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "disability_access", label: "Akses Disabilitas" },
              { id: "damage", label: "Kerusakan" },
              { id: "cleanliness", label: "Kebersihan" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  category === tab.id
                    ? "bg-interactive text-white shadow-xs"
                    : "border border-border bg-surface text-muted hover:text-text hover:bg-surface-2"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 border-l border-border pl-2">
            <button
              type="button"
              onClick={() => setSort((s) => (s === "latest" ? "most_confirmed" : "latest"))}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <ArrowUpDown className="size-3 text-muted" aria-hidden="true" />
              {sort === "latest" ? "Terbaru" : "Terbanyak Didukung"}
            </button>
          </div>
        </div>
      </div>

      {/* Feed List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <PublicFeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="Tidak ada laporan yang sesuai"
          description={
            search
              ? `Tidak ditemukan laporan publik untuk pencarian "${search}".`
              : "Belum ada laporan terverifikasi pada kategori ini."
          }
          action={
            <Link
              href="/aduan/buat"
              className="inline-flex items-center gap-1.5 rounded-lg bg-interactive px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-interactive-hover"
            >
              Kirim Aduan Baru
            </Link>
          }
        />
      )}
    </div>
  );
}
