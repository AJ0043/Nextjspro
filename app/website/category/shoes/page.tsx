"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, AlignVerticalDistributeCenter } from "lucide-react";

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
  images: ImageObj[];
  category?: CategoryType;
  variants?: Variant[];
};

/* ================= FILTER DATA ================= */
const BRANDS = ["nike", "adidas", "puma", "reebok", "campus", "woodland"];
const COLORS = ["black", "white", "blue", "red", "green", "brown"];
const SIZES = ["6", "7", "8", "9", "10", "11"];
const GENDERS = ["men", "women"];

const PRICE_RANGES = [
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹4,000", min: 2000, max: 4000 },
  { label: "₹4,000 – ₹10,000", min: 4000, max: 10000 },
];

/* ================= PAGE ================= */
export default function ShoesProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] =
    useState<{ min: number; max: number; label: string } | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchProducts() {
      const res = await axios.get("/api/products");

      const shoes = res.data.products.filter(
        (p: ProductType) => p.category?.title.toLowerCase() === "shoes"
      );

      setProducts(shoes);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const text = `${p.title} ${p.slug}`.toLowerCase();

      // Gender filter
      if (genders.length && !genders.some((g) => text.includes(g))) return false;

      // Brand filter
      if (brands.length && !brands.some((b) => text.includes(b))) return false;

      // Price filter
      if (priceRange) {
        if (p.finalPrice < priceRange.min || p.finalPrice > priceRange.max) return false;
      }

      // Color filter: match title or variants
      if (colors.length) {
        const titleColorMatch = colors.some((c) => text.includes(c));
        const variantColorMatch = p.variants?.some((v) =>
          v.color ? colors.includes(v.color.toLowerCase().trim()) : false
        );
        if (!titleColorMatch && !variantColorMatch) return false;
      }

      // Size filter: match title or variants
      if (sizes.length) {
        const titleSizeMatch = sizes.some((s) => text.includes(s));
        const variantSizeMatch = p.variants?.some((v) =>
          v.size ? sizes.includes(v.size.toString()) : false
        );
        if (!titleSizeMatch && !variantSizeMatch) return false;
      }

      return true;
    });
  }, [products, brands, colors, sizes, priceRange, genders]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* ================= FILTER PANEL ================= */}
      <aside className="border rounded-lg p-4 bg-white h-fit">
        <Filter title="Gender" values={GENDERS} selected={genders} setSelected={setGenders} />
        <Filter title="Brand" values={BRANDS} selected={brands} setSelected={setBrands} />
        <Filter title="Color" values={COLORS} selected={colors} setSelected={setColors} />
        <Filter title="Size" values={SIZES} selected={sizes} setSelected={setSizes} />

        {/* PRICE */}
        <div className="mt-4">
          <p className="font-semibold mb-2 text-blue-500">Price</p>
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setPriceRange(r)}
              className={`block w-full text-left px-3 py-1 mb-1 text-sm rounded ${
                priceRange?.label === r.label ? "bg-blue-600 text-white" : "hover:bg-gray-100"
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
          Shoes ({filteredProducts.length})
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
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                  <Heart size={16} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{p.title}</h3>

                <div className="flex gap-2 items-center">
                  <span className="line-through text-sm text-gray-400">₹{p.price}</span>
                  <span className="text-green-700 font-bold text-lg">₹{p.finalPrice}</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex items-center justify-center gap-1 bg-purple-600 text-white text-xs font-semibold px-3 py-3 rounded-md hover:bg-blue-500"
                  >
                    <Eye size={14} /> View
                  </Link>

                  <button
                    className="flex items-center justify-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-3 rounded-md hover:bg-indigo-500"
                  >
                    <AlignVerticalDistributeCenter size={14} /> Varient
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
        <label key={v} className="flex gap-2 text-sm mb-1 items-center cursor-pointer">
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
            className="accent-blue-600"
          />
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </label>
      ))}
    </div>
  );
}
