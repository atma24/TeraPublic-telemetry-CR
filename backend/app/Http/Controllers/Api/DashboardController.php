<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BudgetProject;
use App\Models\CitizenFeedback;
use App\Models\EquityMetric;
use App\Models\PublicFacility;
use App\Models\Region;
use App\Services\BudgetMLPredictionService;
use App\Services\MLAnalyticsService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        protected BudgetMLPredictionService $budgetMLService,
        protected MLAnalyticsService $clusterMLService
    ) {}

    /**
     * Get comprehensive public dashboard overview and KPIs.
     */
    public function overview(): JsonResponse
    {
        // 1. Facility Stats
        $totalFacilities = PublicFacility::count();
        $accessibleCount = PublicFacility::where('has_wheelchair_ramp', true)
            ->orWhere('has_tactile_paving', true)
            ->orWhere('has_disabled_toilet', true)
            ->count();
        $accessibilityPct = $totalFacilities > 0 ? round(($accessibleCount / $totalFacilities) * 100, 1) : 0.0;

        // 2. Budget Stats (From 1,731 real projects)
        $totalAllocated = (float) BudgetProject::sum('budget_allocated');
        $totalRealized = (float) BudgetProject::sum('budget_realized');
        $realizationPct = $totalAllocated > 0 ? round(($totalRealized / $totalAllocated) * 100, 2) : 0.0;
        $totalProjects = BudgetProject::count();

        // 3. Equity & Regional Stats
        $totalDistricts = Region::where('level', 'district')->count();
        $underservedCount = EquityMetric::where('is_underserved', true)->count();
        $topUnderserved = EquityMetric::with('region')
            ->orderBy('ratio_per_10k_population', 'asc')
            ->take(5)
            ->get();

        // 4. Citizen Feedback Stats
        $totalFeedbacks = CitizenFeedback::count();
        $resolvedFeedbacks = CitizenFeedback::where('status', 'resolved')->count();

        // 5. City Breakdown
        $cities = Region::select('city')->distinct()->pluck('city');
        $cityBreakdown = [];
        foreach ($cities as $cityName) {
            $regionIds = Region::where('city', $cityName)->pluck('id');
            $cityBudget = (float) BudgetProject::whereIn('region_id', $regionIds)->sum('budget_allocated');
            $cityRealized = (float) BudgetProject::whereIn('region_id', $regionIds)->sum('budget_realized');
            $cityFacCount = PublicFacility::whereIn('region_id', $regionIds)->count();

            $cityBreakdown[] = [
                'city' => $cityName,
                'district_count' => $regionIds->count(),
                'facility_count' => $cityFacCount,
                'budget_allocated' => $cityBudget,
                'budget_realized' => $cityRealized,
                'realization_rate' => $cityBudget > 0 ? round(($cityRealized / $cityBudget) * 100, 2) : 0.0,
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'kpis' => [
                    'total_facilities' => $totalFacilities,
                    'accessible_facilities' => $accessibleCount,
                    'accessibility_percentage' => $accessibilityPct,
                    'total_budget_allocated' => $totalAllocated,
                    'total_budget_realized' => $totalRealized,
                    'realization_percentage' => $realizationPct,
                    'total_projects' => $totalProjects,
                    'total_districts' => $totalDistricts,
                    'underserved_districts' => $underservedCount,
                    'total_citizen_feedbacks' => $totalFeedbacks,
                    'resolved_citizen_feedbacks' => $resolvedFeedbacks,
                ],
                'top_underserved' => $topUnderserved,
                'city_breakdown' => $cityBreakdown,
            ],
        ]);
    }

    /**
     * Get Machine Learning APBD Predictions (Time Series, Risk, and 2027 Optimization).
     */
    public function budgetPredictions(): JsonResponse
    {
        $predictions = $this->budgetMLService->generatePredictions();

        return response()->json($predictions);
    }

    /**
     * Complete One-Stop Dashboard Payload (Overview + ML Predictions + Clusters).
     */
    public function fullDashboard(): JsonResponse
    {
        $overviewResponse = $this->overview()->getData(true);
        $predictions = $this->budgetMLService->generatePredictions();
        $clustering = $this->clusterMLService->runDistrictClustering();

        return response()->json([
            'status' => 'success',
            'dashboard_overview' => $overviewResponse['data'],
            'apbd_ml_predictions' => $predictions,
            'district_clustering' => $clustering,
        ]);
    }
}
