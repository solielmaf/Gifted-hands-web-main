"use client";

import { useState } from "react";

interface InquiryFormProps {
  productId?: number;
  title?: string;
}

export default function InquiryForm({ productId, title }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      alert("Product ID missing!");
      return;
    }

    setLoading(true); // start loading

    const inquiryData = { name, email, message, product_id: productId };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      if (res.ok) {
        alert("Inquiry submitted successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert("Failed to submit inquiry.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting inquiry.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-4  rounded-lg shadow-md bg-gray-50"
    >
      <h2 className="text-xl font-semibold mb-4 text-black">
        { "Inquire about " + title  || "Inquire about this product"}
      </h2>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-[#008080] rounded mb-3 text-black"
        required
      />

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-[#008080] rounded mb-3 text-black"
        required
      />

      <textarea
        placeholder="Your Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border border-[#008080] rounded mb-3 text-black"
        rows={4}
        required
      />

      <button
        type="submit"
        disabled={loading} // disable while loading
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-[#008080] hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
