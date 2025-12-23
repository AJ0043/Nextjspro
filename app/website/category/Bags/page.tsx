"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Layers } from "lucide-react";

/* ================= TYPES ================= */
type ImageObj = { url: string };

type Variant = {
  color?: string;
  size?: string;
  sellingPrice: number;
};

type CategoryType = { title: string };

type ProductType = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  discount: number;
  images: ImageObj[];
  category?: CategoryType;
  variants?: Variant[];
};

/* ================= FILTER DATA (BAGS) ================= */
const BAG_TYPES = [
  "trolley",
  "backpack",
  "duffle",
  "handbag",
  "laptop bag",
  "travel bag",
];

const BAG_BRANDS = [
  "american tourister",
  "skybags",
  "wildcraft",
  "vip",
  "safari",
  "tommy hilfiger",
];

const BAG_SIZES = ["small", "medium", "large", "cabin", "checkin"];

const PRICE_RANGES = [
  { label: "₹1,000 – ₹3,000", min: 1000, max: 3000 },
  { label: "₹3,000 – ₹6,000", min: 3000, max: 6000 },
  { label: "₹6,000 – ₹10,000", min: 6000, max: 10000 },
  { label: "₹10,000+", min: 10000, max: 100000 },
];

/* ================= PAGE ================= */
export default function BagsProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [types, setTypes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] =
    useState<{ min: number; max: number; label: string } | null>(null);

  const [wishlist, setWishlist] = useState<string[]>([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchProducts() {
      const res = await axios.get("/api/products");

      const bags = res.data.products.filter(
        (p: ProductType) => p.category?.title === "Lugagebags"
      );

      setProducts(bags);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const text = `${p.title} ${p.slug}`.toLowerCase();

      if (types.length && !types.some((t) => text.includes(t))) return false;
      if (brands.length && !brands.some((b) => text.includes(b))) return false;
      if (sizes.length && !sizes.some((s) => text.includes(s))) return false;

      if (priceRange) {
        if (p.finalPrice < priceRange.min || p.finalPrice > priceRange.max)
          return false;
      }

      return true;
    });
  }, [products, types, brands, sizes, priceRange]);

  /* ================= WISHLIST ================= */
  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* ================= FILTER PANEL ================= */}
      <aside className="border rounded-lg p-4 bg-white h-fit">
        <Filter title="Bag Type" values={BAG_TYPES} selected={types} setSelected={setTypes} />
        <Filter title="Brand" values={BAG_BRANDS} selected={brands} setSelected={setBrands} />
        <Filter title="Size" values={BAG_SIZES} selected={sizes} setSelected={setSizes} />

        {/* PRICE */}
        <div className="mt-4">
          <p className="font-semibold mb-2 text-blue-500">Price</p>
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setPriceRange(r)}
              className={`block w-full text-left px-3 py-1 mb-1 text-sm rounded ${
                priceRange?.label === r.label
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={() => setPriceRange(null)}
            className="text-xs text-red-500 mt-2"
          >
            Clear price
          </button>
        </div>
      </aside>

      {/* ================= PRODUCTS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Bags & Luggage ({filteredProducts.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl bg-white shadow hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <div className="relative h-52 bg-gray-100">
                <img
                  src={p.images?.[0]?.url}
                  className="h-full w-full object-contain"
                />

                {/* ❤️ HEART */}
                <button
                  onClick={() => toggleWishlist(p._id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                >
                  <Heart
                    size={16}
                    className={
                      wishlist.includes(p._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }
                  />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{p.title}</h3>

                <div className="flex gap-2 items-center">
                  <span className="line-through text-sm text-gray-400">
                    ₹{p.price}
                  </span>
                  <span className="text-green-700 font-bold text-lg">
                    ₹{p.finalPrice}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex items-center justify-center gap-1
                    border border-blue-500 text-blue-600
                    text-xs font-semibold px-3 py-2 rounded-md
                    hover:bg-blue-500 hover:text-white transition"
                  >
                    <Eye size={14} /> View
                  </Link>

                  <Link
                    href={`/products/${p.slug}?variants=true`}
                    className="flex items-center justify-center gap-1
                    border border-green-500 text-green-600
                    text-xs font-semibold px-3 py-2 rounded-md
                    hover:bg-green-500 hover:text-white transition"
                  >
                    <Layers size={14} /> Variant
                  </Link>

                  <button
                    className="flex items-center justify-center gap-1
                    border border-indigo-600 bg-indigo-600 text-white
                    text-xs font-semibold px-3 py-2 rounded-md
                    hover:bg-indigo-500 transition"
                  >
                    <ShoppingCart size={14} /> Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= FILTER COMPONENT ================= */
function Filter({ title, values, selected, setSelected }: any) {
  return (
    <div className="mb-4">
      <p className="font-semibold mb-2 text-blue-500">{title}</p>
      {values.map((v: string) => (
        <label key={v} className="flex gap-2 text-sm mb-1 items-center">
          <input
            type="checkbox"
            checked={selected.includes(v)}
            onChange={() =>
              setSelected((prev: string[]) =>
                prev.includes(v)
                  ? prev.filter((x) => x !== v)
                  : [...prev, v]
              )
            }
          />
          {v.toUpperCase()}
        </label>
      ))}
    </div>
  );
}
