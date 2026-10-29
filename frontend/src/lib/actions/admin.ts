"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/client";
import { requireAdmin } from "@/lib/auth/session";
import type { AdminActionResult } from "@/types/actions";
import type { BudgetProject, PublicFacility } from "@/types/public";

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function optionalNumber(formData: FormData, key: string): number | null {
  const raw = value(formData, key);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function requiredNumber(formData: FormData, key: string): number | null {
  return optionalNumber(formData, key);
}

function booleanValue(formData: FormData, key: string): boolean {
  const raw = formData.get(key);
  return raw === "on" || raw === "1" || raw === "true";
}

function fieldErrorsFrom(error: ApiError): Record<string, string> | undefined {
  if (!error.errors) return undefined;
  return Object.fromEntries(
    Object.entries(error.errors).map(([field, messages]) => [field, messages[0] ?? "Nilai tidak valid."]),
  );
}

function exceptionResult(error: unknown): AdminActionResult {
  if (error instanceof ApiError) {
    return { ok: false, message: error.message, fieldErrors: fieldErrorsFrom(error) };
  }
  throw error;
}

function revalidateData() {
  for (const tag of ["facilities", "budget", "dashboard", "equity", "regions", "feedback", "clustering", "budget-predictions"]) {
    revalidateTag(tag, "max");
  }
  revalidatePath("/");
  revalidatePath("/data");
  revalidatePath("/analitik");
  revalidatePath("/admin");
}

export async function saveFacilityAction(
  _previousState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const session = await requireAdmin("/admin/fasilitas");
  const id = Number(value(formData, "id") || 0);
  const isEdit = id > 0;

  const name = value(formData, "name");
  const categoryId = requiredNumber(formData, "category_id");
  const regionId = requiredNumber(formData, "region_id");
  const latitude = requiredNumber(formData, "latitude");
  const longitude = requiredNumber(formData, "longitude");
  const status = value(formData, "status");
  const capacity = Math.round(requiredNumber(formData, "capacity") ?? 0);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nama fasilitas wajib diisi.";
  if (!categoryId) fieldErrors.category_id = "Kategori wajib dipilih.";
  if (!regionId) fieldErrors.region_id = "Kecamatan wajib dipilih.";
  if (latitude === null) fieldErrors.latitude = "Lintang wajib berupa angka.";
  if (longitude === null) fieldErrors.longitude = "Bujur wajib berupa angka.";
  if (!["operational", "renovation", "closed"].includes(status)) fieldErrors.status = "Status tidak valid.";
  if (capacity < 0) fieldErrors.capacity = "Kapasitas tidak boleh negatif.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data fasilitas.", fieldErrors };
  }

  const body: Record<string, unknown> = {
    category_id: categoryId,
    region_id: regionId,
    name,
    sub_category: value(formData, "sub_category") || null,
    address: value(formData, "address") || null,
    latitude,
    longitude,
    status,
    capacity,
    has_wheelchair_ramp: booleanValue(formData, "has_wheelchair_ramp"),
    has_tactile_paving: booleanValue(formData, "has_tactile_paving"),
    has_disabled_toilet: booleanValue(formData, "has_disabled_toilet"),
    public_transport_nearby: value(formData, "public_transport_nearby") || null,
  };
  if (!isEdit) {
    body.npsn = value(formData, "npsn") || null;
    body.is_state_owned = booleanValue(formData, "is_state_owned");
  }

  try {
    const response = await apiRequest<{ status: string; message: string; data: PublicFacility }>(
      isEdit ? `/admin/facilities/${id}` : "/admin/facilities",
      {
        method: isEdit ? "PUT" : "POST",
        token: session.token,
        body,
        cache: "no-store",
      },
    );
    revalidateData();
    return { ok: true, message: response.message, entityId: response.data.id };
  } catch (error) {
    return exceptionResult(error);
  }
}

export async function deleteFacilityAction(id: number): Promise<AdminActionResult> {
  const session = await requireAdmin("/admin/fasilitas");
  if (!id) return { ok: false, message: "ID fasilitas tidak valid." };

  try {
    const response = await apiRequest<{ status: string; message: string }>(`/admin/facilities/${id}`, {
      method: "DELETE",
      token: session.token,
      cache: "no-store",
    });
    revalidateData();
    return { ok: true, message: response.message };
  } catch (error) {
    return exceptionResult(error);
  }
}

