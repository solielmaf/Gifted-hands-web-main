"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user and token
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        toast.success("Registration successful!", { position: "top-center" });
        setTimeout(() => {
          window.location.href = "/"; // redirect
        }, 1500);
      } else {
        toast.error(data.message || JSON.stringify(data.errors), { position: "top-center" });
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong", { position: "top-center" });
    }
  };

  return (
    <div className="mt-50 max-w-md  mx-auto p-8 shadow-lg bg-[#00808020] rounded" >
      <Toaster />
      <form onSubmit={handleRegister} className="max-w-md mx-auto  text-black p-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <button type="submit" className="bg-[#008080] text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}
