<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BudgetProject;
use App\Models\CitizenFeedback;
use App\Models\PublicFacility;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // =========================================================================
    // 1. Citizen Feedback Management
    // =========================================================================

    /**
     * List all citizen feedbacks with filters (Admin only).
     */
    public function indexFeedbacks(Request $request): JsonResponse
    {
        $query = CitizenFeedback::with(['facility.region', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $feedbacks = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $feedbacks->items(),
            'meta' => [
                'current_page' => $feedbacks->currentPage(),
                'total' => $feedbacks->total(),
                'per_page' => $feedbacks->perPage(),
                'last_page' => $feedbacks->lastPage(),
            ],
        ]);
    }

    /**
     * Respond to and resolve/verify citizen feedback.
     */
    public function respondFeedback(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,in_review,resolved,rejected',
            'admin_response' => 'required|string',
        ]);

        $feedback = CitizenFeedback::findOrFail($id);
        $feedback->status = $validated['status'];
        $feedback->admin_response = $validated['admin_response'];

        if ($validated['status'] === 'resolved') {
            $feedback->resolved_at = now();
        }

        $feedback->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status laporan warga berhasil diperbarui.',
            'data' => $feedback,
        ]);
    }

    // =========================================================================
    // 2. Master Data: Public Facilities
    // =========================================================================

    /**
     * List facilities for admin table.
     */
    public function indexFacilities(Request $request): JsonResponse
    {
        $query = PublicFacility::with(['category', 'region']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%");
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $facilities = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $facilities->items(),
            'meta' => [
                'current_page' => $facilities->currentPage(),
                'total' => $facilities->total(),
            ],
        ]);
    }

    /**
     * Create a new public facility.
     */
    public function storeFacility(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:facility_categories,id',
            'region_id' => 'required|exists:regions,id',
            'name' => 'required|string|max:255',
            'sub_category' => 'nullable|string|max:100',
            'npsn' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'status' => 'required|in:operational,renovation,closed',
            'is_state_owned' => 'boolean',
            'capacity' => 'integer|min:0',
            'has_wheelchair_ramp' => 'boolean',
            'has_tactile_paving' => 'boolean',
            'has_disabled_toilet' => 'boolean',
            'public_transport_nearby' => 'nullable|string',
        ]);

        $facility = PublicFacility::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Fasilitas publik berhasil ditambahkan.',
            'data' => $facility,
        ], 201);
    }

    /**
     * Update an existing public facility.
     */
    public function updateFacility(Request $request, int $id): JsonResponse
    {
        $facility = PublicFacility::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:facility_categories,id',
            'region_id' => 'sometimes|required|exists:regions,id',
            'name' => 'sometimes|required|string|max:255',
            'sub_category' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'latitude' => 'sometimes|required|numeric',
            'longitude' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|in:operational,renovation,closed',
            'capacity' => 'integer|min:0',
            'has_wheelchair_ramp' => 'boolean',
            'has_tactile_paving' => 'boolean',
            'has_disabled_toilet' => 'boolean',
            'public_transport_nearby' => 'nullable|string',
        ]);

        $facility->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data fasilitas publik berhasil diperbarui.',
            'data' => $facility,
        ]);
    }

    /**
     * Remove a facility.
     */
    public function destroyFacility(int $id): JsonResponse
    {
        $facility = PublicFacility::findOrFail($id);
        $facility->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Fasilitas publik berhasil dihapus.',
        ]);
    }

    // =========================================================================
    // 3. Master Data: Budget Projects
    // =========================================================================

    /**
     * List budget projects for admin.
     */
    public function indexBudgetProjects(Request $request): JsonResponse
    {
        $query = BudgetProject::with(['facility', 'region']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $projects = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $projects->items(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'total' => $projects->total(),
            ],
        ]);
    }

    /**
     * Create a new budget project.
     */
    public function storeBudgetProject(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'facility_id' => 'nullable|exists:public_facilities,id',
            'region_id' => 'required|exists:regions,id',
            'project_name' => 'required|string|max:255',
            'fiscal_year' => 'required|integer|min:2020|max:2030',
            'funding_source' => 'required|string|max:50',
            'budget_allocated' => 'required|numeric|min:0',
            'budget_realized' => 'nullable|numeric|min:0',
            'status' => 'required|in:planning,tender,in_progress,completed',
            'contractor_name' => 'nullable|string|max:200',
            'start_date' => 'nullable|date',
            'target_completion_date' => 'nullable|date',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        $project = BudgetProject::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek alokasi anggaran berhasil ditambahkan.',
            'data' => $project,
        ], 201);
    }

    /**
     * Update an existing budget project.
     */
    public function updateBudgetProject(Request $request, int $id): JsonResponse
    {
        $project = BudgetProject::findOrFail($id);

        $validated = $request->validate([
            'facility_id' => 'nullable|exists:public_facilities,id',
            'region_id' => 'sometimes|required|exists:regions,id',
            'project_name' => 'sometimes|required|string|max:255',
            'fiscal_year' => 'sometimes|required|integer|min:2020|max:2030',
            'funding_source' => 'sometimes|required|string|max:50',
            'budget_allocated' => 'sometimes|required|numeric|min:0',
            'budget_realized' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:planning,tender,in_progress,completed',
            'contractor_name' => 'nullable|string|max:200',
            'start_date' => 'nullable|date',
            'target_completion_date' => 'nullable|date',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        $project->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data proyek anggaran berhasil diperbarui.',
            'data' => $project,
        ]);
    }

    /**
     * Remove a budget project.
     */
    public function destroyBudgetProject(int $id): JsonResponse
    {
        $project = BudgetProject::findOrFail($id);
        $project->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Proyek anggaran berhasil dihapus.',
        ]);
    }

    // =========================================================================
    // 4. Master Data: Regions Demographics
    // =========================================================================

    /**
     * Update region demographics (e.g., population updates from BPS).
     */
    public function updateRegion(Request $request, int $id): JsonResponse
    {
        $region = Region::findOrFail($id);

        $validated = $request->validate([
            'population' => 'sometimes|required|integer|min:0',
            'area_km2' => 'nullable|numeric|min:0',
        ]);

        $region->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data demografi wilayah berhasil diperbarui.',
            'data' => $region,
        ]);
    }
}
