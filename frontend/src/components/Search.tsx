"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect, useRef } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  images?: string[];
}
interface Category {
  id: number;
  name: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searched, setSearched] = useState(false); // Track if search was performed

  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Hide results on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setResults([]);
        setSearched(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/products?search=${query}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setResults(data);
      setSearched(true); // mark that search was performed
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:ring-offset-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}

      {/* Show results only after search */}
      {searched && results.length === 0 && !loading && (
        <p className="mt-4 text-gray-500">No products found.</p>
      )}

      {searched && results.length > 0 && (
        <ul
          ref={resultsRef}
          className="mt-4 border-t border-gray-200 absolute z-50 bg-white w-full rounded shadow-md"
        >
          {results.map((product) => (
            <li key={product.id} className="py-2 border-b border-gray-100">
              <Link
                href={`/products/${product.id}`}
                className="block hover:bg-gray-100 hover:text-black p-2 rounded items-center gap-2"
              >
                <div>
                  <h3 className="font-semibold text-black">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
