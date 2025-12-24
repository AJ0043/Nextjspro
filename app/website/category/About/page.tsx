import { Metadata } from "next";
import EnquiryForm from "./EnquiryForm";

/* ================= SEO METADATA ================= */
export const metadata: Metadata = {
  title: "About Us | E-Store",
  description:
    "Learn more about E-Store – your trusted online shopping destination for quality products, secure payments and fast delivery.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-purple-500 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About E-Store
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-purple-100">
          Your trusted destination for quality products, top brands,
          and a seamless online shopping experience.
        </p>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <span className="font-semibold">E-Store</span> is a modern
            e-commerce platform built to make online shopping easy,
            reliable, and enjoyable for everyone.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            From fashion and bags to electronics and daily essentials,
            we carefully curate products that meet quality standards
            at affordable prices.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our goal is to build long-term trust with our customers
            through transparency, secure payments, and fast delivery.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">
            Why Choose E-Store?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>✔ 100% Genuine Products</li>
            <li>✔ Competitive & Transparent Pricing</li>
            <li>✔ Secure Online Payments</li>
            <li>✔ Fast & Reliable Delivery</li>
            <li>✔ Dedicated Customer Support</li>
          </ul>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to simplify online shopping by providing
              a secure platform where customers can shop confidently
              and receive quality products at the best prices.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We aim to become a trusted e-commerce brand known for
              reliability, innovation, and customer-first service
              across India.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-3xl font-bold text-indigo-600">5K+</h4>
            <p className="text-gray-600 mt-2">Happy Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-3xl font-bold text-indigo-600">1K+</h4>
            <p className="text-gray-600 mt-2">Products</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-3xl font-bold text-indigo-600">24/7</h4>
            <p className="text-gray-600 mt-2">Support</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-3xl font-bold text-indigo-600">Fast</h4>
            <p className="text-gray-600 mt-2">Delivery</p>
          </div>
        </div>
      </section>

      {/* ================= ENQUIRY FORM ================= */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Product Enquiry
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Have a question or need help? Send us your enquiry and we’ll
            get back to you shortly.
          </p>

          <EnquiryForm />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-indigo-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Shop With Confidence
        </h2>
        <p className="text-indigo-100 mb-6">
          Discover top-quality products and amazing deals only on
          E-Store.
        </p>
        <a
          href="/"
          className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Start Shopping
        </a>
      </section>
    </div>
  );
}
