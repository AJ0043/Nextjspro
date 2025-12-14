// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";
import uploadToCloudinary from "@/lib/cloudinary";

/* ========================= GET / PUT / DELETE PRODUCT ========================= */
export async function GET(
  req: NextRequest,
  context: { params: any }
) {
  try {
    await connect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: any }
) {
  try {
    await connect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    let data: any = {};
    const contentType = req.headers.get("content-type") || "";

    /* ---------- JSON UPDATE ---------- */
    if (contentType.includes("application/json")) {
      data = await req.json();
    }

    /* ---------- FORM DATA UPDATE (image) ---------- */
    else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      data.title = form.get("title")?.toString();
      data.slug = form.get("slug")?.toString();
      data.description = form.get("description")?.toString() || "";
      data.category = form.get("category")?.toString();
      data.price = Number(form.get("price") ?? 0);
      data.discount = Number(form.get("discount") ?? 0);
      data.stock = Number(form.get("stock") ?? 0);

      const image = form.get("images");
      if (image instanceof File && image.size > 0) {
        const upload = await uploadToCloudinary(image);
        data.images = [
          { url: upload.secure_url, public_id: upload.public_id },
        ];
      }
    } else {
      return NextResponse.json({ success: false, message: "Unsupported Content-Type" }, { status: 400 });
    }

    /* ---------- FINAL PRICE ---------- */
    if (data.price !== undefined && data.discount !== undefined) {
      data.finalPrice = data.price - (data.price * (data.discount || 0)) / 100;
    }

    const updated = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: any }
) {
  try {
    await connect();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
