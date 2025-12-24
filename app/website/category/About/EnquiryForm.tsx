"use client";

import { useState } from "react";

export default function EnquiryForm() {
  const [form, setForm] = useState({
    customerName: "",
    productName: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Enquiry Submitted:", form);

    alert("Your enquiry has been submitted successfully!");

    setForm({
      customerName: "",
      productName: "",
      message: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-xl shadow space-y-4"
    >
      {/* CUSTOMER NAME */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Customer Name
        </label>
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          required
          placeholder="Enter your name"
          className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* PRODUCT NAME */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Product Name
        </label>
        <input
          type="text"
          name="productName"
          value={form.productName}
          onChange={handleChange}
          required
          placeholder="Enter product name"
          className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* MESSAGE */}
      <div>
        <label className="text-sm font-semibold text-gray-600">
          Message
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Write your enquiry..."
          className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition"
      >
        Submit Enquiry
      </button>
    </form>
  );
}
