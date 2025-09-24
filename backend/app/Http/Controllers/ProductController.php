<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
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

        return response()->json($products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'description' => $product->description,
                'category_id' => $product->category_id,
                'images' => $this->getImageUrls($product->images),
                'category' => $product->category,
            ];
        }));
    }

    /**
     * Get new arrivals.
     */
    public function newArrivals()
    {
        $products = Product::with('category')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        // Return a proper JSON array
        return response()->json($products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'images' => $this->getImageUrls($product->images),
            ];
        })->values()->all()); // 👈 ensures array instead of collection
    }

    /**
     * Helper to get image URLs.
     */
    private function getImageUrls($imagesField)
    {
        $images = [];

        if (is_array($imagesField)) {
            $images = $imagesField;
        } elseif (is_string($imagesField)) {
            $decoded = json_decode($imagesField, true);
            $images = is_array($decoded) ? $decoded : [$imagesField];
        }

        $cleanedImages = array_map(function ($img) {
            $cleanImage = trim($img, '"[]\\/');

            if (strpos($cleanImage, 'products/') === 0) {
                return asset('storage/' . $cleanImage);
            }

            return $cleanImage;
        }, $images);

        $cleanedImages = array_filter($cleanedImages);

        return !empty($cleanedImages) ? $cleanedImages : [asset('storage/placeholder.png')];
    }

    /**
     * Store a new product.
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
                $images[] = $file->store('products', 'public');
            }
        }

        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'images' => json_encode($images),
        ]);

        return response()->json($product);
    }

    /**
     * Show a product by ID.
     */
    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'description' => $product->description,
            'category_id' => $product->category_id,
            'images' => $this->getImageUrls($product->images),
            'category' => $product->category,
        ]);
    }

    /**
     * Update a product.
     */
    public function update(Request $request, Product $product)
    {
        $product->update([
            'name' => $request->input('name', $product->name),
            'price' => $request->input('price', $product->price),
            'description' => $request->input('description', $product->description),
            'category_id' => $request->input('category_id', $product->category_id),
        ]);

        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $file) {
                $images[] = $file->store('products', 'public');
            }
            $product->images = json_encode($images);
            $product->save();
        }

        return response()->json([
            'success' => true,
            'product' => $product,
        ]);
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
