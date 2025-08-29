<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CategoryController;
// use App\Http\Controllers\ServiceController;
// use App\Http\Controllers\TestimonialController;
// use App\Http\Controllers\InquiryController;


// // Categories API
Route::apiResource('categories', CategoryController::class);
Route::get('/categories', [CategoryController::class, 'index']);

// // Products API

Route::get('/products/new', [ProductController::class, 'newArrivals']);
Route::apiResource('products', ProductController::class);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
// // Services API
Route::get('/services', [ServiceController::class, 'index']);

Route::apiResource('services', ServiceController::class);
Route::apiResource('categories', CategoryController::class);

Route::post('/admin/login', [AuthController::class, 'adminLogin']);




// Route::apiResource('testimonials', TestimonialController::class);
Route::post('/inquiries', [InquiryController::class, 'store']);
Route::get('products/search/{query}', [ProductController::class, 'search']);
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!'
    ]);
});
Route::get('/hello', function () {
    return response()->json(['msg' => 'Hello world']);
});

