<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return view('dashboard');
    })->name('dashboard');
    
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Task routes
    Route::get('/api/tasks', [\App\Http\Controllers\TaskController::class, 'getTasks']);
    Route::post('/api/tasks/sync', [\App\Http\Controllers\TaskController::class, 'sync']);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return view('login');
    })->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/signup', function () {
        return view('signup');
    })->name('signup');
    Route::post('/signup', [AuthController::class, 'register']);
});
