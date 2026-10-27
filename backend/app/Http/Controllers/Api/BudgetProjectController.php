<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BudgetProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BudgetProject::with(['facility', 'region']);

        if ($request->filled('fiscal_year')) {
            $query->where('fiscal_year', $request->query('fiscal_year'));
        }

        if ($request->filled('funding_source')) {
            $query->where('funding_source', $request->query('funding_source'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $projects = $query->latest('fiscal_year')->get();

        $totalAllocated = $projects->sum('budget_allocated');
        $totalRealized = $projects->sum('budget_realized');
        $realizationPercentage = $totalAllocated > 0 ? round(($totalRealized / $totalAllocated) * 100, 2) : 0;

        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_projects' => $projects->count(),
                'total_budget_allocated' => $totalAllocated,
                'total_budget_realized' => $totalRealized,
                'realization_percentage' => $realizationPercentage,
            ],
            'data' => $projects,
        ]);
    }
}
