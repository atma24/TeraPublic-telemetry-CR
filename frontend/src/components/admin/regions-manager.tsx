"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Loader2, MapPinned, Pencil, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { updateRegionAction } from "@/lib/actions/admin";
import { formatDecimal, formatNumber } from "@/lib/format";
import type { AdminActionResult } from "@/types/actions";
import type { Region } from "@/types/public";

const initialResult: AdminActionResult = { ok: false };

export function RegionsManager({ regions }: { regions: Region[] }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Region | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return regions;
    return regions.filter(
      (region) =>
        region.name.toLowerCase().includes(needle) || region.city.toLowerCase().includes(needle),
    );
  }, [regions, query]);

  return (
    <>
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari kecamatan atau kota"
              className={`${inputClass} h-9 pl-9 text-xs`}
              aria-label="Cari wilayah"
            />
          </div>
          <p className="text-[10px] text-muted">
            Menampilkan {filtered.length.toLocaleString("id-ID")} dari{" "}
            {regions.length.toLocaleString("id-ID")} kecamatan
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MapPinned}
            title="Wilayah tidak ditemukan"
            description="Coba kata kunci nama kecamatan atau kota yang lain."
            className="m-4"
          />
        ) : (
          <div className="max-h-[calc(100dvh-18rem)] overflow-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-surface-2">
                <tr className="border-b border-border text-[10px] uppercase tracking-[0.08em] text-muted">
                  <th scope="col" className="px-4 py-2.5 font-semibold">Kecamatan</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Kota</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Penduduk</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Luas (km²)</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Fasilitas</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((region) => (
                  <tr key={region.id} className="text-xs transition-colors hover:bg-surface-2/40">
                    <td className="px-4 py-2.5 font-semibold text-text">{region.name}</td>
                    <td className="px-4 py-2.5 text-[11px] text-muted">{region.city}</td>
                    <td className="tabular px-4 py-2.5 text-right text-[11px] text-muted">
                      {formatNumber(region.population)}
                    </td>
                    <td className="tabular px-4 py-2.5 text-right text-[11px] text-muted">
                      {formatDecimal(region.area_km2)}
                    </td>
                    <td className="tabular px-4 py-2.5 text-right text-[11px] text-muted">
                      {formatNumber(region.facilities_count ?? 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => setEditing(region)}
                        aria-label={`Edit ${region.name}`}
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-text"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing ? (
        <RegionDialog
          key={editing.id}
          region={editing}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      ) : null}
    </>
  );
}

function RegionDialog({
  region,
  onClose,
  onSaved,
}: {
  region: Region;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, formAction, pending] = useActionState(updateRegionAction, initialResult);
  const handled = useRef<AdminActionResult | null>(null);

  useEffect(() => {
    if (!state.ok || handled.current === state) return;
    handled.current = state;
    showToast({ tone: "success", title: "Wilayah diperbarui", description: state.message });
    onSaved();
    router.refresh();
  }, [state, onSaved, showToast, router]);

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${region.name}`}
      description={`${region.city} · kode ${region.code}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={pending}>
            Batal
          </Button>
          <Button type="submit" form="region-form" size="sm" disabled={pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
            Simpan
          </Button>
        </>
      }
    >
      <form id="region-form" action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={region.id} />

        {state.message && !state.ok ? (
          <div className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-danger">{state.message}</p>
          </div>
        ) : null}

        <Field
          label="Jumlah penduduk"
          htmlFor="region-population"
          required
          error={fieldErrors.population}
          hint="Gunakan angka jiwa, bukan ribuan."
        >
          <input
            id="region-population"
            name="population"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={region.population}
            className={inputClass}
          />
        </Field>

        <Field label="Luas wilayah (km²)" htmlFor="region-area" error={fieldErrors.area_km2}>
          <input
            id="region-area"
            name="area_km2"
            type="number"
            min={0}
            step="0.01"
            defaultValue={region.area_km2}
            className={inputClass}
          />
        </Field>

        <p className="text-[10px] leading-relaxed text-muted">
          Perubahan angka ini langsung memengaruhi indeks pemerataan setelah cache data disegarkan.
        </p>
      </form>
    </Modal>
  );
}
