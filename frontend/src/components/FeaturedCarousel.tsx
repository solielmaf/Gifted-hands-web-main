"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  images?: string[];
}

export default function NewArrivalsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "/placeholder.png";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/products/") || imagePath.startsWith("products/")) {
      const cleanPath = imagePath.replace(/^\//, "");
      return `http://127.0.0.1:8000/storage/${cleanPath}`;
    }
    return imagePath;
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/new");
        if (!res.ok) throw new Error("Failed to fetch new arrivals");

        const raw = await res.json();
        console.log("API response:", raw);

        // Unwrap response correctly
        const data: Product[] = Array.isArray(raw)
          ? raw
          : raw.products ?? raw.data ?? [];

        const parsedProducts = data.map((p) => ({
          ...p,
          images: Array.isArray(p.images)
            ? p.images.map((img) => getImageUrl(img))
            : [getImageUrl(p.images || "/placeholder.png")],
        }));

        setProducts(parsedProducts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="px-20 py-12 text-black">
      <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
      <h2 className="text-xl font-bold mb-6 text-center">New Arrivals</h2>
      <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
        {products.map((prod) => (
          <Link key={prod.id} href={`/products/${prod.id}`}>
            <div className="min-w-[300px] bg-white shadow-md rounded-lg pb-5 pt-0 flex flex-col items-center cursor-pointer transform hover:scale-105 transition-transform duration-200">
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={prod.images?.[0] || "/placeholder.png"}
                  alt={prod.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 250px"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
              </div>
              <h2 className="font-semibold text-center text-black">{prod.name}</h2>
              <p className="text-[#008080] mt-1 text-center">{prod.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
