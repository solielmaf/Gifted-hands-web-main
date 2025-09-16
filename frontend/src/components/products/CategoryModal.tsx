import { Category } from "./types";
import { useState, useEffect } from "react";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: Partial<Category>) => Promise<void>;
  editingCategory: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSubmit, editingCategory }: Props) {
  const [form, setForm] = useState<Partial<Category>>({ name: "" });

  useEffect(() => {
    if (editingCategory) {
      setForm({ name: editingCategory.name });
    } else {
      setForm({ name: "" });
    }
  }, [editingCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">{editingCategory ? "Edit Category" : "Add Category"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 px-4 py-2 rounded text-white" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-[#008080] px-4 py-2 rounded text-white" onClick={() => onSubmit(form)}>
            {editingCategory ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
