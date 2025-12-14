import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function GET() {
  try {
    await connect();

    const products = await Product.find({
      status: "inactive",   // ✅ soft deleted products
    })
      .populate("category")
      .sort({ deletedAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("INACTIVE PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inactive products" },
      { status: 500 }
    );
  }
}
