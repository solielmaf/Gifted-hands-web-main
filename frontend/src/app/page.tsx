"use client";
import Hero from "@/components/Hero";
import Image from "next/image";
import Search from "@/components/Search";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Testimonial from "@/components/Testimonials";
import { ReactJsxRuntime } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";

export default function Home() {
  return (
    <div >
      <Hero />
      <Search />
      <FeaturedCarousel />
      <Testimonial />
    </div>
  );
}
