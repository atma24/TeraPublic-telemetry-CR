<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PublicFacility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PublicFacility::with(['category', 'region']);

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->query('category'));
            });
        }

        if ($request->filled('region_id')) {
            $query->where('region_id', $request->query('region_id'));
        }

        if ($request->filled('sub_category')) {
            $query->where('sub_category', $request->query('sub_category'));
        }

        if ($request->boolean('has_wheelchair_ramp')) {
            $query->where('has_wheelchair_ramp', true);
        }

        if ($request->boolean('has_tactile_paving')) {
            $query->where('has_tactile_paving', true);
        }

        if ($request->boolean('has_disabled_toilet')) {
            $query->where('has_disabled_toilet', true);
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $perPage = min(100, max(10, (int) $request->query('per_page', 50)));
        $facilities = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $facilities->items(),
            'meta' => [
                'current_page' => $facilities->currentPage(),
                'last_page' => $facilities->lastPage(),
                'per_page' => $facilities->perPage(),
                'total' => $facilities->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $facility = PublicFacility::with(['category', 'region', 'budgetProjects', 'feedbacks'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $facility,
        ]);
    }
}
