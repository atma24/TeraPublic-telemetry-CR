<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CitizenFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CitizenFeedbackController extends Controller
{
    /**
     * Submit citizen feedback (Requires authenticated citizen).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'facility_id' => 'nullable|exists:public_facilities,id',
            'citizen_name' => 'nullable|string|max:100',
            'citizen_email' => 'nullable|email|max:150',
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'category' => 'required|string|in:damage,disability_access,project_delay,cleanliness',
            'photo_url' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $year = date('Y');
        $random = strtoupper(Str::random(5));
        $validated['user_id'] = $user?->id;
        $validated['citizen_name'] = ! empty($validated['citizen_name']) ? $validated['citizen_name'] : ($user?->name ?? 'Warga Jakarta');
        $validated['citizen_email'] = ! empty($validated['citizen_email']) ? $validated['citizen_email'] : $user?->email;
        $validated['tracking_code'] = "TP-{$year}-{$random}";
        $validated['status'] = 'submitted';

        $feedback = CitizenFeedback::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan warga berhasil dikirim dan terdaftar dengan nomor tiket.',
            'data' => $feedback->load('facility.region'),
        ], 201);
    }

    /**
     * List feedbacks submitted by the authenticated citizen.
     */
    public function myFeedbacks(Request $request): JsonResponse
    {
        $feedbacks = CitizenFeedback::with('facility.region')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'total' => $feedbacks->count(),
            'data' => $feedbacks,
        ]);
    }

    /**
     * Track feedback by public tracking code.
     */
    public function track(string $trackingCode): JsonResponse
    {
        $feedback = CitizenFeedback::with('facility.region')
            ->where('tracking_code', $trackingCode)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $feedback,
        ]);
    }
}
