import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const { id } = params;

    const product = await Product.findById(id);
    if (!product || !product.deletedAt) {
      return NextResponse.json({ success: false, message: "Product not found in Recycle Bin" }, { status: 404 });
    }

    product.deletedAt = null;
    await product.save();

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to restore product" }, { status: 500 });
  }
}
