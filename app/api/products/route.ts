import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";
import Category from "@/models/Category.model";

export async function GET() {
  try {
    await connect();

    // Fetch products & populate category
    const products = await Product.find({ deletedAt: null }) // correct field name
      .populate({
        path: "category",
        model: Category,
        select: "title slug", // only title & slug
      })
      .sort({ createdAt: -1 })
      .lean(); // lean returns plain JS objects

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (err: any) {
    console.error("GET PRODUCTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
