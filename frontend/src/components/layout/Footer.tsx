import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#008080] text-black mt-10">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-bold text-white mb-3">MedEquip</h2>
          <p className="text-sm font-semibold text-black">
            Providing trusted medical equipment for healthcare professionals.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-bold text-white mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
          <p className="text-sm">Email: info@medequip.com</p>
          <p className="text-sm">Phone: +251 123456789</p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} MedEquip. All rights reserved.
      </div>
    </footer>
  );
}
