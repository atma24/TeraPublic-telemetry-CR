export type Urgency = "high" | "medium" | "low";

export interface MLDistrict {
  region_id: number;
  name: string;
  city: string;
  population: number;
  facility_count: number;
  ratio_per_10k: number;
  disability_rate: number;
  budget_allocated: number;
  cluster_id: number;
  cluster_label: string;
  urgency: Urgency;
}

export interface MLClusterGroup {
  label: string;
  urgency: Urgency | string;
  color: string;
  districts: MLDistrict[];
}

export interface MLAnomaly {
  region_id: number;
  name: string;
  city: string;
  population: number;
  ratio_per_10k: number;
  reason: string;
}

export interface MLClusteringResponse {
  status: string;
  algorithm: string;
  silhouette_score?: number;
  model_metadata?: {
    k: number;
    features: string[];
    total_districts_analyzed: number;
  };
  summary: {
    critical_count: number;
    moderate_count: number;
    stable_count: number;
    anomalies_detected: number;
  };
  clusters: MLClusterGroup[];
  anomalies: MLAnomaly[];
  policy_recommendations?: Record<string, string>;
}

export interface HistoricalMonth {
  periode: string;
  year: number;
  month: number;
  total_allocated: number;
  total_realized: number;
  absorption_rate: number;
}

export interface ForecastMonth {
  periode: string;
  label: string;
  is_prediction: boolean;
  predicted_monthly_realized: number;
  predicted_cumulative_realized: number;
  estimated_monthly_rate: number;
}

export interface YearEndSummary {
  fiscal_year: number;
  total_allocated: number;
  predicted_total_realized: number;
  predicted_absorption_percentage: number;
  estimated_silpa: number;
  confidence_interval_95: {
    lower_bound_rate: number;
    upper_bound_rate: number;
  };
}

export interface AbsorptionRiskRank {
  region_id: number;
  name: string;
  city: string;
  project_count: number;
  budget_allocated: number;
  budget_realized: number;
  realization_rate: number;
  avg_physical_progress: number;
  disparity_lag: number;
  risk_level: "HIGH_RISK" | "MEDIUM_RISK" | "LOW_RISK" | string;
  risk_color: string;
  recommendation: string;
}

export interface Budget2027Priority {
  region_id: number;
  name: string;
  city: string;
  population: number;
  current_ratio_per_10k: number;
  equity_priority_index: number;
  recommended_budget_2027: number;
  budget_share_percentage: number;
}

export interface BudgetPredictionsResponse {
  status: string;
  model: string;
  engine?: string;
  models_applied: string[];
  python_metadata?: {
    numpy_version?: string;
    pipeline_status?: string;
    models?: Array<{
      name: string;
      algorithm: string;
      r2_score?: number;
      mae?: number;
      rmse?: number;
      silhouette_score?: number;
    }>;
  };
  time_series_forecast: {
    historical_months: HistoricalMonth[];
    forecasted_months: ForecastMonth[];
    year_end_summary: YearEndSummary;
  };
  district_absorption_risks: {
    summary: {
      total_districts: number;
      high_risk_count: number;
      medium_risk_count: number;
      low_risk_count: number;
    };
    rankings: AbsorptionRiskRank[];
  };
  budget_2027_recommendations: {
    fiscal_year_target: number;
    total_target_pool: number;
    top_priority_districts: Budget2027Priority[];
    full_district_distribution?: unknown;
  };
  policy_insights: {
    key_takeaways: string[];
    strategic_action: string;
  };
}

export interface AssistantResponse {
  status: string;
  engine: string;
  model: string;
  answer: string;
  citations: string[];
  matched_region?: string | null;
  source?: string;
}
