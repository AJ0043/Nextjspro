// app/api/products/inactive/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

/* -----------------------------
   GET: Fetch inactive products
----------------------------- */
export async function GET() {
  try {
    await connect();

    const products = await Product.find({ status: "inactive" })
      .populate("category")
      .sort({ deletedAt: -1 });

    const formattedProducts = products.map((p) => ({
      _id: p._id,
      title: p.title,
      price: p.price,
      finalPrice: p.finalPrice,
      status: p.status,
      deletedAt: p.deletedAt, // ✅ inactive date
      images: p.images || [],
      category: p.category || null,
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });
  } catch (err) {
    console.error("INACTIVE PRODUCTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inactive products" },
      { status: 500 }
    );
  }
}

/* -----------------------------
   DELETE: Permanently delete inactive product
   Use: /api/products/inactive?id=PRODUCT_ID
----------------------------- */
export async function DELETE(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    if (product.status !== "inactive") {
      return NextResponse.json({ success: false, message: "Product is not inactive" }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product permanently deleted" });
  } catch (err) {
    console.error("PERMANENT DELETE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to permanently delete product" },
      { status: 500 }
    );
  }
}
