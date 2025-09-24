"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

import { Product, Category, User } from "@/components/products/types";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilter from "@/components/products/CategoryFilter";
import ProductModal from "@/components/products/ProductModal";
import CategoryModal from "@/components/products/CategoryModal";

const API_BASE = "http://127.0.0.1:8000";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Debug function to check API connectivity
  const checkApiConnection = async () => {
    try {
      console.log("Testing API connection to:", API_BASE);
      const testRes = await fetch(`${API_BASE}/api/test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log("API connection test result:", testRes.status, testRes.statusText);
    } catch (error) {
      console.error("API connection failed:", error);
    }
  };

  // ---------- helpers ----------
  const confirmToast = (message: string, onConfirm: () => void) => {
    toast.custom((t) => (
      <div className="flex flex-col gap-3 bg-white shadow-lg p-4 rounded">
        <p>{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-300 text-black px-3 py-1 rounded">
            No
          </button>
        </div>
      </div>
    ));
  };

  const safeJSONParse = (input?: unknown): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input.filter(Boolean).map(String);
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
        if (typeof parsed === "string") return [parsed];
        if (typeof parsed === "object" && parsed !== null) {
          if ("path" in parsed) return [String((parsed as Record<string, unknown>).path)];
          return [String(parsed)];
        }
        return [input];
      } catch {
        return [input];
      }
    }
    if (typeof input === "object") {
      const obj = input as Record<string, unknown>;
      if ("path" in obj) return [String(obj.path)];
      return [String(input)];
    }
    return [];
  };

  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "/placeholder.png";
    if (/^https?:\/\//.test(imagePath)) return imagePath;
    return `${API_BASE}/storage/${imagePath.replace(/^\/+/, "")}`;
  };

  const getFirstImageUrl = (imgData?: string | string[] | undefined) => {
    if (!imgData) return getImageUrl(undefined);
    if (Array.isArray(imgData)) return getImageUrl(imgData[0]);
    return getImageUrl(String(imgData));
  };

  // ---------- API fetchers ----------
  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      console.log("Fetching products from:", `${API_BASE}/api/products`);
      
      const res = await fetch(`${API_BASE}/api/products`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      console.log("Products API response:", res.status, res.statusText);

      if (res.status === 401) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Products API error:", errorText);
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }
      
      const data: Product[] = await res.json();
      console.log("Products data received:", data.length, "items");

      const normalized = data.map((p) => ({
        ...p,
        images: safeJSONParse(p.images),
      }));
      
      setProducts(normalized);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("❌ Failed to fetch products. Check console for details.");
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Fetching categories from:", `${API_BASE}/api/categories`);
      
      const res = await fetch(`${API_BASE}/api/categories`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });
      
      console.log("Categories API response:", res.status, res.statusText);

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Categories API error:", errorText);
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }
      
      const data: Category[] = await res.json();
      console.log("Categories data received:", data.length, "items");
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("❌ Failed to fetch categories. Check console for details.");
    }
  }, [router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("adminUser");
      }
    }
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // filter
  useEffect(() => {
    setFiltered(selectedCategory === "" ? products : products.filter((p) => p.category_id === selectedCategory));
  }, [selectedCategory, products]);

  // ---------- modal openers ----------
  const openProductModal = (product?: Product) => {
    setEditingProduct(product ?? null);
    setProductModalOpen(true);
  };
  
  const openCategoryModal = (cat?: Category) => {
    setEditingCategory(cat ?? null);
    setCategoryModalOpen(true);
  };

  // ---------- create / update product ----------
  const handleProductSubmit = async (form: Partial<Product>, files: File[]): Promise<void> => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("⚠️ Please fill all required fields");
      return;
    }
    
    if (!user || user.role !== "admin") {
      toast.error("⚠️ Admin access required");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Authentication token missing");
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", String(form.name));
      formData.append("price", String(form.price));
      formData.append("description", String(form.description ?? ""));
      formData.append("category_id", String(form.category_id));

      // Append new files
      files.forEach((f) => formData.append("images[]", f));

      // If editing and no new files were uploaded, send existing_images
      if (editingProduct && files.length === 0) {
        const existingImages = safeJSONParse(editingProduct.images);
        existingImages.forEach((img) => formData.append("existing_images[]", String(img)));
      }

      // Determine URL and method
      const isEditing = Boolean(editingProduct);
      let url = `${API_BASE}/api/products`;
      let method = "POST";
      
      if (isEditing) {
        url = `${API_BASE}/api/products/${editingProduct!.id}`;
        method = "PUT";
        // For Laravel, we need to use POST with _method override when sending FormData
        formData.append("_method", "PUT");
      }

      console.log("Sending product data to:", url, "Method:", method);
      
      const res = await fetch(url, {
        method: isEditing ? "POST" : "POST", // Use POST for both cases with _method override for edits
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Product submit response:", res.status, res.statusText);

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Save product error:", res.status, errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(`❌ Error: ${errorJson.message || errorText}`);
        } catch {
          toast.error(`❌ Error: ${errorText || "Failed to save product"}`);
        }
        return;
      }

      const json = await res.json();
      const returned = (json.product ?? json) as Product;

      // Normalize images
      returned.images = safeJSONParse(returned.images);

      if (isEditing) {
        setProducts((prev) => prev.map((p) => (p.id === returned.id ? returned : p)));
      } else {
        setProducts((prev) => [returned, ...prev]);
      }

      setProductModalOpen(false);
      setEditingProduct(null);
      toast.success(`✅ Product ${isEditing ? "updated" : "created"} successfully`);
    } catch (err) {
      console.error("Network error details:", err);
      toast.error("❌ Network error. Please check your connection and console for details.");
    }
  };

  // ---------- delete ----------
  const handleDeleteProduct = async (id: number): Promise<void> => {
    confirmToast("Delete this product?", async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast.error("Authentication token missing");
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log("Delete product response:", res.status, res.statusText);
        
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `HTTP error! status: ${res.status}`);
        }
        
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setFiltered((prev) => prev.filter((p) => p.id !== id));
        toast.success("🗑️ Product deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("❌ Error deleting product");
      }
    });
  };

  // ---------- categories ----------
  const handleCategorySubmit = async (form: Partial<Category>): Promise<void> => {
    if (!form.name) {
      toast.error("⚠️ Enter category name");
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Authentication token missing");
        router.push("/login");
        return;
      }

      const url = editingCategory 
        ? `${API_BASE}/api/categories/${editingCategory.id}` 
        : `${API_BASE}/api/categories`;
      
      const method = editingCategory ? "PUT" : "POST";
      
      console.log("Sending category data to:", url, "Method:", method);
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      
      console.log("Category submit response:", res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }
      
      setCategoryModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
      toast.success(`✅ Category ${editingCategory ? "updated" : "created"} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving category");
    }
  };

  const handleDeleteCategory = async (id: number): Promise<void> => {
    confirmToast("Delete this category?", async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast.error("Authentication token missing");
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_BASE}/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log("Delete category response:", res.status, res.statusText);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `HTTP error! status: ${res.status}`);
        }
        
        setCategories((prev) => prev.filter((c) => c.id !== id));
        if (selectedCategory === id) setSelectedCategory("");
        toast.success("🗑️ Category deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("❌ Error deleting category");
      }
    });
  };

  // ---------- render ----------
  if (loading) {
    return (
      <div className="px-4 py-20 text-black max-w-6xl mx-auto flex justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-20 text-black max-w-6xl mx-auto">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <button className="text-black border border-[#008080] px-4 py-2 rounded" onClick={() => openCategoryModal()}>
              Add Category
            </button>
            <button className="bg-[#008080] text-white px-4 py-2 rounded" onClick={() => openProductModal()}>
              Add Product
            </button>
          </div>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        user={user}
        onEditCategory={openCategoryModal}
        onDeleteCategory={handleDeleteCategory}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            user={user}
            onEdit={openProductModal}
            onDelete={handleDeleteProduct}
            getImageUrl={(imgOrArr) => (Array.isArray(imgOrArr) ? getFirstImageUrl(imgOrArr) : getFirstImageUrl(imgOrArr))}
            onClick={() => router.push(`/products/${prod.id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && <p className="mt-4 text-gray-500">No products found</p>}

      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        editingProduct={editingProduct}
        categories={categories}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
      />
    </div>
  );
}