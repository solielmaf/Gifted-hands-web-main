import { useState, useEffect } from "react";
import { Product, Category } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: Partial<Product>, files: File[]) => Promise<void>;
  editingProduct: Product | null;
  categories: Category[];
}

export default function ProductModal({ isOpen, onClose, onSubmit, editingProduct, categories }: Props) {
  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    price: "",
    description: "",
    category_id: 0,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        category_id: editingProduct.category_id,
      });
      const images = Array.isArray(editingProduct.images) ? editingProduct.images : [editingProduct.images];
      setPreviewUrls(images.filter(Boolean) as string[]);
    } else {
      setForm({ name: "", price: "", description: "", category_id: 0 });
      setPreviewUrls([]);
      setFiles([]);
    }
  }, [editingProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === "category_id" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-[#008080] rounded"
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-[#008080] rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-[#008080] rounded"
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-[#008080] rounded"
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
          className="w-full mb-2 p-2 border border-[#008080] rounded"
        />

        <div className="flex gap-2 mb-2 flex-wrap">
          {previewUrls.map((url, idx) => (
            <img key={idx} src={url} alt="preview" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button className="bg-gray-400 px-4 py-2 rounded text-white" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-[#008080] px-4 py-2 rounded text-white" onClick={() => onSubmit(form, files)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
