"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import InquiryForm from "@/components/InquiryForm"; // adjust path if needed

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
}

export default function ProductPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
        console.log("API response:", response.data); // 👈 debug log
        // Adjust based on backend response structure
        setProduct(response.data.product ?? response.data);
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
    <div className="max-w-3xl mt-10 mx-auto p-6">
      <h1 className="text-3xl text-black font-bold mb-4">{product.name}</h1>

      {product.images?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name}
              className="rounded-xl shadow-md w-full max-h-[250px] object-cover"
            />
          ))}
        </div>
      )}

      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl text-black font-semibold mb-6">{product.price} ETB</p>

      {/* Inquiry Form */}
      <InquiryForm productId={product.id} title={product.name} />
    </div>
  );
}
