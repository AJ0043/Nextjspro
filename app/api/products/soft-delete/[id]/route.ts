import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is Promise
) {
  try {
    await connect();

    // ✅ MUST unwrap params
    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Soft delete
    product.status = "inactive";
    product.deletedAt = new Date();
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product moved to Recycle Bin",
    });
  } catch (error) {
    console.error("SOFT DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Soft delete failed" },
      { status: 500 }
    );
  }
}
``
