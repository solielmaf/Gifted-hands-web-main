"use client";

import { useState } from "react";

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

        alert("Registration successful!");
        window.location.href = "/"; // redirect
      } else {
        alert(data.message || JSON.stringify(data.errors));
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-4">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mb-2 w-full" required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2 w-full" required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2 w-full" required />
      <input type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="border p-2 mb-2 w-full" required />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
