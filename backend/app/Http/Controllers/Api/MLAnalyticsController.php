<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MLAnalyticsService;
use Illuminate\Http\JsonResponse;

class MLAnalyticsController extends Controller
{
    public function __construct(
        protected MLAnalyticsService $mlService
    ) {}

    /**
     * Get District Disparity & Priority Intervention Clustering (Public).
     */
    public function clustering(): JsonResponse
    {
        $result = $this->mlService->runDistrictClustering();

        return response()->json($result);
    }
}
