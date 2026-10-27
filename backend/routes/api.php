<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AiAssistantController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BudgetProjectController;
use App\Http\Controllers\Api\CitizenFeedbackController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquityController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\MLAnalyticsController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Middleware\EnsureAdminRole;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| TeraPublic API Routes
|--------------------------------------------------------------------------
|
| Public transparency API for Facilities, APBD Budgets, Machine Learning Equity,
| AI Assistant RAG, and Citizen Feedback in DKI Jakarta.
|
*/

// Health / Status
Route::get('/ping', fn () => response()->json(['status' => 'ok', 'app' => 'TeraPublic API', 'version' => '1.0.0']));

// --------------------------------------------------------------------------
// 1. Public Endpoints (Accessible by visitors without authentication)
// --------------------------------------------------------------------------

// Public Facilities Mapping
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{id}', [FacilityController::class, 'show']);

// Regions & GIS Boundaries (GeoJSON)
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/geojson', [RegionController::class, 'geojson']);

// APBD Development Monitoring
Route::get('/budget-projects', [BudgetProjectController::class, 'index']);

// Accessibility & Equity Analytics
Route::get('/equity', [EquityController::class, 'index']);

// Machine Learning Disparity & Priority Clustering
Route::get('/analytics/ml-clustering', [MLAnalyticsController::class, 'clustering']);

// Dashboard & Machine Learning APBD Predictions (Public)
Route::get('/dashboard', [DashboardController::class, 'fullDashboard']);
Route::get('/dashboard/overview', [DashboardController::class, 'overview']);
Route::get('/dashboard/budget-predictions', [DashboardController::class, 'budgetPredictions']);

// Public Feedback Tracking by Code
Route::get('/feedback/track/{code}', [CitizenFeedbackController::class, 'track']);

// Authentication (Public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// --------------------------------------------------------------------------
// 2. Authenticated Endpoints (Requires: Authorization: Bearer <token>)
// --------------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    // Current user profile & logout
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Citizen Reporting & Accountability (Must be registered & logged in)
    Route::post('/feedback', [CitizenFeedbackController::class, 'store']);
    Route::get('/citizen/feedbacks', [CitizenFeedbackController::class, 'myFeedbacks']);

    // AI Public Information Assistant (RAG Gemini)
    Route::post('/assistant/chat', [AiAssistantController::class, 'chat']);

    // ----------------------------------------------------------------------
    // 3. Admin Only Master Data CRUD (Protected by EnsureAdminRole)
    // ----------------------------------------------------------------------
    Route::middleware(EnsureAdminRole::class)->prefix('admin')->group(function () {
        // Facilities CRUD
        Route::get('/facilities', [AdminController::class, 'indexFacilities']);
        Route::post('/facilities', [AdminController::class, 'storeFacility']);
        Route::put('/facilities/{id}', [AdminController::class, 'updateFacility']);
        Route::delete('/facilities/{id}', [AdminController::class, 'destroyFacility']);

        // Budget Projects CRUD
        Route::get('/budget-projects', [AdminController::class, 'indexBudgetProjects']);
        Route::post('/budget-projects', [AdminController::class, 'storeBudgetProject']);
        Route::put('/budget-projects/{id}', [AdminController::class, 'updateBudgetProject']);
        Route::delete('/budget-projects/{id}', [AdminController::class, 'destroyBudgetProject']);

        // Citizen Feedbacks Verification
        Route::get('/feedbacks', [AdminController::class, 'indexFeedbacks']);
        Route::patch('/feedbacks/{id}/respond', [AdminController::class, 'respondFeedback']);

        // Regions Demographics
        Route::put('/regions/{id}', [AdminController::class, 'updateRegion']);
    });
});
