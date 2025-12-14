import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function GET() {
  try {
    await connect();

    const products = await Product.find({
      $or: [
        { deleted_at: { $exists: false } },
        { deleted_at: null }
      ]
    }).sort({ createdAt: -1 });

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
