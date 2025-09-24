"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save user and token
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        alert("Login successful!");
        window.location.href = "/"; // redirect
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="mt-50 max-w-md  mx-auto p-8 shadow-lg bg-[#00808020] rounded" >
    <form onSubmit={handleLogin} className="max-w-md mx-auto   text-black">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <button type="submit" className="bg-[#008080] text-white px-4 py-2 rounded w-full">
        Login
      </button>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-[#008080] hover:underline">
          Register
        </Link>
      </p>
    </form></div> 
  );
}
