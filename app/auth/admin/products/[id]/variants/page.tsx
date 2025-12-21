"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye, Search, X, Download, Recycle } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface Variant {
  _id: string;
  sku: string;
  attributes: {
    color?: string;
    size: string;
  };
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  description?: string;
  images: { url: string }[];
}

interface Product {
  _id: string;
  title: string;
  description?: string;
}

export default function VariantsTablePage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selected, setSelected] = useState<Variant | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | null>(null);
  const [search, setSearch] = useState("");
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchVariants = async () => {
    if (!productId) return;
    try {
      const res = await axios.get(`/api/products/variants/${productId}`);
      setProduct(res.data.product);
      setVariants(res.data.variants || []);
    } catch (err: any) {
      console.error("Fetch variants error:", err.response?.data || err.message);
      alert("Failed to fetch variants. Check console.");
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  /* ---------------- VIEW ---------------- */
  const handleView = (variant: Variant) => {
    setSelected({ ...variant });
    setMode("view");
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = async () => {
    if (!selected) return;
    try {
      const fd = new FormData();
      fd.append("sku", selected.sku);
      fd.append("color", selected.attributes.color || "");
      fd.append("size", selected.attributes.size);
      fd.append("price", selected.price.toString());
      fd.append("discount", selected.discount.toString());
      fd.append("stock", selected.stock.toString());
      fd.append("description", selected.description || "");

      await axios.put(`/api/products/variants/${selected._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Variant updated ✅");
      setMode(null);
      setSelected(null);
      fetchVariants();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed ❌");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (variantId: string) => {
    if (!confirm("Delete this variant?")) return;
    try {
      await axios.delete(`/api/products/variants/${variantId}`);
      fetchVariants();
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  /* ---------------- EXPORT CSV ---------------- */
  const handleExport = () => {
    if (variants.length === 0) return alert("No data to export");
    const headers = ["SKU","Color","Size","Price","Discount","Final Price","Stock","Description"];
    const rows = variants.map(v => [
      v.sku,
      v.attributes.color || "",
      v.attributes.size,
      v.price,
      v.discount,
      v.finalPrice,
      v.stock,
      v.description || ""
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "product_variants.csv";
    link.click();
  };

  /* ---------------- RECYCLE ---------------- */
  const handleRecycle = () => setSearch("");

  /* ---------------- SEARCH FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return variants.filter(
      v => v.sku.toLowerCase().includes(q) || 
           v.attributes.color?.toLowerCase().includes(q) ||
           v.attributes.size.toLowerCase().includes(q)
    );
  }, [variants, search]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* PRODUCT HEADER */}
      {product && (
        <div className="bg-indigo-50 p-4 rounded-lg border shadow">
          <h1 className="text-2xl font-bold text-indigo-700">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Search SKU / color / size"
            className="w-full pl-10 pr-4 py-2 border rounded"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1 bg-emerald-500 px-3 py-2 text-white rounded hover:bg-emerald-600">
            <Download size={16} /> Export
          </button>
          <button onClick={handleRecycle} className="flex items-center gap-1 bg-purple-500 px-3 py-2 text-white rounded hover:bg-purple-600">
            <Recycle size={16} /> Recycle
          </button>
        </div>
      </div>

      {/* VARIANTS TABLE */}
      <div className="overflow-x-auto border rounded bg-white">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className={th}>SKU</th>
              <th className={th}>Color</th>
              <th className={th}>Size</th>
              <th className={th}>Price</th>
              <th className={th}>Discount</th>
              <th className={th}>Final</th>
              <th className={th}>Stock</th>
              <th className={th}>Description</th>
              <th className={th}>Images</th>
              <th className={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v._id} className="hover:bg-gray-50 cursor-pointer">
                <td className={td}>{v.sku}</td>
                <td className={td}>{v.attributes.color || "-"}</td>
                <td className={td}>{v.attributes.size}</td>
                <td className={td}>₹{v.price}</td>
                <td className={td}>{v.discount}%</td>
                <td className={`${td} font-bold text-green-600`}>₹{v.finalPrice}</td>
                <td className={td}>{v.stock}</td>
                <td className={td}>{v.description || "-"}</td>
                <td className={td}>
                  <div className="flex gap-1 overflow-x-auto">
                    {v.images.slice(0,4).map((img,i) => (
                      <img key={i} src={img.url} className="h-10 w-10 rounded border cursor-pointer" onClick={()=>setZoomImage(img.url)} />
                    ))}
                  </div>
                </td>
                <td className={td}>
                  <div className="flex gap-1">
                    <button onClick={()=>handleView(v)} className={btnGray}><Eye size={14}/></button>
                    <button onClick={()=>{setSelected({...v}); setMode("edit")}} className={btnBlue}><Pencil size={14}/></button>
                    <button onClick={()=>handleDelete(v._id)} className={btnRed}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW / EDIT MODAL */}
      {selected && mode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white p-6 rounded-xl max-w-[500px] w-full shadow-lg overflow-y-auto max-h-[90vh] relative">
            <button onClick={()=>{setSelected(null); setMode(null)}} className="absolute top-3 right-3 cursor-pointer text-red-900"><X size={20}/></button>
            <h3 className="text-2xl font-serif mb-4 text-center capitalize text-blue-800">{mode} Variant</h3>

            {mode === "view" ? (
              <>
                <div className="flex overflow-x-auto gap-2 mb-4">
                  {selected.images.map((img,i)=>(
                    <img key={i} src={img.url} className="h-24 w-24 object-cover rounded border cursor-pointer" onClick={()=>setZoomImage(img.url)} />
                  ))}
                </div>
                <div className="space-y-2 text-sm text-amber-700">
                  <p><b>SKU:</b> {selected.sku}</p>
                  <p><b>Color:</b> {selected.attributes.color || "-"}</p>
                  <p><b>Size:</b> {selected.attributes.size}</p>
                  <p><b>Price:</b> ₹{selected.price}</p>
                  <p><b>Discount:</b> {selected.discount}%</p>
                  <p><b>Final Price:</b> ₹{selected.finalPrice}</p>
                  <p><b>Stock:</b> {selected.stock}</p>
                  {selected.description && <p><b>Description:</b> {selected.description}</p>}
                </div>
              </>
            ) : (
              <div className="space-y-3 text-amber-900">
                <input className={input} value={selected.sku} onChange={e=>setSelected({...selected, sku:e.target.value})} />
                <input className={input} value={selected.attributes.color||""} onChange={e=>setSelected({...selected, attributes:{...selected.attributes, color:e.target.value}})} />
                <input className={input} value={selected.attributes.size} onChange={e=>setSelected({...selected, attributes:{...selected.attributes, size:e.target.value}})} />
                <input type="number" className={input} value={selected.price} onChange={e=>setSelected({...selected, price:+e.target.value})} />
                <input type="number" className={input} value={selected.discount} onChange={e=>setSelected({...selected, discount:+e.target.value})} />
                <input type="number" className={input} value={selected.stock} onChange={e=>setSelected({...selected, stock:+e.target.value})} />
                <textarea className={input} value={selected.description||""} onChange={e=>setSelected({...selected, description:e.target.value})} placeholder="Description" />
                <button onClick={handleEdit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">Update Variant</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMAGE ZOOM MODAL */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999] p-4">
          <img src={zoomImage} className="max-h-[90vh] max-w-full rounded shadow-lg" />
          <button onClick={()=>setZoomImage(null)} className="absolute top-5 right-5 text-white cursor-pointer"><X size={28}/></button>
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const th = "px-4 py-3 border text-left font-semibold";
const td = "px-4 py-3 border text-sky-900 ";
const btnGray = "bg-gray-700 text-white px-2 py-2 rounded hover:bg-gray-800";
const btnBlue = "bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700";
const btnRed = "bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700";
const input = "w-full border-2 border-gray-300 px-4 py-2 rounded-lg text-base focus:ring-2 focus:ring-indigo-500";
