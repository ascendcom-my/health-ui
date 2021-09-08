<?php

use Bigmom\HealthUi\Controllers\HealthCheckController;
use Illuminate\Support\Facades\Route;

Route::middleware(config('health-ui.middleware'))->group(function () {

  Route::get('/bigmom/health-check', [HealthCheckController::class, 'getPage']);

  Route::post('/bigmom/health-check', [HealthCheckController::class, 'startCheck'])->name('bigmom.health-check.start');

});
