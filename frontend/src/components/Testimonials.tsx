"use client";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  message: string;
  avatar: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Lee",
    company: "City Hospital",
    message: "The X_Ray machine we purchased is top-notch. Excellent service!",
    avatar: "/sarah.jfif",
  },
  {
    id: 2,
    name: "John Carter",
    company: "LabTech Inc.",
    message: "Quick delivery and very reliable medical equipment.",
    avatar: "/testimonials/john.jpg",
  },
  {
    id: 3,
    name: "Dr. Emily Wong",
    company: "Sunrise Clinic",
    message: "Highly recommend their ultrasound devices. Outstanding quality.",
    avatar: "/testimonials/emily.jpg",
  },
];

export default function Testimonial() {
  return (
    <section className="my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        What Our Clients Say
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {mockTestimonials.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-semibold text-black">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.company}</p>
              </div>
            </div>
            <p className="text-gray-700">{t.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
