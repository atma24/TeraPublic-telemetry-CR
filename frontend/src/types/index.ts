export interface Region {
  id: number;
  code: string;
  name: string;
  city: string;
  level: string;
  population: number;
  area_km2: number;
  geometry?: any;
  facilities_count?: number;
  equity_metrics?: EquityMetric[];
}

export interface FacilityCategory {
  id: number;
  name: string;
  slug: string;
  icon_name?: string;
  description?: string;
}

export interface PublicFacility {
  id: number;
  category_id: number;
  region_id: number;
  name: string;
  sub_category?: string;
  npsn?: string | null;
  address?: string;
  latitude: number;
  longitude: number;
  status: 'operational' | 'renovation' | 'closed';
  is_state_owned: boolean;
  capacity: number;
  has_wheelchair_ramp: boolean;
  has_tactile_paving: boolean;
  has_disabled_toilet: boolean;
  public_transport_nearby?: string;
  category?: FacilityCategory;
  region?: Region;
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
  status: 'planning' | 'procurement' | 'in_progress' | 'completed';
  contractor_name?: string;
  start_date?: string;
  target_completion_date?: string;
  progress_percentage: number;
  facility?: PublicFacility;
  region?: Region;
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

export interface CitizenFeedback {
  id: number;
  facility_id?: number | null;
  tracking_code: string;
  citizen_name: string;
  citizen_email?: string;
  title: string;
  description: string;
  category: 'damage' | 'disability_access' | 'project_delay' | 'cleanliness';
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  status: 'submitted' | 'verified' | 'in_review' | 'resolved' | 'rejected';
  admin_response?: string;
  created_at: string;
  facility?: PublicFacility;
}