export async function saveBudgetAction(
  _previousState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const session = await requireAdmin("/admin/anggaran");
  const id = Number(value(formData, "id") || 0);
  const isEdit = id > 0;

  const projectName = value(formData, "project_name");
  const regionId = requiredNumber(formData, "region_id");
  const fiscalYear = requiredNumber(formData, "fiscal_year");
  const fundingSource = value(formData, "funding_source");
  const allocated = requiredNumber(formData, "budget_allocated");
  const realized = optionalNumber(formData, "budget_realized") ?? 0;
  const status = value(formData, "status");
  const progress = Math.round(optionalNumber(formData, "progress_percentage") ?? 0);

  const fieldErrors: Record<string, string> = {};
  if (!projectName) fieldErrors.project_name = "Nama proyek wajib diisi.";
  if (!regionId) fieldErrors.region_id = "Kecamatan wajib dipilih.";
  if (!fiscalYear || fiscalYear < 2020 || fiscalYear > 2030) {
    fieldErrors.fiscal_year = "Tahun anggaran harus antara 2020 dan 2030.";
  }
  if (!fundingSource) fieldErrors.funding_source = "Sumber dana wajib diisi.";
  if (allocated === null || allocated < 0) fieldErrors.budget_allocated = "Alokasi wajib berupa angka positif.";
  if (realized < 0) fieldErrors.budget_realized = "Realisasi tidak boleh negatif.";
  if (!["planning", "procurement", "tender", "in_progress", "completed"].includes(status)) {
    fieldErrors.status = "Status proyek tidak valid.";
  }
  if (progress < 0 || progress > 100) fieldErrors.progress_percentage = "Progres harus 0–100.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data proyek.", fieldErrors };
  }

  const facilityId = optionalNumber(formData, "facility_id");
  const body: Record<string, unknown> = {
    region_id: regionId,
    facility_id: facilityId,
    project_name: projectName,
    fiscal_year: fiscalYear,
    funding_source: fundingSource,
    budget_allocated: allocated,
    budget_realized: realized,
    status,
    contractor_name: value(formData, "contractor_name") || null,
    start_date: value(formData, "start_date") || null,
    target_completion_date: value(formData, "target_completion_date") || null,
    progress_percentage: progress,
  };

  try {
    const response = await apiRequest<{ status: string; message: string; data: BudgetProject }>(
      isEdit ? `/admin/budget-projects/${id}` : "/admin/budget-projects",
      {
        method: isEdit ? "PUT" : "POST",
        token: session.token,
        body,
        cache: "no-store",
      },
    );
    revalidateData();
    return { ok: true, message: response.message, entityId: response.data.id };
  } catch (error) {
    return exceptionResult(error);
  }
}

export async function deleteBudgetAction(id: number): Promise<AdminActionResult> {
  const session = await requireAdmin("/admin/anggaran");
  if (!id) return { ok: false, message: "ID proyek tidak valid." };

  try {
    const response = await apiRequest<{ status: string; message: string }>(`/admin/budget-projects/${id}`, {
      method: "DELETE",
      token: session.token,
      cache: "no-store",
    });
    revalidateData();
    return { ok: true, message: response.message };
  } catch (error) {
    return exceptionResult(error);
  }
}

export async function respondFeedbackAction(
  _previousState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const session = await requireAdmin("/admin/aduan");
  const id = Number(value(formData, "id") || 0);
  const status = value(formData, "status");
  const responseText = value(formData, "admin_response");

  const fieldErrors: Record<string, string> = {};
  if (!id) fieldErrors.id = "ID aduan tidak valid.";
  if (!["verified", "in_review", "resolved", "rejected"].includes(status)) {
    fieldErrors.status = "Status tindak lanjut tidak valid.";
  }
  if (!responseText) fieldErrors.admin_response = "Tanggapan admin wajib diisi.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali tindak lanjut.", fieldErrors };
  }

  try {
    const response = await apiRequest<{ status: string; message: string }>(`/admin/feedbacks/${id}/respond`, {
      method: "PATCH",
      token: session.token,
      body: { status, admin_response: responseText },
      cache: "no-store",
    });
    revalidateTag("feedback", "max");
    revalidatePath("/admin/aduan");
    revalidatePath("/aduan/saya");
    return { ok: true, message: response.message };
  } catch (error) {
    return exceptionResult(error);
  }
}

export async function updateRegionAction(
  _previousState: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const session = await requireAdmin("/admin/wilayah");
  const id = Number(value(formData, "id") || 0);
  const populationRaw = requiredNumber(formData, "population");
  const population = populationRaw === null ? null : Math.round(populationRaw);
  const area = optionalNumber(formData, "area_km2");

  const fieldErrors: Record<string, string> = {};
  if (!id) fieldErrors.id = "ID wilayah tidak valid.";
  if (population === null || population < 0) fieldErrors.population = "Penduduk wajib berupa angka positif.";
  if (area !== null && area < 0) fieldErrors.area_km2 = "Luas tidak boleh negatif.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data wilayah.", fieldErrors };
  }

  try {
    const response = await apiRequest<{ status: string; message: string }>(`/admin/regions/${id}`, {
      method: "PUT",
      token: session.token,
      body: { population, area_km2: area },
      cache: "no-store",
    });
    revalidateTag("regions", "max");
    revalidatePath("/admin/wilayah");
    revalidatePath("/data");
    return { ok: true, message: response.message };
  } catch (error) {
    return exceptionResult(error);
  }
}
