"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* logo  */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MedEquip
        </Link>

        {/* DESKTOP  */}
        <div className="hidden md:flex space-x-6 text-black">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link href="/services" className="hover:text-blue-600">
            Services
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About us
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>

        {/* mobile menu button  */}
        <button
          className="md:hidden text-gray-700 font-semibold"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu  */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 text-black">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/products" className="block px-4 py-2 hover:bg-gray-100">
            Products
          </Link>
          <Link href="/services" className="block px-4 py-2 hover:bg-gray-100">
            Services
          </Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">
            About Us
          </Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
