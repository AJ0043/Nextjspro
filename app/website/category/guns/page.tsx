"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Layers } from "lucide-react";

type ImageObj = { url: string; public_id?: string };
type Variant = {
  _id?: string;
  color?: string;
  size?: string;
  price: number;
  discount?: number;
  sellingPrice: number;
};
type CategoryType = { _id: string; title: string; slug: string };

type ProductType = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  images: ImageObj[];
  category?: CategoryType;
  variants?: Variant[];
  createdAt: string;
  updatedAt: string;
};

export default function CargoProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await axios.get("/api/products");
        if (!res.data.success) throw new Error("Failed to load products");

        const cargoProducts = res.data.products.filter(
          (p: ProductType) => p.category?.title === "Guns"
        );

        const productsWithVariants = await Promise.all(
          cargoProducts.map(async (product: ProductType) => {
            try {
              const vRes = await axios.get(`/api/products/variants/${product._id}`);
              return { ...product, variants: vRes.data.variants || [] };
            } catch {
              return { ...product, variants: [] };
            }
          })
        );

        setProducts(productsWithVariants);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Cargo Products ({products.length})
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="group border rounded-xl bg-white overflow-hidden shadow hover:shadow-xl transition"
          >
            {/* IMAGE */}
            <div className="relative w-full h-52 bg-gray-100">
              {p.images?.[0]?.url ? (
                <img
                  src={p.images[0].url}
                  alt={p.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              {/* Wishlist */}
              <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:text-red-500 transition">
                <Heart size={18} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h2 className="font-semibold text-lg truncate">{p.title}</h2>
              <p className="text-sm text-gray-500">{p.category?.title}</p>

              <div className="flex items-center gap-3">
                <span className="line-through text-sm text-gray-400">
                  ₹{p.price}
                </span>
                <span className="text-green-700 font-bold text-lg">
                  ₹{p.finalPrice}
                </span>
              </div>

              {/* VARIANTS */}
              {p.variants && p.variants.length > 0 && (
                <div className="border-t pt-2 text-sm">
                  <p className="font-semibold mb-1">Available Variants</p>
                  {p.variants.slice(0, 2).map((v, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {v.color || "—"} {v.size && `| ${v.size}`}
                      </span>
                      <span className="font-semibold text-green-700">
                        ₹{v.sellingPrice}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-3 grid grid-cols-3 gap-3">
                <Link
                  href={`/products/${p.slug}`}
                  className="flex items-center justify-center gap-2 bg-purple-500 text-sm text-white font-medium border rounded-sm py-2 hover:bg-purple-400 transition cursor-pointer"
                >
                  <Eye size={16} /> View
                </Link>

                <Link
                  href={`/products/${p.slug}?variants=true`}
                  className="flex items-center justify-center gap-2 text-sm bg-green-300 font-medium border rounded-sm py-2 hover:bg-gray-100 transition"
                >
                  <Layers size={16} /> Variant
                </Link>

                <button className="flex items-center justify-center gap-2 text-sm font-semibold bg-indigo-600 text-white rounded-sm py-2 hover:bg-indigo-400 transition cursor-pointer">
                  <ShoppingCart size={16} /> Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
