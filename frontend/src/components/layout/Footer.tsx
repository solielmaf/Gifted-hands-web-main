import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="container mx-auto px-4 py-8 grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company Info  */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">MedEquip</h2>
          <p className="text-sm">
            Providing trusted medical equipment for healthcare professionals.
          </p>
        </div>
        {/* link  */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Quick Links</h2>
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

        {/* contact  */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
          <p className="text-sm">Email: </p>
          <p className="text-sm">Phone: +251 123456789</p>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        @{new Date().getFullYear()} MedEquip. All rights reserved.
      </div>
    </footer>
  );
}
