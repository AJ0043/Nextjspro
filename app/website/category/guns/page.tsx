"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, Eye, Layers } from "lucide-react";

/* ================= TYPES ================= */
type ImageObj = { url: string };

type CategoryType = { title: string };

type ProductType = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  images: ImageObj[];
  category?: CategoryType;
};

/* ================= FILTER DATA ================= */
const GUN_BRANDS = [
  { label: "Colt", value: "colt" },
  { label: "Smith & Wesson", value: "smith" },
  { label: "Beretta", value: "beretta" },
  { label: "Daniel Defense", value: "daniel" },
  { label: "Bushmaster", value: "bushmaster" },
  { label: "Ruger", value: "ruger" },
  { label: "PSA", value: "psa" },
  { label: "FN Herstal", value: "fn" },
  { label: "LWRC", value: "lwrc" },
  { label: "BCM", value: "bcm" },
  { label: "Glock", value: "glock" },
  { label: "MCMR", value: "mcmr" },
];

const GUN_TYPES = ["pistol", "rifle", "shotgun", "smg"];
const GUN_QUALITIES = ["military", "police", "civilian"];

const PRICE_RANGES = [
  { label: "₹20,000 – ₹50,000", min: 20000, max: 50000 },
  { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
  { label: "₹1,00,000 – ₹2,00,000", min: 100000, max: 200000 },
  { label: "₹2,00,000+", min: 200000, max: 10000000 },
];

/* ================= PAGE ================= */
export default function GunsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  /* FILTER STATES */
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  const [priceRange, setPriceRange] =
    useState<{ min: number; max: number; label: string } | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchProducts() {
      const res = await axios.get("/api/products");

      const gunProducts = res.data.products.filter(
        (p: ProductType) => p.category?.title === "Guns"
      );

      setProducts(gunProducts);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const text = `${p.title} ${p.slug}`.toLowerCase();

      if (selectedBrands.length > 0 && !selectedBrands.some((b) => text.includes(b))) return false;
      if (selectedTypes.length > 0 && !selectedTypes.some((t) => text.includes(t))) return false;
      if (selectedQuality.length > 0 && !selectedQuality.some((q) => text.includes(q))) return false;

      if (priceRange) {
        if (p.finalPrice < priceRange.min || p.finalPrice > priceRange.max) return false;
      }

      return true;
    });
  }, [products, selectedBrands, selectedTypes, selectedQuality, priceRange]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* ================= FILTER PANEL ================= */}
      <aside className="border rounded-lg p-4 bg-white h-fit">
        <h2 className="font-bold text-lg mb-4">Filters</h2>

        <FilterSectionObj
          title="Gun Brand"
          values={GUN_BRANDS}
          selected={selectedBrands}
          setSelected={setSelectedBrands}
        />

        <FilterSection
          title="Gun Type"
          values={GUN_TYPES}
          selected={selectedTypes}
          setSelected={setSelectedTypes}
        />

        <FilterSection
          title="Gun Quality"
          values={GUN_QUALITIES}
          selected={selectedQuality}
          setSelected={setSelectedQuality}
        />

        {/* PRICE */}
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
        <h1 className="text-3xl font-bold mb-6">Guns ({filteredProducts.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p._id} className="border rounded-xl bg-white shadow hover:shadow-lg transition">
              <div className="relative h-52 bg-gray-100">
                <img src={p.images?.[0]?.url} className="h-full w-full object-contain" />
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                  <Heart size={16} />
                </button>
              </div>

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
                    className="bg-purple-500 text-white text-xs py-2 rounded flex items-center justify-center gap-1"
                  >
                    <Eye size={14} /> View
                  </Link>

                  <Link
                    href={`/products/${p.slug}?variants=true`}
                    className="bg-green-300 text-xs py-2 rounded flex items-center justify-center gap-1"
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

/* ================= FILTER COMPONENTS ================= */
function FilterSection({
  title,
  values,
  selected,
  setSelected,
}: {
  title: string;
  values: string[];
  selected: string[];
  setSelected: any;
}) {
  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">{title}</p>
      {values.map((v) => (
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

function FilterSectionObj({
  title,
  values,
  selected,
  setSelected,
}: {
  title: string;
  values: { label: string; value: string }[];
  selected: string[];
  setSelected: any;
}) {
  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">{title}</p>
      {values.map((v) => (
        <label key={v.value} className="flex gap-2 text-sm mb-1">
          <input
            type="checkbox"
            checked={selected.includes(v.value)}
            onChange={() =>
              setSelected((prev: string[]) =>
                prev.includes(v.value)
                  ? prev.filter((x) => x !== v.value)
                  : [...prev, v.value]
              )
            }
          />
          {v.label}
        </label>
      ))}
    </div>
  );
}
