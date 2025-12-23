"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Layers } from "lucide-react";

/* ================= TYPES ================= */
type ImageObj = { url: string };

type Variant = {
  _id?: string;
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
const PRICE_RANGES = [
  { label: "₹500 – ₹800", min: 500, max: 800 },
  { label: "₹800 – ₹1600", min: 800, max: 1600 },
  { label: "₹1600 – ₹3200", min: 1600, max: 3200 },
  { label: "₹3200 – ₹5500", min: 3200, max: 5500 },
  { label: "₹5500 – ₹10000", min: 5500, max: 10000 },
];

const PRODUCT_TYPES = ["joggers", "pyjama", "shirts", "jeans", "pants"];
const COLORS = ["green", "black", "brown", "gray", "silver", "blue"];
const SIZES = ["s", "m", "l", "xl", "xxl"];
const GENDERS = ["men", "women"];

/* ================= PAGE ================= */
export default function CargoProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  /* FILTER STATES */
  const [priceRange, setPriceRange] =
    useState<{ min: number; max: number } | null>(null);

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/products");

      const cargoProducts = res.data.products.filter(
        (p: ProductType) => p.category?.title === "Cargo"
      );

      const withVariants = await Promise.all(
        cargoProducts.map(async (p: ProductType) => {
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
      const slug = p.slug.toLowerCase();

      /* PRICE */
      if (priceRange) {
        if (p.finalPrice < priceRange.min || p.finalPrice > priceRange.max)
          return false;
      }

      /* PRODUCT TYPE (joggers / pyjama / shirts / jeans / pants) */
      if (selectedType.length > 0) {
        const typeMatch = selectedType.some(
          (t) => title.includes(t) || slug.includes(t)
        );
        if (!typeMatch) return false;
      }

      /* GENDER */
      if (selectedGender.length > 0) {
        const isMen =
          title.includes("men") ||
          title.includes("mens") ||
          title.includes("gents");

        const isWomen =
          title.includes("women") ||
          title.includes("womens") ||
          title.includes("ladies");

        const genderMatch =
          (selectedGender.includes("men") && isMen) ||
          (selectedGender.includes("women") && isWomen);

        if (!genderMatch) return false;
      }

      /* COLOR (VARIANT + TITLE + SLUG) */
      if (selectedColors.length > 0) {
        const colorInVariant =
          p.variants?.some((v) =>
            selectedColors.some((c) =>
              v.color?.toLowerCase().includes(c)
            )
          ) ?? false;

        const colorInText = selectedColors.some(
          (c) => title.includes(c) || slug.includes(c)
        );

        if (!colorInVariant && !colorInText) return false;
      }

      /* SIZE */
      if (selectedSizes.length > 0) {
        const sizeMatch =
          p.variants?.some((v) =>
            selectedSizes.includes(v.size?.toLowerCase() || "")
          ) ?? false;

        if (!sizeMatch) return false;
      }

      return true;
    });
  }, [
    products,
    priceRange,
    selectedType,
    selectedColors,
    selectedSizes,
    selectedGender,
  ]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* ================= FILTER PANEL ================= */}
      <aside className="border rounded-lg p-4 bg-white h-fit">
        <h2 className="font-bold text-lg mb-4">Filters</h2>

        <FilterSection title="Product Type" values={PRODUCT_TYPES} selected={selectedType} setSelected={setSelectedType} />
        <FilterSection title="Gender" values={GENDERS} selected={selectedGender} setSelected={setSelectedGender} />
        <FilterSection title="Color" values={COLORS} selected={selectedColors} setSelected={setSelectedColors} />
        <FilterSection title="Size" values={SIZES} selected={selectedSizes} setSelected={setSelectedSizes} />

        <div className="mt-4">
          <p className="font-semibold mb-2">Price</p>
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setPriceRange(r)}
              className={`block w-full text-left px-3 py-1 mb-1 text-sm rounded ${
                priceRange?.label === r.label
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </aside>

      {/* ================= PRODUCTS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Cargo Products ({filteredProducts.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div key={p._id} className="border rounded-lg bg-white shadow hover:shadow-lg transition">
              <div className="relative h-44 bg-gray-100">
                <img src={p.images?.[0]?.url} className="h-full w-full object-contain" />
                <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow">
                  <Heart size={16} />
                </button>
              </div>

              <div className="p-3 space-y-1.5">
                <h2 className="font-semibold text-base truncate">{p.title}</h2>

                <div className="flex gap-2 items-center">
                  <span className="line-through text-xs text-gray-400">₹{p.price}</span>
                  <span className="text-green-700 font-bold text-base">₹{p.finalPrice}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Link href={`/products/${p.slug}`} className="bg-purple-500 text-white text-xs py-2 rounded flex items-center justify-center gap-1">
                    <Eye size={14} /> View
                  </Link>

                  <Link href={`/products/${p.slug}?variants=true`} className="bg-green-300 text-xs py-2 rounded flex items-center justify-center gap-1">
                    <Layers size={14} /> Variant
                  </Link>

                  <button className="bg-indigo-600 text-white text-xs py-2 rounded flex items-center justify-center gap-1">
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
function FilterSection({ title, values, selected, setSelected }: any) {
  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">{title}</p>
      {values.map((v: string) => (
        <label key={v} className="flex gap-2 text-sm mb-1">
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
