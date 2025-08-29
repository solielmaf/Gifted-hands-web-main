"use client";


import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('/hero.png')" }}>
      {/* Background Image  */}
      

      {/* <Image
        src="/hero-medical.jpeg"
        alt="Hero Background"
        fill
        className="object-cover -z-10"
      /> */}

      

      {/* text */}
      <div className="relative text-center text-black px-4 pb-30">
        <h1 className="text-3xl md:text-5x1 font-bold mb-4">
          Trusted Medical Equipment for Your Facility
        </h1>
        <p className="text-sm md:text-lg mb-6">
          High-quality imaging, lab, and surgical tools delivered worldwide.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
        >
          Explore Products
        </Link>
      </div>
    </section>
  );
}
