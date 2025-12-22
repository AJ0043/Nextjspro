import { NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";
import Category from "@/models/Category.model";

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
      .populate({
        path: "category",
        model: Category,
        select: "title slug", // only fetch title and slug
      })
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
   POST → Add New Product
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

    if (!title || !price || !category || !images?.length) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = slug ? generateSlug(slug) : generateSlug(title);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const finalPrice = Math.round(price - (price * discount) / 100);

    const product = await Product.create({
      title,
      slug: uniqueSlug,
      description,
      category, // this should be ObjectId of category
      price,
      discount,
      finalPrice,
      stock,
      images,
      status: "active",
    });

    // Populate category for response
    const populatedProduct = await product.populate({
      path: "category",
      model: Category,
      select: "title slug",
    });

    return NextResponse.json({ success: true, product: populatedProduct });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Product add failed" },
      { status: 500 }
    );
  }
}
