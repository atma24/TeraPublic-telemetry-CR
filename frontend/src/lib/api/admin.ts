import "server-only";

import { apiRequest } from "./client";
import type { CitizenFeedback, PublicFacility, Region } from "@/types/public";

export interface AdminListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  status?: string;
  category?: string;
}

function queryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getAdminFacilities(token: string, params: AdminListParams = {}) {
  return apiRequest<{
    status: string;
    data: PublicFacility[];
    meta: { current_page: number; total: number; last_page?: number; per_page?: number };
  }>(`/admin/facilities${queryString({ ...params })}`, { token, cache: "no-store" });
}

export function getAdminBudgetProjects(token: string, params: AdminListParams = {}) {
  return apiRequest<{
    status: string;
    data: import("@/types/public").BudgetProject[];
    meta: { current_page: number; total: number; last_page?: number; per_page?: number };
  }>(`/admin/budget-projects${queryString({ page: params.page, per_page: params.per_page, status: params.status })}`, {
    token,
    cache: "no-store",
  });
}

export function getAdminFeedbacks(token: string, params: AdminListParams = {}) {
  return apiRequest<{
    status: string;
    data: CitizenFeedback[];
    meta: { current_page: number; total: number; last_page?: number; per_page?: number };
  }>(`/admin/feedbacks${queryString({ page: params.page, per_page: params.per_page, status: params.status, category: params.category })}`, {
    token,
    cache: "no-store",
  });
}

export function getRegionsForAdmin(token: string) {
  return apiRequest<{ status: string; data: Region[] }>("/regions", {
    token,
    cache: "no-store",
  });
}
