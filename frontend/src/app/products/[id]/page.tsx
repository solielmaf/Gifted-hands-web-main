"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
}

export default function ProductPage() {
  const params = useParams();
  const { id } = params; // comes from /products/[id]
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`http://127.0.0.1:8000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to fetch product");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">No product found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {product.images?.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.name}
          className="rounded-xl shadow-md mb-6 w-full max-h-[400px] object-cover"
        />
      )}

      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-semibold">${product.price}</p>
    </div>
  );
}
