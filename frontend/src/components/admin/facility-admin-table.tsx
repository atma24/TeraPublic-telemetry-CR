"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  Accessibility,
  AlertTriangle,
  Building2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form";
import { inputClass, selectClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { deleteFacilityAction, saveFacilityAction } from "@/lib/actions/admin";
import { FACILITY_STATUS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { AdminActionResult } from "@/types/actions";
import type { PublicFacility, Region } from "@/types/public";

interface CategoryOption {
  id: number;
  name: string;
}

const initialResult: AdminActionResult = { ok: false };

export function FacilityAdminTable({
  facilities,
  categories,
  regions,
  currentPage,
  lastPage,
  query,
  initialOpen = false,
}: {
  facilities: PublicFacility[];
  categories: CategoryOption[];
  regions: Region[];
  currentPage: number;
  lastPage: number;
  query: Record<string, string | undefined>;
  initialOpen?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(initialOpen);
  const [editing, setEditing] = useState<PublicFacility | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PublicFacility | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(facility: PublicFacility) {
    setEditing(facility);
    setOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteFacilityAction(deleteTarget.id);
      if (result.ok) {
        showToast({ tone: "success", title: "Fasilitas dihapus", description: result.message });
        setDeleteTarget(null);
        router.refresh();
      } else {
        showToast({ tone: "error", title: "Gagal menghapus", description: result.message });
      }
    });
  }

  const hasFilter = Boolean(query.search || query.category_id);

  return (
    <>
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <form action="/admin/fasilitas" className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                name="search"
                defaultValue={query.search ?? ""}
                placeholder="Cari nama fasilitas"
                className={`${inputClass} h-9 pl-9 text-xs`}
                aria-label="Cari fasilitas"
              />
            </div>
            <select
              name="category_id"
              defaultValue={query.category_id ?? ""}
              aria-label="Filter kategori"
              className={`${selectClass} h-9 w-auto min-w-36 text-xs`}
            >
              <option value="">Semua kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
              Terapkan
            </Button>
            {hasFilter ? (
              <Link
                href="/admin/fasilitas"
                className="text-[11px] font-semibold text-muted hover:text-text hover:underline"
              >
                Reset
              </Link>
            ) : null}
          </form>
          <Button type="button" size="sm" onClick={openCreate} disabled={categories.length === 0 || regions.length === 0}>
            <Plus className="size-3.5" aria-hidden="true" />
            Tambah fasilitas
          </Button>
        </div>

        {facilities.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={hasFilter ? "Tidak ada hasil" : "Belum ada fasilitas"}
            description={
              hasFilter
                ? "Coba kata kunci lain atau hapus filter kategori."
                : "Tambahkan fasilitas pertama untuk mulai mengelola data."
            }
            action={
              hasFilter ? (
                <Link
                  href="/admin/fasilitas"
                  className="text-xs font-semibold text-interactive hover:underline"
                >
                  Hapus filter
                </Link>
              ) : (
                <Button type="button" size="sm" onClick={openCreate} disabled={categories.length === 0 || regions.length === 0}>
                  <Plus className="size-3.5" aria-hidden="true" />
                  Tambah fasilitas
                </Button>
              )
            }
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-[10px] uppercase tracking-[0.08em] text-muted">
                  <th scope="col" className="px-4 py-2.5 font-semibold">Fasilitas</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Kecamatan</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Kapasitas</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Akses</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {facilities.map((facility) => {
                  const accessCount = [
                    facility.has_wheelchair_ramp,
                    facility.has_tactile_paving,
                    facility.has_disabled_toilet,
                  ].filter(Boolean).length;
                  const status = FACILITY_STATUS[facility.status];
                  return (
                    <tr key={facility.id} className="text-xs transition-colors hover:bg-surface-2/40">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-text">{facility.name}</p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {facility.category?.name ?? "Tanpa kategori"}
                          {facility.npsn ? ` · NPSN ${facility.npsn}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" aria-hidden="true" />
                          {facility.region?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={status?.tone ?? "neutral"}>{status?.label ?? facility.status}</Badge>
                      </td>
                      <td className="tabular px-4 py-3 text-right text-[11px] text-muted">
                        {formatNumber(facility.capacity)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                          <Accessibility className="size-3" aria-hidden="true" />
                          {accessCount} / 3
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/data/fasilitas/${facility.id}`}
                            target="_blank"
                            className="rounded-md px-2 py-1.5 text-[10px] font-semibold text-muted hover:bg-surface-2 hover:text-text"
                          >
                            Lihat
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEdit(facility)}
                            aria-label={`Edit ${facility.name}`}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-text"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(facility)}
                            aria-label={`Hapus ${facility.name}`}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-danger/8 hover:text-danger"
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-border px-4 py-3">
          <Pagination
            basePath="/admin/fasilitas"
            currentPage={currentPage}
            lastPage={lastPage}
            query={query}
          />
        </div>
      </div>

      {open ? (
        <FacilityFormDialog
          key={editing?.id ?? "new"}
          facility={editing}
          categories={categories}
          regions={regions}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      ) : null}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => (isDeleting ? undefined : setDeleteTarget(null))}
        title="Hapus fasilitas?"
        description="Tindakan ini tidak dapat dibatalkan."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
              Hapus
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-danger/10 text-danger">
            <AlertTriangle className="size-4" aria-hidden="true" />
          </span>
          <p className="text-xs leading-relaxed text-muted">
            <span className="font-semibold text-text">{deleteTarget?.name}</span> akan dihapus dari daftar fasilitas.
            Data anggaran atau aduan yang terkait dapat kehilangan tautan fasilitas.
          </p>
        </div>
      </Modal>
    </>
  );
}

function FacilityFormDialog({
  facility,
  categories,
  regions,
  onClose,
  onSaved,
}: {
  facility: PublicFacility | null;
  categories: CategoryOption[];
  regions: Region[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveFacilityAction, initialResult);
  const handled = useRef<AdminActionResult | null>(null);

  useEffect(() => {
    if (!state.ok || handled.current === state) return;
    handled.current = state;
    showToast({ tone: "success", title: facility ? "Fasilitas diperbarui" : "Fasilitas dibuat", description: state.message });
    onSaved();
    router.refresh();
  }, [state, facility, showToast, onSaved, router]);

  const isEdit = Boolean(facility);
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <Modal
      open
      onClose={() => {
        if (!pending) onClose();
      }}
      title={isEdit ? "Edit fasilitas" : "Tambah fasilitas"}
      description={isEdit ? "Perbarui profil dan atribut akses fasilitas." : "Isi data dasar fasilitas baru."}
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={pending}>
            Batal
          </Button>
          <Button type="submit" form="facility-form" size="sm" disabled={pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
            {isEdit ? "Simpan perubahan" : "Buat fasilitas"}
          </Button>
        </>
      }
    >
      <form id="facility-form" action={formAction} className="space-y-4">
        {facility ? <input type="hidden" name="id" value={facility.id} /> : null}

        {state.message && !state.ok ? (
          <div className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-danger">{state.message}</p>
          </div>
        ) : null}

        <Field label="Nama fasilitas" htmlFor="facility-name" required error={fieldErrors.name}>
          <input
            id="facility-name"
            name="name"
            required
            defaultValue={facility?.name ?? ""}
            className={inputClass}
            placeholder="Contoh: SD Negeri 01 Menteng"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori" htmlFor="facility-category" required error={fieldErrors.category_id}>
            <select
              id="facility-category"
              name="category_id"
              required
              defaultValue={facility?.category_id ?? ""}
              className={selectClass}
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kecamatan" htmlFor="facility-region" required error={fieldErrors.region_id}>
            <select
              id="facility-region"
              name="region_id"
              required
              defaultValue={facility?.region_id ?? ""}
              className={selectClass}
            >
              <option value="">Pilih kecamatan</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name} — {region.city}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sub-kategori" htmlFor="facility-subcategory" hint="Opsional, misalnya jenjang sekolah.">
            <input
              id="facility-subcategory"
              name="sub_category"
              defaultValue={facility?.sub_category ?? ""}
              className={inputClass}
              placeholder="SD / SMP / SMA / Pasar"
            />
          </Field>
          <Field label="Status" htmlFor="facility-status" required error={fieldErrors.status}>
            <select
              id="facility-status"
              name="status"
              required
              defaultValue={facility?.status ?? "operational"}
              className={selectClass}
            >
              <option value="operational">Beroperasi</option>
              <option value="renovation">Renovasi</option>
              <option value="closed">Tutup</option>
            </select>
          </Field>
        </div>

        {!isEdit ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="NPSN" htmlFor="facility-npsn" hint="Kosongkan bila bukan sekolah.">
              <input id="facility-npsn" name="npsn" className={inputClass} placeholder="20100000" />
            </Field>
            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-text">
                <input
                  type="checkbox"
                  name="is_state_owned"
                  defaultChecked
                  className="size-4 rounded border-border accent-interactive"
                />
                Milik negara
              </label>
            </div>
          </div>
        ) : (
          <p className="rounded-md border border-border bg-surface-2/60 px-3 py-2 text-[10px] leading-relaxed text-muted">
            NPSN dan status kepemilikan tidak dapat diubah dari form ini.
          </p>
        )}

        <Field label="Alamat" htmlFor="facility-address">
          <input
            id="facility-address"
            name="address"
            defaultValue={facility?.address ?? ""}
            className={inputClass}
            placeholder="Jalan dan nomor"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Lintang" htmlFor="facility-latitude" required error={fieldErrors.latitude}>
            <input
              id="facility-latitude"
              name="latitude"
              type="number"
              step="any"
              required
              defaultValue={facility?.latitude ?? ""}
              className={inputClass}
              placeholder="-6.200"
            />
          </Field>
          <Field label="Bujur" htmlFor="facility-longitude" required error={fieldErrors.longitude}>
            <input
              id="facility-longitude"
              name="longitude"
              type="number"
              step="any"
              required
              defaultValue={facility?.longitude ?? ""}
              className={inputClass}
              placeholder="106.816"
            />
          </Field>
          <Field label="Kapasitas" htmlFor="facility-capacity" error={fieldErrors.capacity}>
            <input
              id="facility-capacity"
              name="capacity"
              type="number"
              min={0}
              defaultValue={facility?.capacity ?? 0}
              className={inputClass}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="text-xs font-semibold text-text">Atribut akses</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {(
              [
                ["has_wheelchair_ramp", "Ramp kursi roda", facility?.has_wheelchair_ramp],
                ["has_tactile_paving", "Ubin taktil", facility?.has_tactile_paving],
                ["has_disabled_toilet", "Toilet disabilitas", facility?.has_disabled_toilet],
              ] as const
            ).map(([name, label, checked]) => (
              <label
                key={name}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-[11px] font-medium text-text"
              >
                <input
                  type="checkbox"
                  name={name}
                  defaultChecked={checked ?? false}
                  className="size-3.5 rounded border-border accent-interactive"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Transportasi publik terdekat" htmlFor="facility-transport" hint="Contoh: Halte TransJakarta Bundaran HI.">
          <input
            id="facility-transport"
            name="public_transport_nearby"
            defaultValue={facility?.public_transport_nearby ?? ""}
            className={inputClass}
          />
        </Field>
      </form>
    </Modal>
  );
}
