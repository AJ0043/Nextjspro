import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";
import ProductVariant from "@/models/ProductVariant.model";

await connect();

// GET variants
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const variants = await ProductVariant.find({ product: id }).lean();
    return NextResponse.json({ variants });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 });
  }
}

// POST new variant
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const data = await req.formData();
    const sku = data.get("sku")?.toString()?.trim();
    const color = data.get("color")?.toString()?.trim();
    const size = data.get("size")?.toString()?.trim();
    const storage = data.get("storage")?.toString()?.trim();
    const stock = Number(data.get("stock") ?? 0);
    const finalPrice = product.finalPrice;

    if (!sku) return NextResponse.json({ error: "SKU is required" }, { status: 400 });

    const existing = await ProductVariant.findOne({ sku });
    if (existing) return NextResponse.json({ error: "SKU must be unique" }, { status: 400 });

    const newVariant = new ProductVariant({
      product: id,
      sku,
      attributes: { color, size, storage },
      stock,
      finalPrice,
    });

    await newVariant.save();
    return NextResponse.json({ message: "Variant added", variant: newVariant });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add variant" }, { status: 500 });
  }
}
