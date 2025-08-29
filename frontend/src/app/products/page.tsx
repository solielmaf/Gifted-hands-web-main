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
  images: string[] | string;
}

interface Category {
  id: number;
  name: string;
}

interface User {
  role?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [user, setUser] = useState<User | null>(null);

  // Admin modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category_id: 0,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Function to get proper image URL
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "/placeholder.png";
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path from Laravel storage, make it absolute
    if (imagePath.startsWith('products/')) {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    }
    
    // For any other case, return as is (should be absolute)
    return imagePath;
  };

  // Fetch logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products");
      const data = await res.json();
      const parsedProducts = data.map((p: Product) => ({
        ...p,
        images: typeof p.images === "string" ? safeJSONParse(p.images) : p.images,
      }));
      setProducts(parsedProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category_id === selectedCategory));
    }
  }, [selectedCategory, products]);

  const safeJSONParse = (str: string): string[] => {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return parsed.filter(url => typeof url === 'string' && url.trim() !== '');
      }
      return typeof parsed === 'string' && parsed.trim() !== '' ? [parsed] : [];
    } catch {
      return typeof str === 'string' && str.trim() !== '' ? [str] : [];
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Error revoking URL:', error);
        }
      });
    };
  }, [previewUrls]);

  // Open product modal
  const openProductModal = (product?: Product) => {
    // Clean up any existing preview URLs
    previewUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error revoking URL:', error);
      }
    });

    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: product.price,
        description: product.description,
        category_id: product.category_id,
      });
      setFiles([]);
      
      // Ensure we have valid image URLs for preview
      const productImages = Array.isArray(product.images) ? product.images : [product.images];
      const validImages = productImages.filter(img => img && typeof img === 'string' && img.trim() !== '');
      setPreviewUrls(validImages);
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", price: "", description: "", category_id: 0 });
      setFiles([]);
      setPreviewUrls([]);
    }
    setProductModalOpen(true);
  };

  // Open category modal
  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
      });
    }
    setCategoryModalOpen(true);
  };

  // Product form change handler
  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  // Category form change handler
  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  // File input change
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Revoke previous URLs to avoid memory leaks
    previewUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error revoking URL:', error);
      }
    });
    
    // Get valid image files only
    const selectedFiles = Array.from(e.target.files).filter(
      (file): file is File => file instanceof File && file.type.startsWith('image/')
    );
    
    setFiles(selectedFiles);

    // Create new preview URLs safely
    const urls = selectedFiles.map((file) => {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Failed to create object URL for file:', file.name, error);
        return null;
      }
    }).filter((url): url is string => url !== null);

    setPreviewUrls(urls);
  };

  // Handle modal close
  const handleCloseModal = () => {
    // Clean up object URLs when closing modal
    previewUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Error revoking URL:', error);
      }
    });
    
    setProductModalOpen(false);
    setCategoryModalOpen(false);
    setFiles([]);
    setPreviewUrls([]);
  };

  // Submit Add/Edit Product
  const handleProductSubmit = async () => {
    // Validate form
    if (!productForm.name || !productForm.price || !productForm.category_id) {
      alert("Please fill in all required fields");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("description", productForm.description);
    formData.append("category_id", String(productForm.category_id));
  
    // Only append files if they exist (for new products or when updating images)
    files.forEach((file) => formData.append("images[]", file));
  
    try {
      let response;
      if (editingProduct) {
        formData.append("_method", "PUT");
        response = await fetch(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://127.0.0.1:8000/api/products", {
          method: "POST",
          body: formData,
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }
  
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Submit Add/Edit Category
// Update your handleCategorySubmit function with better error handling
const handleCategorySubmit = async () => {
  if (!categoryForm.name) {
    alert("Please enter a category name");
    return;
  }

  try {
    let url = "http://127.0.0.1:8000/api/categories";
    let method = "POST";
    
    if (editingCategory) {
      url = `http://127.0.0.1:8000/api/categories/${editingCategory.id}`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(categoryForm),
    });

    // Check if response is HTML instead of JSON (Laravel error)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      console.error('Server returned HTML instead of JSON:', text);
      throw new Error('Server error: Please check your API routes');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.errors || `Failed to save category. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result); // Debug the response

    setCategoryModalOpen(false);
    fetchCategories(); // Refresh the categories list
    alert(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
  } catch (err) {
    console.error("Error saving category:", err);
    alert("Error saving category: " + (err instanceof Error ? err.message : "Unknown error"));
  }
};

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, { 
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      // Remove the product from the local state for immediate UI update
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      setFiltered(prevFiltered => prevFiltered.filter(product => product.id !== id));
      
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product: " + (err instanceof Error ? err.message : "Unknown error"));
      
      // Refresh the products list as fallback
      fetchProducts();
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      // Remove the category from the local state for immediate UI update
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      
      // If the deleted category was selected, reset to "All"
      if (selectedCategory === id) {
        setSelectedCategory("");
      }
      
      alert("Category deleted successfully");
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error deleting category: " + (err instanceof Error ? err.message : "Unknown error"));
      
      // Refresh the categories list as fallback
      fetchCategories();
    }
  };

  return (
    <div className="px-4 py-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => openCategoryModal()}
            >
              Add Category
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => openProductModal()}
            >
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 overflow-x-auto mb-6 whitespace-nowrap hide-scrollbar text-black">
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="relative group">
            <button
              className={`px-4 py-2 rounded ${selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setSelectedCategory(cat.id)}
              title={cat.name}
            >
              {cat.name.length > 20 ? cat.name.slice(0, 20) + "…" : cat.name}
            </button>
            {user?.role === "admin" && (
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-yellow-400 text-white p-1 rounded text-xs"
                  onClick={() => openCategoryModal(cat)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded text-xs ml-1"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-black">
        {filtered.map((prod) => {
          const images = Array.isArray(prod.images) ? prod.images : [prod.images];
          const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
          const imageSrc = validImages.length > 0 ? getImageUrl(validImages[0]) : "/placeholder.png";
          
          return (
            <li key={prod.id} className="bg-white shadow-md rounded-lg py-2 pt-0 flex flex-col items-center cursor-pointer relative">
              <Link href={`/products/${prod.id}`} className="w-full">
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src={imageSrc} 
                    alt={prod.name} 
                    fill 
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>
                <h2 className="font-semibold text-center">{prod.name}</h2>
                <p className="text-gray-600 mt-1 text-center">{prod.price}</p>
              </Link>

              {user?.role === "admin" && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded text-white text-sm"
                    onClick={() => openProductModal(prod)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-2 py-1 rounded text-white text-sm"
                    onClick={() => handleDeleteProduct(prod.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && <p className="mt-4 text-gray-500">No products found</p>}

      {/* Product Modal for Add/Edit */}
      {productModalOpen && user?.role === "admin" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center text-black z-50">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={productForm.name}
              onChange={handleProductChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={productForm.price}
              onChange={handleProductChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={productForm.description}
              onChange={handleProductChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              name="category_id"
              value={productForm.category_id}
              onChange={handleProductChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value={0}>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <div className="flex gap-2 mb-2 flex-wrap">
              {previewUrls.map((url, idx) => (
                <img 
                  key={idx} 
                  src={url} 
                  alt="preview" 
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={handleProductSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal for Add/Edit */}
      {categoryModalOpen && user?.role === "admin" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center text-black z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">{editingCategory ? "Edit Category" : "Add Category"}</h2>

            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={categoryForm.name}
              onChange={handleCategoryChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
                onClick={handleCategorySubmit}
              >
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}