import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const { id } = params;

  try {
    const formData = await req.formData();
    const updateData: any = {};

    // ----------------------------
    // Handle FormData fields
    // ----------------------------
    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const base64Image = `data:${value.type};base64,${buffer.toString(
          "base64"
        )}`;

        updateData.images = [
          {
            url: base64Image,
            public_id: value.name,
          },
        ];
      } 
      else if (key === "price" || key === "discount" || key === "stock") {
        updateData[key] = Number(value);
      } 
      else if (key === "variants") {
        // 🔥 VARIANTS LOGIC
        const parsedVariants = JSON.parse(value as string);

        updateData.variants = parsedVariants.map((v: any) => ({
          color: v.color || "",
          size: v.size || "",
          price: Number(v.price),
          discount: Number(v.discount || 0),
          sellingPrice: Math.round(
            v.price - (v.price * (v.discount || 0)) / 100
          ),
        }));
      } 
      else {
        updateData[key] = value;
      }
    }

    // ----------------------------
    // Recalculate product finalPrice
    // ----------------------------
    if (updateData.price !== undefined) {
      const price = updateData.price;
      const discount = updateData.discount || 0;
      updateData.finalPrice = Math.round(
        price - (price * discount) / 100
      );
    }

    // ----------------------------
    // Update product
    // ----------------------------
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}
