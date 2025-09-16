"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroItem {
  image: string;
  title: string;
  description: string;
}

export default function Hero() {
  const heroItems: HeroItem[] = [
    {
      image: "/hhn.jpg",
      title: "Premium Medical Equipment, Trusted for Care ",
      description: "High quality medical equipment for hospital and clinics reliable, precise and built to perform ",
    },
    {
      image: "/pp.jpg",
      title: "Advanced ECG Monitors",
      description: "Accurate heart monitoring for critical care patients.",
    },
    {
      image: "/pp2.webp",
      title: "Portable Ultrasound",
      description: "High-resolution imaging anywhere, anytime.",
    },
    {
      image: "/pp3.webp",
      title: "Surgical Instruments",
      description: "Precision tools trusted by surgeons worldwide.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
<section
  className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden px-6 md:px-12 transition-colors duration-1000"
  style={{
    background: `linear-gradient(310deg, #008080 0%, rgba(255,255,255,0.17) 70%, rgba(255,255,255,0) 100%)`,
  }}
>
  {/* Curved Wave Lines */}
  <svg
    className="absolute top-0 left-0 w-full h-full pointer-events-none"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
  >
    {Array.from({ length: 7 }).map((_, i) => {
      const startY = 1080 - i * 30; // start from bottom left
      const control1Y = startY - 300; // flip curve
      const control2Y = startY + 200;
      const endY = i * 30; // end near top right

      return (
        <path
          key={i}
          d={`
            M0 ${startY} 
            C480 ${control1Y}, 1440 ${control2Y}, 1920 ${endY}
          `}
          stroke="#444"
          strokeWidth={2}
          fill="transparent"
        />
      );
    })}
  </svg>
      {/* Text Section */}
      <div className="relative z-10 w-full md:w-1/2 md:pr-12 ml-5 lg:pr-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#008080] to-black bg-clip-text text-transparent transition-all duration-1000">
          {heroItems[currentIndex].title}
        </h1>
        <p className="text-gray-800 md:text-lg mb-6 transition-all duration-1000">
          {heroItems[currentIndex].description}
        </p>
        <Link
          href="/products"
          className="inline-block bg-[#008080] hover:bg-[#006363] text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Explore Products
        </Link>
      </div>

      {/* Image Slider on Right */}
      <div className="relative w-full md:w-1/2 h-full flex items-center justify-start overflow-visible">
        {heroItems.map((item, index) => {
          const position = (index - currentIndex + heroItems.length) % heroItems.length;
          let scale = 0.9;
          let zIndex = 10;
          let translateX = 50; // move more left

          if (position === 0) {
            scale = 1.05;
            zIndex = 30;
            translateX = -20; // front image slightly left
          } else if (position === 1) {
            scale = 0.95;
            zIndex = 20;
            translateX = 120;
          }

          return (
            <div
              key={index}
              className="absolute rounded-3xl transition-all duration-1000"
              style={{
                width: "480px",
                height: "480px",
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                boxShadow:
                  position === 0
                    ? "0 0 60px 20px rgba(0, 128, 128, 0.4), 0 10px 40px rgba(0,0,0,0.2)"
                    : "0 10px 20px rgba(0,0,0,0.15)",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-3xl hidden sm:block"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
