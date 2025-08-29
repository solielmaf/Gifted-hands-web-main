"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import InquiryForm from "@/components/InquiryForm";
import api from "@/app/utils/api";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  pdf?: string;
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to safely parse images
  const safeJSONParse = (str: string | string[]): string[] => {
    if (Array.isArray(str)) return str;
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [str];
    } catch {
      return [str];
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get(`/products/${id}`)
      .then((res) => {
        const data = res.data;
        
        // Parse images safely
        const parsedImages = safeJSONParse(data.images);
        
        // Handle image paths - use relative paths as in listing page
        const images = parsedImages.map((img) => {
          // If it's already a full URL, use it as-is
          if (img.startsWith('http')) return img;
          
          // If it starts with a slash, use it as relative path
          if (img.startsWith('/')) return img;
          
          // Otherwise, prepend a slash
          return `/${img}`;
        });

        setProduct({ 
          ...data, 
          images,
          specifications: typeof data.specifications === 'string' 
            ? JSON.parse(data.specifications) 
            : data.specifications || {}
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch product");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="px-4 py-12 max-w-5xl mx-auto">Loading product...</p>;
  if (error) return <p className="px-4 py-12 max-w-5xl mx-auto text-red-600">{error}</p>;
  if (!product) return <p className="px-4 py-12 max-w-5xl mx-auto">No product found.</p>;

  return (
    <div className="px-4 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
      <p className="text-blue-600 font-bold mb-6">{product.price}</p>

      {/* Image gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {product.images.map((img, idx) => (
          <div key={idx} className="relative w-full h-100 ">
            <Image
              src={img}
              alt={`${product.name} ${idx + 1}`}
              fill
              className="object-cover rounded-lg"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="mb-6 text-gray-700 text-white">{product.description}</p>

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <table className="table-auto border border-gray-300 mb-6 w-full">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-200 even:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{key}</td>
                  <td className="px-4 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* PDF Download */}
      {product.pdf && (
        <Link
          href={product.pdf.startsWith('http') ? product.pdf : `http://127.0.0.1:8000${product.pdf}`}
          target="_blank"
          className="inline-block text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-6"
        >
          Download PDF
        </Link>
      )}

<InquiryForm productId={product.id} title={product.name} />

    </div>
  );
}