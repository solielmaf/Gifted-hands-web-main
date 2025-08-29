"use client";
import { useEffect, useState } from "react";

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
  
  // Admin modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  // Fetch logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Fetch services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch services", err);
        setLoading(false);
      });
  };

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;
    return (
      user.role === "admin" || 
      user.is_admin === true
    );
  };

  // Open modal for add/edit
  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setForm({
        name: service.name,
        description: service.description,
        price: service.price,
      });
    } else {
      setEditingService(null);
      setForm({
        name: "",
        description: "",
        price: "",
      });
    }
    setModalOpen(true);
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!form.name || !form.description || !form.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      let response;
      if (editingService) {
        // Update existing service
        response = await fetch(`http://127.0.0.1:8000/api/services/${editingService.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        // Create new service
        response = await fetch("http://127.0.0.1:8000/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(form),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save service");
      }

      setModalOpen(false);
      fetchServices(); // Refresh the services list
      alert(`Service ${editingService ? 'updated' : 'created'} successfully`);
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Error saving service: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Handle delete service
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/services/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete service");
      }

      // Remove the service from the local state for immediate UI update
      setServices(prevServices => prevServices.filter(service => service.id !== id));
      alert("Service deleted successfully");
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Error deleting service: " + (err instanceof Error ? err.message : "Unknown error"));
      
      // Refresh the services list as fallback
      fetchServices();
    }
  };

  if (loading) return <p className="text-center">Loading services...</p>;

  return (
    <section className="px-4 py-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Services</h1>
        {isAdmin() && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => openModal()}
          >
            Add Service
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition relative"
          >
            {isAdmin() && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="bg-yellow-400 text-white p-1 rounded text-xs"
                  onClick={() => openModal(service)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded text-xs"
                  onClick={() => handleDelete(service.id)}
                >
                  Delete
                </button>
              </div>
            )}
            <h2 className="text-xl text-black font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-blue-600 font-bold">{service.price} ETB</p>
          </div>
        ))}
      </div>

      {/* Admin Modal for Add/Edit */}
      {modalOpen && isAdmin() && (
        <div className="fixed text-black inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Service Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-3 p-2 border text-black rounded"
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
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded text-white"
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