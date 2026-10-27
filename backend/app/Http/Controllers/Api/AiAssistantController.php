<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AiAssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiAssistantController extends Controller
{
    public function __construct(
        protected AiAssistantService $aiService
    ) {}

    /**
     * Ask public assistant (Requires authenticated citizen or admin).
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $response = $this->aiService->ask($validated['message'], $user?->name);

        return response()->json($response);
    }
}
