import type { PaginationMeta } from "./api";

export type Position = [number, number];

export interface PolygonGeometry {
  type: "Polygon";
  coordinates: Position[][];
}

export interface MultiPolygonGeometry {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export type RegionGeometry = PolygonGeometry | MultiPolygonGeometry | null;

export interface FacilityCategory {
  id: number;
  name: string;
  slug: string;
  icon_name?: string | null;
  description?: string | null;
}

export interface EquityMetric {
  id: number;
  region_id: number;
  category_id?: number | null;
  facility_count: number;
  ratio_per_10k_population: number;
  accessibility_score: number;
  equity_index: number;
  is_underserved: boolean;
  region?: Region;
}

export interface Region {
  id: number;
  code: string;
  name: string;
  city: string;
  level: string;
  population: number;
  area_km2: number | string;
  geometry?: RegionGeometry;
  facilities_count?: number;
  equity_metrics?: EquityMetric[];
}

export interface PublicFacility {
  id: number;
  category_id: number;
  region_id: number;
  name: string;
  sub_category?: string | null;
  npsn?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  status: "operational" | "renovation" | "closed";
  is_state_owned: boolean;
  capacity: number;
  has_wheelchair_ramp: boolean;
  has_tactile_paving: boolean;
  has_disabled_toilet: boolean;
  public_transport_nearby?: string | null;
  additional_specs?: unknown;
  category?: FacilityCategory;
  region?: Region;
  budgetProjects?: BudgetProject[];
  budget_projects?: BudgetProject[];
  feedbacks?: CitizenFeedback[];
  created_at?: string;
  updated_at?: string;
}

export interface BudgetProject {
  id: number;
  facility_id?: number | null;
  region_id: number;
  project_name: string;
  fiscal_year: number;
  funding_source: string;
  budget_allocated: number;
  budget_realized: number;
  status: "planning" | "procurement" | "tender" | "in_progress" | "completed";
  contractor_name?: string | null;
  start_date?: string | null;
  target_completion_date?: string | null;
  progress_percentage: number;
  facility?: PublicFacility | null;
  region?: Region;
  created_at?: string;
  updated_at?: string;
}

export interface CitizenFeedback {
  id: number;
  user_id?: number | null;
  facility_id?: number | null;
  tracking_code: string;
  citizen_name: string;
  citizen_email?: string | null;
  title: string;
  description: string;
  category: "damage" | "disability_access" | "project_delay" | "cleanliness";
  photo_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: "submitted" | "verified" | "in_review" | "resolved" | "rejected";
  admin_response?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at?: string;
  facility?: PublicFacility | null;
  user?: { id: number; name: string; email: string } | null;
}

export interface FacilitiesResponse {
  status: string;
  data: PublicFacility[];
  meta: PaginationMeta;
}

export interface RegionsResponse {
  status: string;
  data: Region[];
}

export interface RegionFeatureProperties {
  id: number;
  code: string;
  name: string;
  city: string;
  population: number;
  area_km2: number;
  facility_count: number;
  ratio_per_10k: number;
  accessibility_score: number;
  equity_index: number;
  is_underserved: boolean;
}

export interface RegionFeature {
  type: "Feature";
  properties: RegionFeatureProperties;
  geometry: RegionGeometry;
}

export interface RegionFeatureCollection {
  type: "FeatureCollection";
  features: RegionFeature[];
}

export interface BudgetProjectsResponse {
  status: string;
  summary: {
    total_projects: number;
    total_budget_allocated: number;
    total_budget_realized: number;
    realization_percentage: number;
  };
  data: BudgetProject[];
}

export interface EquityResponse {
  status: string;
  summary: {
    total_districts: number;
    underserved_count: number;
    adequate_count: number;
    average_ratio: number;
    average_accessibility: number;
  };
  rankings: EquityMetric[];
}

export interface DashboardKpis {
  total_facilities: number;
  accessible_facilities: number;
  accessibility_percentage: number;
  total_budget_allocated: number;
  total_budget_realized: number;
  realization_percentage: number;
  total_projects: number;
  total_districts: number;
  underserved_districts: number;
  total_citizen_feedbacks: number;
  resolved_citizen_feedbacks: number;
}

export interface CityBreakdown {
  city: string;
  district_count: number;
  facility_count: number;
  budget_allocated: number;
  budget_realized: number;
  realization_rate: number;
}

export interface DashboardOverview {
  kpis: DashboardKpis;
  top_underserved: EquityMetric[];
  city_breakdown: CityBreakdown[];
}

export interface DashboardOverviewResponse {
  status: string;
  data: DashboardOverview;
}

export interface FacilityDetailResponse {
  status: string;
  data: PublicFacility;
}

export interface FeedbackListResponse {
  status: string;
  total: number;
  data: CitizenFeedback[];
}

export interface FeedbackCreateResponse {
  status: string;
  message: string;
  data: CitizenFeedback;
}

export interface FeedbackTrackResponse {
  status: string;
  data: CitizenFeedback;
}
