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

        $products = $query->get();

        // Transform the products to include proper image URLs
        return $products->map(function ($product) {
            $images = [];

            // Handle the images field whether it's array, string, or JSON string
            if (is_array($product->images)) {
                $images = $product->images;
            } elseif (is_string($product->images)) {
                // Try to decode JSON, if it fails, treat as single image string
                $decoded = json_decode($product->images, true);
                $images = is_array($decoded) ? $decoded : [$product->images];
            }

            // Clean and format image URLs
            $cleanedImages = array_map(function ($image) {
                // Remove any unwanted characters
                $cleanImage = trim($image, '"[]\\/');
                // Ensure it's a proper path
                if (strpos($cleanImage, 'products/') === 0) {
                    return asset('storage/' . $cleanImage);
                }
                return $cleanImage;
            }, $images);

            // Remove empty values
            $cleanedImages = array_filter($cleanedImages);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'description' => $product->description,
                'category_id' => $product->category_id,
                'images' => !empty($cleanedImages) ? $cleanedImages : [asset('storage/placeholder.png')],
                'category' => $product->category
            ];
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
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
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

        return response()->json(['success' => true, 'product' => $product]);
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
