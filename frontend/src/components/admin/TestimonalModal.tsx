"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface TestimonialForm {
  name: string;
  email?: string;
  designation?: string;
  message: string;
}

export interface Testimonial extends TestimonialForm {
  id?: number;
  avatar?: string[] | string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: TestimonialForm, files: File[]) => void;
  editingTestimonial?: Testimonial;
}

export default function TestimonialModal({ isOpen, onClose, onSubmit, editingTestimonial }: Props) {
  const [form, setForm] = useState<TestimonialForm>({ name: "", email: "", designation: "", message: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (editingTestimonial) {
      setForm({
        name: editingTestimonial.name,
        email: editingTestimonial.email || "",
        designation: editingTestimonial.designation || "",
        message: editingTestimonial.message,
      });

      const avatars = Array.isArray(editingTestimonial.avatar)
        ? editingTestimonial.avatar
        : [editingTestimonial.avatar || ""];
      setPreviewUrls(avatars.filter(Boolean));
    } else {
      setForm({ name: "", email: "", designation: "", message: "" });
      setFiles([]);
      setPreviewUrls([]);
    }
  }, [editingTestimonial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    setFiles(selectedFiles);
    setPreviewUrls(selectedFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = () => {
    if (!form.name || !form.message) {
      toast.error("Name and Message are required");
      return;
    }
    onSubmit(form, files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded w-96 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFilesChange}
          className="w-full mb-2 p-2 border rounded"
        />

        <div className="flex gap-2 mb-2 flex-wrap">
          {previewUrls.map((url, i) => (
            <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button className="bg-gray-400 px-4 py-2 rounded text-white" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-[#008080] px-4 py-2 rounded text-white" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
