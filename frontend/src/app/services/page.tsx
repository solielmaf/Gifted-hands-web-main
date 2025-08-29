"use client";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) return <p className="text-center">Loading services...</p>;

  return (
    <section className="px-4 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold  mb-8">Our Services</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
          >
            <h2 className="text-xl text-black font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-blue-600 font-bold">{service.price} ETB</p>
          </div>
        ))}
      </div>
    </section>
  );
}
