<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your WebApp App. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your App's API!
|
*/

use Illuminate\Support\Facades\Route;
use WebApps\Apps\TimetableWeek\Controllers\MasterController;

// These routes are accessible without authentication
Route::get('/value.{format}', [MasterController::class, 'value']);

// These routes require authentication to access
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/next', [MasterController::class, 'next']);
    Route::post('/settings', [MasterController::class, 'saveConfig']);
});
