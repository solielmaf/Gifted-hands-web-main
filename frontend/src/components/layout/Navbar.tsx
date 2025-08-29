"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface User {
  role?: string;
  is_admin?: boolean;
  name?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  // Check if user is logged in
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("adminUser");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Check initially
    checkUser();

    // Also check when the route changes
    const handleStorageChange = () => {
      checkUser();
    };

    // Listen for storage changes (like when logging in/out from other tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Removed pathname from dependencies

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;
    return user.role === "admin" || user.is_admin === true;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setUser(null);
    window.location.href = "/"; // Redirect to home page
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MedEquip
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center space-x-6 text-black">
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
          
          {/* Show logout button if user is admin */}
          {isAdmin() && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* mobile menu button */}
        <div className="md:hidden flex items-center">
          {/* Show logout button on mobile if user is admin */}
          {isAdmin() && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2 text-sm"
            >
              Logout
            </button>
          )}
          <button
            className="text-gray-700 font-semibold"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 text-black">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/products" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link href="/services" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          
          {/* Show admin info and logout in mobile menu */}
          {isAdmin() && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-4 py-2 text-sm text-gray-600">
                Welcome, {user?.name || 'Admin'}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}