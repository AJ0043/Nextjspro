import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-amber-100 text-gray-300 mt-50">
      <div
        className="
          max-w-7xl mx-auto
          px-6
          py-16          /* 🔥 Footer height badhayi */
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-5  /* 🔥 Extra column added */
          gap-10
        "
      >
        {/* ================= LOGO / ABOUT ================= */}
        <div className="md:col-span-2">
          <div className="relative w-[170px] h-[60px]">
            <Image
              src="/estore.webp"
              alt="E-Store Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <p className="mt-5 text-base text-black leading-relaxed">
            E-Store is your one-stop online shopping destination.  
            We deliver genuine products, unbeatable prices, and fast delivery
            across India.
          </p>

          {/* TRUST POINTS */}
          <ul className="mt-4 space-y-2 text-sm text-black">
            <li>✔ Fast & Secure Delivery</li>
            <li>✔ 100% Genuine Products</li>
            <li>✔ Easy Returns & Refunds</li>
          </ul>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-5 cursor-pointer">
            Quick Links
          </h3>
          <ul className="space-y-3 text-md text-black cursor-pointer">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/shop" className="hover:text-white">Shop</a></li>
            <li><a href="/offers" className="hover:text-white">Offers</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* ================= CATEGORIES ================= */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-5">
            Categories
          </h3>
          <ul className="space-y-3 text-md text-black">
            <li><a href="#" className="hover:text-white">Fashion</a></li>
            <li><a href="#" className="hover:text-white">Electronics</a></li>
            <li><a href="#" className="hover:text-white">Shoes</a></li>
            <li><a href="#" className="hover:text-white">Home Decor</a></li>
            <li><a href="#" className="hover:text-white">Gadgets</a></li>
          </ul>
        </div>

        {/* ================= SUPPORT ================= */}
        <div>
          <h3 className="text-black font-semibold text-lg mb-5">
            Customer Support
          </h3>
          <ul className="space-y-3 text-md text-black">
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            <li><a href="/shipping" className="hover:text-white">Shipping Policy</a></li>
            <li><a href="/returns" className="hover:text-white">Return Policy</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      {/* ================= NEWSLETTER FULL WIDTH ================= */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-white text-xl font-semibold mb-2">
            Subscribe to our Newsletter
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Get exclusive deals & latest product updates
          </p>

          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-l-md bg-gray-900 text-sm outline-none"
            />
            <button className="bg-lime-500 text-black px-6 rounded-r-md font-semibold hover:bg-lime-400">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-gray-700 text-center py-5 text-sm text-gray-400">
        © {new Date().getFullYear()} E-Store. All rights reserved.
      </div>
    </footer>
  );
}
