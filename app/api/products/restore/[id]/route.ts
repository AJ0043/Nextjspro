import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    // ✅ unwrap the Promise
    const { id } = await context.params;

    // ✅ Find the product which is soft deleted (inactive)
    const product = await Product.findById(id);
    if (!product || product.status !== "inactive") {
      return NextResponse.json(
        { success: false, message: "Product not found in inactive list" },
        { status: 404 }
      );
    }

    // ✅ Restore product
    product.status = "active";
    product.deletedAt = null;
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product restored successfully",
      product,
    });
  } catch (err) {
    console.error("RESTORE PRODUCT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to restore product" },
      { status: 500 }
    );
  }
}
