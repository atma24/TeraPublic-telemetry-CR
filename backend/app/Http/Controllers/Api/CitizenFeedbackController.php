<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CitizenFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CitizenFeedbackController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'facility_id' => 'nullable|exists:public_facilities,id',
            'citizen_name' => 'required|string|max:100',
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
        $validated['tracking_code'] = "TP-{$year}-{$random}";
        $validated['status'] = 'submitted';

        $feedback = CitizenFeedback::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan warga berhasil dikirim dan diverifikasi.',
            'data' => $feedback,
        ], 201);
    }

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
