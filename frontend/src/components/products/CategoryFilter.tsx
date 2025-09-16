import { Category, User } from "./types";

interface Props {
  categories: Category[];
  selectedCategory: number | "";
  setSelectedCategory: React.Dispatch<React.SetStateAction<number | "">>;
  user: User | null;
  onEditCategory: (cat?: Category) => void;
  onDeleteCategory: (id: number) => void;
}

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory, user, onEditCategory, onDeleteCategory }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto mb-6 whitespace-nowrap hide-scrollbar text-black">
      <button
        className={`px-4 py-2 rounded ${selectedCategory === "" ? "bg-[#008080] text-white" : "border border-[#008080]"}`}
        onClick={() => setSelectedCategory("")}
      >
        All
      </button>
      {categories.map((cat) => (
        <div key={cat.id} className="relative group">
          <button
            className={`px-4 py-2 rounded ${selectedCategory === cat.id ? "bg-[#008080] text-white" : "border border-[#008080]"}`}
            onClick={() => setSelectedCategory(cat.id)}
            title={cat.name}
          >
            {cat.name.length > 20 ? cat.name.slice(0, 20) + "…" : cat.name}
          </button>

          {user?.role === "admin" && (
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-[#008080] text-white p-1 rounded text-xs" onClick={() => onEditCategory(cat)}>
                Edit
              </button>
              <button className="bg-red-500 text-white p-1 rounded text-xs ml-1" onClick={() => onDeleteCategory(cat.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
