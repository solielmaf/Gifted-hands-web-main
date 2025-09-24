<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TestimonialController;


// User registration and login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'userLogin']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
// // Categories API
Route::get('/categories', [CategoryController::class, 'index']); // Public read access
Route::post('/categories', [CategoryController::class, 'store']); // Temporary: public access
Route::put('/categories/{category}', [CategoryController::class, 'update']); // Temporary: public access
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']); // Temporary: public access

// // Products API
Route::get('/products/new', [ProductController::class, 'newArrivals']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);
Route::get('products/search/{query}', [ProductController::class, 'search']);
// contact API
Route::post('/contact', [ContactController::class, 'store']);
// // Services API
Route::get('/services', [ServiceController::class, 'index']);
Route::apiResource('services', ServiceController::class);
// Inquires API 

Route::post('/inquiries', [InquiryController::class, 'store']);
// chat API
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/{user_id}', [ChatController::class, 'getMessages']);
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::delete('/chat/{id}', [ChatController::class, 'deleteMessage']);
    Route::put('/chat/{id}', [ChatController::class, 'updateMessage']);
});


// Testimonials
Route::apiResource('testimonials', TestimonialController::class);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);