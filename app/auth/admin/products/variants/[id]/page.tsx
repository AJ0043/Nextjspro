"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Variant {
  _id: string;
  sku: string;
  attributes: {
    color?: string;
    size?: string;
    storage?: string;
  };
  finalPrice: number;
  stock: number;
}

export default function ProductVariantsPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`/api/products/variants/${productId}`);
      setVariants(res.data.variants || []);
    } catch (err) {
      console.error("Fetch variants failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchVariants();
  }, [productId]);

  if (loading) {
    return <div className="p-6">Loading variants...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Product Variants</h1>

      {variants.length === 0 ? (
        <p className="text-gray-500">No variants found for this product.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">SKU</th>
              <th className="border p-2">Attributes</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v._id}>
                <td className="border p-2">{v.sku}</td>
                <td className="border p-2">
                  {v.attributes.color && <>Color: {v.attributes.color} </>}
                  {v.attributes.size && <>Size: {v.attributes.size} </>}
                  {v.attributes.storage && <>Storage: {v.attributes.storage}</>}
                </td>
                <td className="border p-2">₹{v.finalPrice}</td>
                <td className="border p-2">{v.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
