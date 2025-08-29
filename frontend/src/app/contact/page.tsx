"use client";

import ContactForm from "@/components/ContantForm";


export default function ContactPage() {

  return (
    <div>
    <div className="px-4 py-12 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <ContactForm  />

    </div>
    <div className="mt-8 w-full h-80 rounded-lg overflow-hidden shadow-md">
    <h1 className="text-3xl font-bold mb-6">Our Location</h1> 
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24650.580661647997!2d38.714856027897504!3d8.949163490292301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b812836dde735%3A0xcacd71faec17fbbc!2sGifted%20Hands%20Education%20Service%20P%20L%20C!5e1!3m2!1sen!2set!4v1756453247824!5m2!1sen!2set"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div></div>
  );
}
