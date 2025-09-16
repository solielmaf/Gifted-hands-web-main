import { Product, User } from "./types";

interface Props {
  product: Product;
  user: User | null;
  onEdit: (product?: Product) => void;
  onDelete: (id: number) => Promise<void>;
  getImageUrl: (imagePath: string) => string;
  onClick?: () => void;
}

export default function ProductCard({ product, user, onEdit, onDelete, getImageUrl, onClick }: Props) {
  return (
    <div
      onClick={onClick ? () => onClick() : undefined}
      className="bg-white p-4 rounded shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition"
    >
      <img
        src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-700">{product.price} ETB</p>
      {user?.role === "admin" && (
        <div className="flex gap-2 mt-2">
          <button
            className="bg-[#008080] text-white px-2 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
