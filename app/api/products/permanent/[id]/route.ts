import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const { id } = params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product permanently deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
