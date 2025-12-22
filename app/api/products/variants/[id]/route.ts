/* products/varients/[id]/route.ts */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/databaseConnection";
import ProductVariant from "@/models/Variant.model";
import Product from "@/models/product.model";
import fs from "fs";
import path from "path";

/* ================= GET ================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const isVariant = searchParams.get("variant") === "true";

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });

    if (isVariant) {
      const variant = await ProductVariant.findById(id).populate("product");
      if (!variant)
        return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });

      return NextResponse.json({ success: true, variant }, { status: 200 });
    }

    const product = await Product.findById(id).populate("category");
    if (!product)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    const variants = await ProductVariant.find({ product: id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, product, variants }, { status: 200 });

  } catch (error) {
    console.error("GET ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}

/* ================= POST ================= */
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });

    const formData = await req.formData();
    const sku = (formData.get("sku") as string)?.trim();
    const color = (formData.get("color") as string)?.trim();
    const size = (formData.get("size") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount") || 0);
    const stock = Number(formData.get("stock") || 0);

    if (!sku || !size || !price)
      return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });

    const skuExists = await ProductVariant.findOne({ sku });
    if (skuExists)
      return NextResponse.json({ success: false, message: "SKU already exists" }, { status: 409 });

    const finalPrice = Math.round(price - (price * discount) / 100);

    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length > 4)
      return NextResponse.json({ success: false, message: "Max 4 images allowed" }, { status: 400 });

    const savedImages: { url: string }[] = [];
    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "")}`;
      await fs.promises.writeFile(path.join(uploadDir, fileName), buffer);
      savedImages.push({ url: `/uploads/products/${fileName}` });
    }

    const variant = await ProductVariant.create({
      product: id,
      sku,
      description,
      attributes: { color, size },
      price,
      discount,
      finalPrice,
      stock,
      images: savedImages,
      status: "active",
    });

    return NextResponse.json({ success: true, message: "Variant added", variant }, { status: 201 });

  } catch (error) {
    console.error("POST ERROR", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ================= PUT ================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ success: false, message: "Invalid variant ID" }, { status: 400 });

    const variant = await ProductVariant.findById(id);
    if (!variant)
      return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });

    const formData = await req.formData();
    const price = Number(formData.get("price") || variant.price);
    const discount = Number(formData.get("discount") || variant.discount);
    const finalPrice = Math.round(price - (price * discount) / 100);

    variant.sku = (formData.get("sku") as string)?.trim() || variant.sku;
    variant.description = (formData.get("description") as string)?.trim() || variant.description;
    variant.attributes.color = (formData.get("color") as string)?.trim() || variant.attributes.color;
    variant.attributes.size = (formData.get("size") as string)?.trim() || variant.attributes.size;
    variant.price = price;
    variant.discount = discount;
    variant.finalPrice = finalPrice;
    variant.stock = Number(formData.get("stock") || variant.stock);

    await variant.save();
    return NextResponse.json({ success: true, message: "Variant updated", variant }, { status: 200 });

  } catch (error) {
    console.error("PUT ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to update variant" }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ success: false, message: "Invalid variant ID" }, { status: 400 });

    const deleted = await ProductVariant.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Variant deleted" }, { status: 200 });

  } catch (error) {
    console.error("DELETE ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to delete variant" }, { status: 500 });
  }
}
