import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

/* -----------------------------
   Slug Generator
----------------------------- */
function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/* -----------------------------
   GET → Fetch All Products
----------------------------- */
export async function GET() {
  try {
    await connect();

    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* -----------------------------
   POST → Add Product (JSON)
----------------------------- */
export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    const {
      title,
      slug,
      price,
      discount = 0,
      description,
      category,
      stock = 0,
      images,
    } = body;

    // ✅ Validation
    if (!title || !price || !category || !images?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields missing",
        },
        { status: 400 }
      );
    }

    // ✅ Unique Slug
    const baseSlug = slug
      ? generateSlug(slug)
      : generateSlug(title);

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // ✅ Final price
    const finalPrice = Math.round(
      price - (price * discount) / 100
    );

    // ✅ Create Product
    const product = await Product.create({
      title,
      slug: uniqueSlug,
      description,
      category,
      price,
      discount,
      finalPrice,
      stock,
      images, // 🔥 URLs from upload API
      status: "active",
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Product add failed",
      },
      { status: 500 }
    );
  }
}
