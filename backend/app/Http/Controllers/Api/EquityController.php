<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquityMetric;
use Illuminate\Http\JsonResponse;

class EquityController extends Controller
{
    public function index(): JsonResponse
    {
        $metrics = EquityMetric::with('region')
            ->orderBy('ratio_per_10k_population', 'asc')
            ->get();

        $underserved = $metrics->where('is_underserved', true);
        $adequate = $metrics->where('is_underserved', false);

        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_districts' => $metrics->count(),
                'underserved_count' => $underserved->count(),
                'adequate_count' => $adequate->count(),
                'average_ratio' => round($metrics->avg('ratio_per_10k_population'), 2),
                'average_accessibility' => round($metrics->avg('accessibility_score'), 2),
            ],
            'rankings' => $metrics,
        ]);
    }
}
