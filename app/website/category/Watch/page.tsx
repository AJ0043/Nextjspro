"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, Eye, Layers } from "lucide-react";

/* ================= TYPES ================= */
type ImageObj = { url: string };

type Variant = {
  _id?: string;
  color?: string;
  sellingPrice: number;
};

type CategoryType = {
  _id: string;
  title: string;
};

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
const PRICE_RANGES = [
  { label: "₹500 - ₹800", min: 500, max: 800 },
  { label: "₹800 - ₹1600", min: 800, max: 1600 },
  { label: "₹1600 - ₹3200", min: 1600, max: 3200 },
  { label: "₹3200 - ₹5500", min: 3200, max: 5500 },
  { label: "₹5500 - ₹10000", min: 5500, max: 10000 },
];

const COLORS = ["black", "silver", "red", "green", "grey","blue"];

const BRANDS = ["sonata","rado","fossil","titan","casio","timex","rolex"];

const GENDERS = ["men", "women"];

/* ================= PAGE ================= */
export default function WatchProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] =
    useState<{ label: string; min: number; max: number } | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await axios.get("/api/products");

      const watchProducts = res.data.products.filter(
        (p: ProductType) => p.category?.title === "Watch"
      );

      const withVariants = await Promise.all(
        watchProducts.map(async (p: ProductType) => {
          try {
            const v = await axios.get(`/api/products/variants/${p._id}`);
            return { ...p, variants: v.data.variants || [] };
          } catch {
            return { ...p, variants: [] };
          }
        })
      );

      setProducts(withVariants);
      setLoading(false);
    }

    fetchData();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const title = p.title.toLowerCase();

      /* PRICE */
      if (priceRange) {
        if (p.finalPrice < priceRange.min || p.finalPrice > priceRange.max)
          return false;
      }

      /* COLOR */
      if (selectedColors.length > 0) {
        const titleColorMatch = selectedColors.some((c) =>
          title.includes(c)
        );

        const variantColorMatch =
          p.variants?.some(
            (v) =>
              v.color &&
              selectedColors.includes(v.color.toLowerCase())
          ) ?? false;

        if (!titleColorMatch && !variantColorMatch) return false;
      }

      /* BRAND */
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some((b) =>
          title.includes(b)
        );
        if (!brandMatch) return false;
      }

      /* GENDER */
      if (selectedGenders.length > 0) {
        const isMen =
          title.includes("men") ||
          title.includes("mens") ||
          title.includes("gents") ||
          title.includes("male");

        const isWomen =
          title.includes("women") ||
          title.includes("womens") ||
          title.includes("ladies") ||
          title.includes("female");

        if (
          (selectedGenders.includes("men") && isMen) ||
          (selectedGenders.includes("women") && isWomen)
        ) {
          return true;
        }

        return false;
      }

      return true;
    });
  }, [
    products,
    priceRange,
    selectedColors,
    selectedBrands,
    selectedGenders,
  ]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* ================= FILTER PANEL ================= */}
      <aside className="border rounded-lg p-4 bg-white h-fit">
        <h2 className="font-bold text-lg mb-4">Filters</h2>

        {/* PRICE */}
        <div className="mb-5">
          <p className="font-semibold mb-2">Price</p>
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setPriceRange(r)}
              className={`block w-full text-left px-3 py-1 mb-1 text-sm rounded ${
                priceRange?.min === r.min && priceRange?.max === r.max
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={() => setPriceRange(null)}
            className="text-xs text-red-500"
          >
            Clear price
          </button>
        </div>

        {/* COLOR */}
        <div className="mb-5">
          <p className="font-semibold mb-2">Color</p>
          {COLORS.map((c) => (
            <label key={c} className="flex gap-2 text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedColors.includes(c)}
                onChange={() =>
                  setSelectedColors((prev) =>
                    prev.includes(c)
                      ? prev.filter((x) => x !== c)
                      : [...prev, c]
                  )
                }
              />
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </label>
          ))}
          <button
            onClick={() => setSelectedColors([])}
            className="text-xs text-red-500"
          >
            Clear colors
          </button>
        </div>

        {/* BRAND */}
        <div className="mb-5">
          <p className="font-semibold mb-2">Brand</p>
          {BRANDS.map((b) => (
            <label key={b} className="flex gap-2 text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() =>
                  setSelectedBrands((prev) =>
                    prev.includes(b)
                      ? prev.filter((x) => x !== b)
                      : [...prev, b]
                  )
                }
              />
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </label>
          ))}
          <button
            onClick={() => setSelectedBrands([])}
            className="text-xs text-red-500"
          >
            Clear brands
          </button>
        </div>

        {/* GENDER */}
        <div>
          <p className="font-semibold mb-2">Gender</p>
          {GENDERS.map((g) => (
            <label key={g} className="flex gap-2 text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedGenders.includes(g)}
                onChange={() =>
                  setSelectedGenders((prev) =>
                    prev.includes(g)
                      ? prev.filter((x) => x !== g)
                      : [...prev, g]
                  )
                }
              />
              {g === "men" ? "Men" : "Women"}
            </label>
          ))}
          <button
            onClick={() => setSelectedGenders([])}
            className="text-xs text-red-500"
          >
            Clear gender
          </button>
        </div>
      </aside>

      {/* ================= PRODUCTS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Watch Products ({filteredProducts.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl bg-white overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="relative h-44 bg-gray-100">
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    className="h-full w-full object-contain"
                  />
                )}
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                  <Heart size={16} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg truncate">{p.title}</h3>

                <div className="flex gap-2 items-center">
                  <span className="line-through text-sm text-gray-400">
                    ₹{p.price}
                  </span>
                  <span className="text-green-700 font-bold text-lg">
                    ₹{p.finalPrice}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex justify-center items-center gap-1 text-sm border rounded py-2 bg-purple-400"
                  >
                    <Eye size={14} /> View
                  </Link>

                  <Link
                    href={`/products/${p.slug}?variants=true`}
                    className="flex justify-center items-center gap-1 text-sm bg-green-300 rounded py-2"
                  >
                    <Layers size={14} /> Variant
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
