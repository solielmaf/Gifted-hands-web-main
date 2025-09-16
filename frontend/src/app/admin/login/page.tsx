"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First fetch CSRF cookie
      const csrfResponse = await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      
      if (!csrfResponse.ok) {
        throw new Error("Failed to get CSRF token");
      }

      // Then proceed with login
      const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Handle both response formats safely
      const token = data.token || null;
      const userData = data.user || {
        role: data.role,
        name: data.name,
        email: data.email,
      };

      if (!token) {
        throw new Error("No token received from server");
      }

      // Store token + user info
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(userData));

      // Notify listeners (for Navbar/Chat reload)
      window.dispatchEvent(new Event("storage"));

      router.push("/"); // ✅ Redirect to homepage (or /admin-dashboard if needed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 shadow-lg rounded text-black w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

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
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}