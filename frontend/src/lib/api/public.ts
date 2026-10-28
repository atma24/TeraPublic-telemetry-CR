import "server-only";

import { apiRequest } from "./client";
import type {
  BudgetPredictionsResponse,
  MLClusteringResponse,
} from "@/types/ml";
import type {
  BudgetProjectsResponse,
  DashboardOverviewResponse,
  EquityResponse,
  FacilitiesResponse,
  FacilityDetailResponse,
  FeedbackListResponse,
  FeedbackTrackResponse,
  PublicFacility,
  RegionFeatureCollection,
  RegionsResponse,
} from "@/types/public";

const PUBLIC_REVALIDATE = 120;

export function getDashboardOverview() {
  return apiRequest<DashboardOverviewResponse>("/dashboard/overview", {
    next: { revalidate: 300, tags: ["dashboard"] },
  });
}

export function getEquity() {
  return apiRequest<EquityResponse>("/equity", {
    next: { revalidate: 300, tags: ["equity"] },
  });
}

export function getClustering() {
  return apiRequest<MLClusteringResponse>("/analytics/ml-clustering", {
    next: { revalidate: 900, tags: ["clustering"] },
  });
}

export function getBudgetPredictions() {
  return apiRequest<BudgetPredictionsResponse>("/dashboard/budget-predictions", {
    next: { revalidate: 900, tags: ["budget-predictions"] },
  });
}

export interface FacilityQuery {
  page?: number;
  per_page?: number;
  category?: string;
  region_id?: number;
  search?: string;
  has_wheelchair_ramp?: boolean;
  has_tactile_paving?: boolean;
  has_disabled_toilet?: boolean;
}

export function getFacilities(query: FacilityQuery = {}) {
  const params = new URLSearchParams();
  params.set("per_page", String(Math.min(100, Math.max(10, query.per_page ?? 24))));
  params.set("page", String(Math.max(1, query.page ?? 1)));
  if (query.category) params.set("category", query.category);
  if (query.region_id) params.set("region_id", String(query.region_id));
  if (query.search) params.set("search", query.search);
  if (query.has_wheelchair_ramp) params.set("has_wheelchair_ramp", "1");
  if (query.has_tactile_paving) params.set("has_tactile_paving", "1");
  if (query.has_disabled_toilet) params.set("has_disabled_toilet", "1");

  return apiRequest<FacilitiesResponse>(`/facilities?${params.toString()}`, {
    next: { revalidate: PUBLIC_REVALIDATE, tags: ["facilities"] },
  });
}

export async function getAllFacilities(): Promise<PublicFacility[]> {
  const first = await getFacilities({ page: 1, per_page: 100 });
  const lastPage = first.meta.last_page ?? 1;
  if (lastPage <= 1) return first.data;

  const rest = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      getFacilities({ page: index + 2, per_page: 100 }),
    ),
  );

  return [first, ...rest].flatMap((page) => page.data);
}

export function getFacility(id: number | string) {
  return apiRequest<FacilityDetailResponse>(`/facilities/${id}`, {
    next: { revalidate: PUBLIC_REVALIDATE, tags: ["facilities"] },
  });
}

export function getRegions() {
  return apiRequest<RegionsResponse>("/regions", {
    next: { revalidate: 600, tags: ["regions"] },
  });
}

export function getRegionsGeoJSON() {
  return apiRequest<RegionFeatureCollection>("/regions/geojson", {
    next: { revalidate: 600, tags: ["regions"] },
  });
}

export interface BudgetProjectQuery {
  fiscal_year?: number;
  funding_source?: string;
  status?: string;
}

export function getBudgetProjects(query: BudgetProjectQuery = {}) {
  const params = new URLSearchParams();
  if (query.fiscal_year) params.set("fiscal_year", String(query.fiscal_year));
  if (query.funding_source) params.set("funding_source", query.funding_source);
  if (query.status) params.set("status", query.status);
  const suffix = params.toString() ? `?${params.toString()}` : "";

  return apiRequest<BudgetProjectsResponse>(`/budget-projects${suffix}`, {
    next: { revalidate: 300, tags: ["budget"] },
  });
}

export function getPublicFeedbackByCode(code: string) {
  return apiRequest<FeedbackTrackResponse>(`/feedback/track/${encodeURIComponent(code)}`, {
    next: { revalidate: 30, tags: ["feedback"] },
  });
}

export function getMyFeedbacks(token: string) {
  return apiRequest<FeedbackListResponse>("/citizen/feedbacks", {
    token,
    cache: "no-store",
  });
}
