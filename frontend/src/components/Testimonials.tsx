"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TestimonialCard from "./admin/TestimonalCard";
import TestimonialModal, { Testimonial, TestimonialForm } from "./admin/TestimonalModal";

interface User {
  role?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/testimonials");
      const data: Testimonial[] = await res.json();
      setTestimonials(data);
    } catch {
      toast.error("Failed to fetch testimonials");
    }
  };

  const handleDelete = async (id: number) => {
    toast(
      t => (
        <span>
          Delete this testimonial?
          <button
            className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
            onClick={async () => {
              await fetch(`http://127.0.0.1:8000/api/testimonials/${id}`, { method: "DELETE" });
              setTestimonials(prev => prev.filter(t => t.id !== id));
              toast.dismiss(t.id);
            }}
          >
            Yes
          </button>
          <button className="bg-gray-400 text-white px-2 py-1 ml-2 rounded" onClick={() => toast.dismiss(t.id)}>
            No
          </button>
        </span>
      ),
      { duration: 5000 }
    );
  };

  const handleSubmit = async (form: TestimonialForm, files: File[]) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value as string));
    files.forEach(f => formData.append("avatar[]", f));

    let url = "http://127.0.0.1:8000/api/testimonials";
    const method: "POST" | "PUT" = "POST";

    if (editingTestimonial?.id) {
      formData.append("_method", "PUT");
      url = `http://127.0.0.1:8000/api/testimonials/${editingTestimonial.id}`;
    }

    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      toast.success(editingTestimonial ? "Testimonial updated!" : "Testimonial added!");
      setModalOpen(false);
      fetchTestimonials();
    } else {
      toast.error("Error saving testimonial");
    }
  };

  const getImageUrl = (img: string) =>
    !img ? "/placeholder.png" : img.startsWith("http") ? img : `http://127.0.0.1:8000/storage/${img}`;

  return (
    <div className="px-18 py-10 w-full text-black">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl mb-15 font-bold">What Our Clients Say</h1>
        {user?.role === "admin" && (
          <button
            className="bg-[#008080] text-white px-4 py-2 rounded"
            onClick={() => {
              setEditingTestimonial(null);
              setModalOpen(true);
            }}
          >
            Add Testimonial
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4 gap-4">
        {testimonials.map(t => (
          <TestimonialCard
            key={t.id}
            testimonial={t}
            userRole={user?.role}
            onEdit={t => {
              setEditingTestimonial(t);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
            getImageUrl={getImageUrl}
          />
        ))}
      </div>

      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingTestimonial={editingTestimonial ?? undefined}
      />
    </div>
  );
}
