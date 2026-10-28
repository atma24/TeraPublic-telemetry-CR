"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { AlertTriangle, Loader2, Pencil, Plus, Search, Trash2, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, inputClass, selectClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { deleteBudgetAction, saveBudgetAction } from "@/lib/actions/admin";
import { PROJECT_STATUS } from "@/lib/constants";
import { formatCompactRupiah, formatDate, formatDecimal, formatPercent } from "@/lib/format";
import type { AdminActionResult } from "@/types/actions";
import type { BudgetProject, PublicFacility, Region } from "@/types/public";

const initialResult: AdminActionResult = { ok: false };

export function BudgetAdminTable({
  projects,
  regions,
  facilities,
  currentPage,
  lastPage,
  status,
  initialOpen = false,
}: {
  projects: BudgetProject[];
  regions: Region[];
  facilities: PublicFacility[];
  currentPage: number;
  lastPage: number;
  status: string;
  initialOpen?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(initialOpen);
  const [editing, setEditing] = useState<BudgetProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetProject | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(project: BudgetProject) {
    setEditing(project);
    setOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteBudgetAction(deleteTarget.id);
      if (result.ok) {
        showToast({ tone: "success", title: "Proyek dihapus", description: result.message });
        setDeleteTarget(null);
        router.refresh();
      } else {
        showToast({ tone: "error", title: "Gagal menghapus", description: result.message });
      }
    });
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <form action="/admin/anggaran" className="flex flex-wrap items-center gap-2">
            <select
              name="status"
              defaultValue={status}
              aria-label="Filter status proyek"
              className={`${selectClass} h-9 w-auto min-w-44 text-xs`}
            >
              <option value="">Semua status</option>
              {Object.entries(PROJECT_STATUS).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
              <Search className="size-3.5" aria-hidden="true" />
              Terapkan
            </Button>
            {status ? (
              <Link
                href="/admin/anggaran"
                className="text-[11px] font-semibold text-muted hover:text-text hover:underline"
              >
                Reset
              </Link>
            ) : null}
          </form>
          <Button type="button" size="sm" onClick={openCreate} disabled={regions.length === 0}>
            <Plus className="size-3.5" aria-hidden="true" />
            Tambah proyek
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title={status ? "Tidak ada proyek pada status ini" : "Belum ada proyek anggaran"}
            description={
              status
                ? "Ubah filter status atau kembali ke semua proyek."
                : "Tambahkan proyek pertama untuk mulai mencatat alokasi dan realisasi."
            }
            action={
              status ? (
                <Link href="/admin/anggaran" className="text-xs font-semibold text-interactive hover:underline">
                  Hapus filter
                </Link>
              ) : (
                <Button type="button" size="sm" onClick={openCreate} disabled={regions.length === 0}>
                  <Plus className="size-3.5" aria-hidden="true" />
                  Tambah proyek
                </Button>
              )
            }
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-[10px] uppercase tracking-[0.08em] text-muted">
                  <th scope="col" className="px-4 py-2.5 font-semibold">Proyek</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Wilayah</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Alokasi</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Realisasi</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Progres</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => {
                  const meta = PROJECT_STATUS[project.status];
                  const absorption =
                    Number(project.budget_allocated) > 0
                      ? (Number(project.budget_realized) / Number(project.budget_allocated)) * 100
                      : 0;
                  return (
                    <tr key={project.id} className="text-xs transition-colors hover:bg-surface-2/40">
                      <td className="max-w-[280px] px-4 py-3">
                        <p className="truncate font-semibold text-text">{project.project_name}</p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {project.fiscal_year} · {project.funding_source}
                          {project.contractor_name ? ` · ${project.contractor_name}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted">
                        <p>{project.region?.name ?? "—"}</p>
                        {project.facility ? (
                          <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-muted/80">{project.facility.name}</p>
                        ) : null}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-[11px] text-text">
                        {formatCompactRupiah(project.budget_allocated)}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-[11px] text-muted">
                        {formatCompactRupiah(project.budget_realized)}
                        <span className="block text-[9px]">{formatPercent(absorption)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full rounded-full bg-interactive/70"
                              style={{ width: `${Math.min(100, Math.max(0, Number(project.progress_percentage)))}%` }}
                            />
                          </div>
                          <span className="tabular text-[10px] text-muted">
                            {formatDecimal(project.progress_percentage)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={meta?.tone ?? "neutral"}>{meta?.label ?? project.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(project)}
                            aria-label={`Edit ${project.project_name}`}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-text"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(project)}
                            aria-label={`Hapus ${project.project_name}`}
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
            basePath="/admin/anggaran"
            currentPage={currentPage}
            lastPage={lastPage}
            query={{ status: status || undefined }}
          />
        </div>
      </div>

      {open ? (
        <BudgetFormDialog
          key={editing?.id ?? "new"}
          project={editing}
          regions={regions}
          facilities={facilities}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      ) : null}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        title="Hapus proyek anggaran?"
        description="Data realisasi dan progres proyek akan hilang."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
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
            <span className="font-semibold text-text">{deleteTarget?.project_name}</span> akan dihapus dari daftar
            proyek. Ringkasan anggaran publik akan berubah.
          </p>
        </div>
      </Modal>
    </>
  );
}

function BudgetFormDialog({
  project,
  regions,
  facilities,
  onClose,
  onSaved,
}: {
  project: BudgetProject | null;
  regions: Region[];
  facilities: PublicFacility[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveBudgetAction, initialResult);
  const handled = useRef<AdminActionResult | null>(null);

  useEffect(() => {
    if (!state.ok || handled.current === state) return;
    handled.current = state;
    showToast({
      tone: "success",
      title: project ? "Proyek diperbarui" : "Proyek dibuat",
      description: state.message,
    });
    onSaved();
    router.refresh();
  }, [state, project, showToast, onSaved, router]);

  const isEdit = Boolean(project);
  const fieldErrors = state.fieldErrors ?? {};
  const dateValue = (value?: string | null) => (value ? value.slice(0, 10) : "");

  return (
    <Modal
      open
      onClose={() => {
        if (!pending) onClose();
      }}
      title={isEdit ? "Edit proyek anggaran" : "Tambah proyek anggaran"}
      description="Catat alokasi, realisasi, dan progres proyek."
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={pending}>
            Batal
          </Button>
          <Button type="submit" form="budget-form" size="sm" disabled={pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
            {isEdit ? "Simpan perubahan" : "Buat proyek"}
          </Button>
        </>
      }
    >
      <form id="budget-form" action={formAction} className="space-y-4">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}

        {state.message && !state.ok ? (
          <div className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-danger">{state.message}</p>
          </div>
        ) : null}

        <Field label="Nama proyek" htmlFor="budget-name" required error={fieldErrors.project_name}>
          <input
            id="budget-name"
            name="project_name"
            required
            defaultValue={project?.project_name ?? ""}
            className={inputClass}
            placeholder="Contoh: Rehabilitasi Gedung SDN 01"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kecamatan" htmlFor="budget-region" required error={fieldErrors.region_id}>
            <select
              id="budget-region"
              name="region_id"
              required
              defaultValue={project?.region_id ?? ""}
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
          <Field label="Fasilitas terkait" htmlFor="budget-facility" hint="Opsional.">
            <select
              id="budget-facility"
              name="facility_id"
              defaultValue={project?.facility_id ?? ""}
              className={selectClass}
            >
              <option value="">Tidak terhubung fasilitas</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Tahun anggaran" htmlFor="budget-year" required error={fieldErrors.fiscal_year}>
            <input
              id="budget-year"
              name="fiscal_year"
              type="number"
              min={2020}
              max={2030}
              required
              defaultValue={project?.fiscal_year ?? new Date().getFullYear()}
              className={inputClass}
            />
          </Field>
          <Field label="Sumber dana" htmlFor="budget-source" required error={fieldErrors.funding_source}>
            <input
              id="budget-source"
              name="funding_source"
              required
              defaultValue={project?.funding_source ?? "APBD DKI Jakarta"}
              className={inputClass}
              placeholder="APBD DKI Jakarta"
            />
          </Field>
          <Field label="Status" htmlFor="budget-status" required error={fieldErrors.status}>
            <select
              id="budget-status"
              name="status"
              required
              defaultValue={project?.status ?? "planning"}
              className={selectClass}
            >
              {Object.entries(PROJECT_STATUS).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Alokasi" htmlFor="budget-allocated" required error={fieldErrors.budget_allocated}>
            <input
              id="budget-allocated"
              name="budget_allocated"
              type="number"
              min={0}
              step="1000"
              required
              defaultValue={project?.budget_allocated ?? ""}
              className={inputClass}
              placeholder="0"
            />
          </Field>
          <Field label="Realisasi" htmlFor="budget-realized" error={fieldErrors.budget_realized}>
            <input
              id="budget-realized"
              name="budget_realized"
              type="number"
              min={0}
              step="1000"
              defaultValue={project?.budget_realized ?? 0}
              className={inputClass}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Progres fisik" htmlFor="budget-progress" error={fieldErrors.progress_percentage}>
            <input
              id="budget-progress"
              name="progress_percentage"
              type="number"
              min={0}
              max={100}
              step={1}
              defaultValue={project?.progress_percentage ?? 0}
              className={inputClass}
            />
          </Field>
          <Field label="Tanggal mulai" htmlFor="budget-start">
            <input
              id="budget-start"
              name="start_date"
              type="date"
              defaultValue={dateValue(project?.start_date)}
              className={inputClass}
            />
          </Field>
          <Field label="Target selesai" htmlFor="budget-target">
            <input
              id="budget-target"
              name="target_completion_date"
              type="date"
              defaultValue={dateValue(project?.target_completion_date)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Kontraktor" htmlFor="budget-contractor" hint="Opsional.">
          <input
            id="budget-contractor"
            name="contractor_name"
            defaultValue={project?.contractor_name ?? ""}
            className={inputClass}
            placeholder="Nama perusahaan pelaksana"
          />
        </Field>

        {project ? (
          <p className="text-[10px] leading-relaxed text-muted">
            Terakhir diperbarui {formatDate(project.updated_at)}.
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
