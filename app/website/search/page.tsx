"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const res = await axios.get("/api/products");
      setProducts(res.data.products || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      `${p.title} ${p.slug}`.toLowerCase().includes(query)
    );
  }, [products, query]);

  if (loading) return <div className="p-6">Searching...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for "{query}" ({filtered.length})
      </h1>

      {filtered.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <Link
            key={p._id}
            href={`/products/${p.slug}`}
            className="border p-3 rounded hover:shadow"
          >
            <img
              src={p.images?.[0]?.url}
              className="h-40 w-full object-contain"
            />
            <h3 className="mt-2 font-semibold truncate">{p.title}</h3>
            <p className="text-green-600 font-bold">₹{p.finalPrice}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
