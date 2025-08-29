"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category_id: number;
  images: string[] | string; // could be JSON string from API
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  // Fetch products
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const parsedProducts = data.map((p: Product) => ({
          ...p,
          images: typeof p.images === "string" ? safeJSONParse(p.images) : p.images,
        }));
        setProducts(parsedProducts);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category_id === selectedCategory));
    }
  }, [selectedCategory, products]);

  // Safe JSON parse
  const safeJSONParse = (str: string): string[] => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [str];
    } catch {
      return [str];
    }
  };

  return (
    <div className="px-4 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Category Buttons */}
      <div className="flex gap-2 overflow-x-auto mb-6 whitespace-nowrap hide-scrollbar text-black">
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === "" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(cat.id)}
            title={cat.name}
          >
            {cat.name.length > 20 ? cat.name.slice(0, 20) + "…" : cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-black">
        {filtered.map((prod) => {
          const imageSrc =
            Array.isArray(prod.images) && prod.images.length > 0
              ? prod.images[0]
              : "/placeholder.png";

          return (
            <Link key={prod.id} href={`/products/${prod.id}`}>
            <li className="bg-white shadow-md rounded-lg p-2 pt-0 flex flex-col items-center cursor-pointer transform hover:scale-105 transition-transform duration-200">
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
             <Image
                src={Array.isArray(prod.images) ? prod.images[0] : '/placeholder.png'}
                alt={prod.name}
              fill
                className="object-cover"
      />
    </div>
    <h2 className="font-semibold text-center">{prod.name}</h2>
    <p className="text-gray-600 mt-1 text-center">{prod.price}</p>
  </li>
</Link>

          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-4 text-gray-500">No products found</p>
      )}
    </div>
  );
}
