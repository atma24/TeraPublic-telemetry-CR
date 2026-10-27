<?php

use App\Http\Controllers\Api\BudgetProjectController;
use App\Http\Controllers\Api\CitizenFeedbackController;
use App\Http\Controllers\Api\EquityController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\RegionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| TeraPublic API Routes
|--------------------------------------------------------------------------
|
| Public transparency API for Facilities, APBD Budgets, Equity Analytics,
| and Citizen Feedback in DKI Jakarta.
|
*/

// Health / Status
Route::get('/ping', fn () => response()->json(['status' => 'ok', 'app' => 'TeraPublic API', 'version' => '1.0.0']));

// 1. Public Facilities Mapping
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{id}', [FacilityController::class, 'show']);

// 2. Regions & GIS Boundary
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/geojson', [RegionController::class, 'geojson']);

// 3. APBN / APBD Development Monitoring
Route::get('/budget-projects', [BudgetProjectController::class, 'index']);

// 4. Accessibility & Equity Analysis
Route::get('/equity', [EquityController::class, 'index']);

// 5. Civic Reporting & Accountability
Route::post('/feedback', [CitizenFeedbackController::class, 'store']);
Route::get('/feedback/track/{code}', [CitizenFeedbackController::class, 'track']);
