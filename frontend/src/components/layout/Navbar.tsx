"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

interface User {
  id: number;
  role?: string;
  name?: string;
  email?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedAdmin = localStorage.getItem("adminUser");
    const storedUser = localStorage.getItem("currentUser");
    if (storedAdmin) setUser(JSON.parse(storedAdmin));
    else if (storedUser) setUser(JSON.parse(storedUser));

    const handleStorage = () => {
      const updatedAdmin = localStorage.getItem("adminUser");
      const updatedUser = localStorage.getItem("currentUser");
      if (updatedAdmin) setUser(JSON.parse(updatedAdmin));
      else if (updatedUser) setUser(JSON.parse(updatedUser));
      else setUser(null);
    };
    window.addEventListener("storage", handleStorage);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-white text-black shadow-md" : "bg-gradient text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16"> {/* Reduced height */}
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="MedEquip Logo"
              width={200}
              height={40} 
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 border-black font-medium">
            
            <Link href="/" className="px-2 py-1 hover:text-[#008088] transition-colors">
              Home
            </Link>
            <Link href="/products" className="px-2 py-1 hover:text-[#008088] transition-colors">
              Products
            </Link>
            <Link href="/services" className="px-2 py-1 hover:text-[#008088] transition-colors">
              Services
            </Link>
            <Link href="/about" className="px-2 py-1 hover:text-[#008088] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="px-2 py-1 hover:text-[#008088] transition-colors">
              Contact
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-gray-600">
                  {user.role === "admin" ? "Admin" : user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href="/login"
                  className="bg-[#008080] w-30 h-8  text-center text-white px-3 py-1 rounded-full text-m hover:bg-[#006363] transition-colors"
                >
                  Login
                </Link>

              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/services" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {user ? (
              <div className="border-t border-gray-200 pt-2">
                <div className="px-3 py-2 text-gray-600 text-sm">
                  {user.role === "admin" ? "Admin" : "Welcome,"} {user.name || user.email}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-blue-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-green-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}