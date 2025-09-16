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
// use App\Http\Controllers\ServiceController;
// use App\Http\Controllers\TestimonialController;
// use App\Http\Controllers\InquiryController;



Route::post('/register', [AuthController::class, 'register']);        // User registration
Route::post('/login', [AuthController::class, 'userLogin']);
// // Categories API
Route::get('/categories', [CategoryController::class, 'index']); // Public read access
Route::post('/categories', [CategoryController::class, 'store']); // Temporary: public access
Route::put('/categories/{category}', [CategoryController::class, 'update']); // Temporary: public access
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']); // Temporary: public access

// // Products API
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/products/new', [ProductController::class, 'newArrivals']);
Route::get('/products', [ProductController::class, 'index']); // Public read access
Route::post('/products', [ProductController::class, 'store']); // Temporary: public access
Route::put('/products/{product}', [ProductController::class, 'update']);
// POST with _method
// Temporary: public access
Route::delete('/products/{product}', [ProductController::class, 'destroy']); // Temporary: public access
Route::post('/contact', [ContactController::class, 'store']);
// // Services API
Route::get('/services', [ServiceController::class, 'index']);

Route::apiResource('services', ServiceController::class);

Route::post('/admin/login', [AuthController::class, 'adminLogin']);




// Route::apiResource('testimonials', TestimonialController::class);
Route::post('/inquiries', [InquiryController::class, 'store']);
Route::get('products/search/{query}', [ProductController::class, 'search']);
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!'
    ]);
});
Route::apiResource('testimonials', TestimonialController::class);

Route::get('/hello', function () {
    return response()->json(['msg' => 'Hello world']);
});

Route::put('/test-update', function (Request $request) {
    // Get product ID from form data
    $productId = $request->input('product_id');

    if (!$productId) {
        return response()->json(['error' => 'Product ID required'], 400);
    }

    $product = \App\Models\Product::find($productId);
    if (!$product) {
        return response()->json(['error' => 'Product not found'], 404);
    }

    // Update the product
    $product->name = $request->input('name', $product->name);
    $product->price = $request->input('price', $product->price);
    $product->description = $request->input('description', $product->description);
    $product->category_id = $request->input('category_id', $product->category_id);

    if ($request->hasFile('images')) {
        $images = [];
        foreach ($request->file('images') as $file) {
            $path = $file->store('products', 'public');
            $images[] = $path;
        }
        $product->images = json_encode($images);
    }

    $product->save();

    return response()->json([
        'success' => true,
        'product' => $product,
        'updated_id' => $product->id
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/{user_id}', [ChatController::class, 'getMessages']);
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::delete('/chat/{id}', [ChatController::class, 'deleteMessage']);
    Route::put('/chat/{id}', [ChatController::class, 'updateMessage']);


});

Route::fallback(function () {
    return response()->json([
        'error' => 'Route not found'
    ], 404);
});
// Public routes (anyone can view testimonials)
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);

// Protected routes (admin only) — make sure to use auth:sanctum or your auth middleware
Route::middleware('auth:sanctum')->group(function () {

});
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);