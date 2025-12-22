import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";
import uploadToCloudinary from "@/lib/cloudinary";

/* =========================================================
   GET PRODUCT BY ID
========================================================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
      .populate("category")
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error("GET PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* =========================================================
   UPDATE PRODUCT (JSON / FORM-DATA)
========================================================= */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    let data: any = {};
    const contentType = req.headers.get("content-type") || "";

    /* ---------- FORM DATA ---------- */
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      const title = form.get("title");
      const slug = form.get("slug");
      const description = form.get("description");
      const category = form.get("category");
      const price = form.get("price");
      const discount = form.get("discount");
      const stock = form.get("stock");

      if (title) data.title = title.toString();
      if (slug) data.slug = slug.toString();
      if (description) data.description = description.toString();

      // ✅ FIXED CATEGORY
      if (category && category.toString().length > 0) {
        data.category = new mongoose.Types.ObjectId(category.toString());
      }

      if (price) data.price = Number(price);
      if (discount) data.discount = Number(discount);
      if (stock) data.stock = Number(stock);

      /* ---------- IMAGE ---------- */
      const image = form.get("images");

      if (image instanceof File && image.size > 0) {
        const upload = await uploadToCloudinary(image);
        data.images = [
          {
            url: upload.secure_url,
            public_id: upload.public_id,
          },
        ];
      }
    }

    /* ---------- JSON ---------- */
    else if (contentType.includes("application/json")) {
      data = await req.json();

      // ✅ FIX CATEGORY FROM JSON
      if (data.category) {
        data.category = new mongoose.Types.ObjectId(data.category);
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    /* ---------- FINAL PRICE ---------- */
    if (data.price !== undefined) {
      const discount = data.discount || 0;
      data.finalPrice = Math.round(
        data.price - (data.price * discount) / 100
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (err: any) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Product update failed" },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE PRODUCT (HARD DELETE)
========================================================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Product delete failed" },
      { status: 500 }
    );
  }
}
