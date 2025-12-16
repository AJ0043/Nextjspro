// app/api/products/permanent/[id]/route.ts
import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ params is Promise
) {
  try {
    await connect();

    // ✅ unwrap the promise
    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (err) {
    console.error("PERMANENT DELETE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
