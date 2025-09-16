"use client";

import Image from "next/image";
import { Testimonial } from "./TestimonalModal";

interface Props {
  testimonial: Testimonial;
  userRole?: string;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: number) => void;
  getImageUrl: (img: string) => string;
}

export default function TestimonialCard({ testimonial, userRole, onEdit, onDelete, getImageUrl }: Props) {
  const avatars = Array.isArray(testimonial.avatar) ? testimonial.avatar : [testimonial.avatar || ""];
  const imgSrc = avatars[0] ? getImageUrl(avatars[0]) : "/placeholder.png";

  return (
    <div className="max-w-[400px] bg-white shadow-md p-4 rounded-lg flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200">
      <div className="relative rounded-full w-20 h-20 flex-shrink-0 mr-10 overflow-hidden">
        <Image src={imgSrc} alt={testimonial.name} width={80} height={80} className="object-cover rounded-full" />
      </div>
      <div>
        <h2 className="font-semibold text-left text-black">{testimonial.name}</h2>
        {testimonial.designation && (
          <p className="text-gray-500 mt-1 text-left mb-6 text-sm">{testimonial.designation}</p>
        )}
        <p className="mt-2 break-words text-gray-700 text-left">{testimonial.message}</p>

        {userRole === "admin" && (
          <div className="flex gap-2 mt-2">
            <button
              className="bg-yellow-400 px-2 py-1 rounded text-white text-sm"
              onClick={() => onEdit(testimonial)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 px-2 py-1 rounded text-white text-sm"
              onClick={() => onDelete(testimonial.id!)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
