import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

// soft delete route
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  const { id } = params;

  const product = await Product.findById(id);
  if (!product) 
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

  // TypeScript safe way
  product.status = "inactive";        // mark as inactive
  product.deletedAt = new Date();     // mark deletion timestamp
  await product.save();

  return NextResponse.json({ success: true, message: "Product soft deleted" });
}
