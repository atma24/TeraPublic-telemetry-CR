<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $regions = Region::with(['equityMetrics'])
            ->withCount('facilities')
            ->orderBy('city')
            ->orderBy('name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $regions,
        ]);
    }

    public function geojson(): JsonResponse
    {
        $regions = Region::with(['equityMetrics'])
            ->withCount('facilities')
            ->get();

        $features = $regions->map(function ($r) {
            $metric = $r->equityMetrics->first();

            return [
                'type' => 'Feature',
                'properties' => [
                    'id' => $r->id,
                    'code' => $r->code,
                    'name' => $r->name,
                    'city' => $r->city,
                    'population' => $r->population,
                    'area_km2' => (float) $r->area_km2,
                    'facility_count' => $r->facilities_count,
                    'ratio_per_10k' => $metric ? (float) $metric->ratio_per_10k_population : 0,
                    'accessibility_score' => $metric ? (float) $metric->accessibility_score : 0,
                    'equity_index' => $metric ? (float) $metric->equity_index : 0,
                    'is_underserved' => $metric ? (bool) $metric->is_underserved : false,
                ],
                'geometry' => $r->geometry,
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }
}
