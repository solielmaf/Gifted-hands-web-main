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
                $images = is_array($decoded) ? $decoded : [$product->images];
            }

            // Use relative paths for Next.js public folder
            $images = array_map(fn($img) => $img ? "/" . ltrim($img, '/') : "/placeholder.png", $images);


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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
