"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      
      const data = await res.json();

      // Handle both response formats:
      // 1. { user: {...}, token: '...' } 
      // 2. { role: 'admin', name: '...', token: '...' }
      
      let userData;
      let token;
      
      if (data.user) {
        // Format 1: User data is nested
        userData = data.user;
        token = data.token;
      } else {
        // Format 2: User data is at root level
        userData = data;
        token = data.token;
        // Remove token from user data to avoid storing it twice
        delete userData.token;
      }
      
      // Store token if it exists
      if (token) {
        localStorage.setItem("adminToken", token);
      }
      
      // Store user data
      localStorage.setItem("adminUser", JSON.stringify(userData));

      // Notify other components about the login
      window.dispatchEvent(new Event('storage'));

      router.push("/products"); // redirect to products page
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form onSubmit={handleLogin} className="bg-white p-6 shadow-lg rounded text-black w-96">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}