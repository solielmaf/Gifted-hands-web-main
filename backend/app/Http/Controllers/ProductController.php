<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->get()->map(function ($product) {
            if (!empty($product->images)) {
                $product->image_url = asset('storage/' . $product->images[0]);
            } else {
                $product->image_url = null; // or a placeholder image
            }
            return $product;
        });

    }
    public function newArrivals()
    {
        $products = Product::orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        return $products->map(function ($product) {
            $images = [];

            if (is_string($product->images)) {
                $decoded = json_decode($product->images, true);
                $imageArray = is_array($decoded) ? $decoded : [$product->images];

                foreach ($imageArray as $image) {
                    if ($image) {
                        // Remove any leading slashes to avoid double slashes
                        $cleanImage = ltrim($image, '/');
                        // Return full URL instead of relative path
                        $images[] = asset('storage/' . $cleanImage);
                    }
                }
            }

            // If no images, use placeholder
            if (empty($images)) {
                $images = ["/placeholder.png"];
            }

            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'images' => $images,
            ];
        });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|string',
            'description' => 'nullable|string',
            'category_id' => 'required|integer',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $images[] = $path;
            }
        }

        // Handle case where no images are uploaded
        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'images' => !empty($images) ? json_encode($images) : json_encode([]), // Ensure it's always an array
        ]);

        return response()->json($product);
    }
    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product->load('category');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|string',
            'description' => 'nullable|string',
            'category_id' => 'required|integer',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Only update images if new ones are uploaded
        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $images[] = $path;
            }
            $product->images = json_encode($images);
        }

        $product->update($request->only('name', 'price', 'description', 'category_id'));

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete the product
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
