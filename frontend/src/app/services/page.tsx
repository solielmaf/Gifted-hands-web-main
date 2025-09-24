"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
}

interface User {
  role?: string;
  is_admin?: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  // Fetch logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  // Fetch services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error("Failed to fetch services:", err);
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => user?.role === "admin" || user?.is_admin;

  const openModal = (service?: Service) => {
    setEditingService(service || null);
    setForm(
      service
        ? { name: service.name, description: service.description, price: service.price }
        : { name: "", description: "", price: "" }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setForm({ name: "", description: "", price: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const url = editingService
      ? `http://127.0.0.1:8000/api/services/${editingService.id}`
      : "http://127.0.0.1:8000/api/services";
    const method = editingService ? "PUT" : "POST";

    toast.promise(
      (async () => {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          let errorMessage = "Failed to save service";
          try {
            const data = await res.json();
            errorMessage = data.message || errorMessage;
          } catch {}
          throw new Error(errorMessage);
        }

        return res.json();
      })(),
      {
        loading: editingService ? "Updating service..." : "Creating service...",
        success: () => {
          fetchServices();
          closeModal();
          return `Service ${editingService ? "updated" : "created"} successfully`;
        },
        error: (err: unknown) =>
          err instanceof Error
            ? `Error saving service: ${err.message}`
            : "Unknown error saving service",
      }
    );
  };

  // Delete confirmation like product page
  const confirmDelete = (id: number) => {
    toast.custom((t) => (
      <div className="flex flex-col bg-white shadow-lg p-4 rounded gap-3 w-80">
        <p>Delete this service?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`http://127.0.0.1:8000/api/services/${id}`, {
                  method: "DELETE",
                  headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error("Failed to delete service");
                setServices((prev) => prev.filter((s) => s.id !== id));
                toast.success("Service deleted successfully");
              } catch (err: unknown) {
                if (err instanceof Error) {
                  console.error(err);
                  toast.error(`Error deleting service: ${err.message}`);
                } else {
                  console.error(err);
                  toast.error("Unknown error deleting service");
                }
              }
            }}
          >
            Yes
          </button>
        </div>
      </div>
    ));
  };

  if (loading) return <p className="text-center">Loading services...</p>;

  return (
    <section className="px-4 py-20 text-black max-w-6xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Services</h1>
        {isAdmin() && (
          <button
            className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-[#008898]"
            onClick={() => openModal()}
          >
            Add Service
          </button>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition relative"
          >
            {isAdmin() && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="bg-[#008080] text-white p-1 rounded text-xs"
                  onClick={() => openModal(service)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded text-xs"
                  onClick={() => confirmDelete(service.id)}
                >
                  Delete
                </button>
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-[#008080] font-bold">{service.price} ETB</p>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && isAdmin() && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Service Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              rows={4}
              required
            />

            <input
              type="text"
              name="price"
              placeholder="Price (ETB)"
              value={form.price}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-[#008080] px-4 py-2 rounded text-white"
                onClick={handleSubmit}
              >
                {editingService ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
