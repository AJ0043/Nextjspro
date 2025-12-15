import { NextRequest, NextResponse } from "next/server";
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
   POST → Add Product (FormData)
----------------------------- */
export async function POST(req: NextRequest) {
  try {
    await connect();

    // ✅ Read FormData
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const slugInput = formData.get("slug") as string;
    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount") || 0);
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock") || 0);

    const imageFiles = formData.getAll("images") as File[];

    // ✅ Validation
    if (!title || !price || !category || imageFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields or images missing",
        },
        { status: 400 }
      );
    }

    // ✅ Convert images to base64 (or later Cloudinary)
    const images = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          url: `data:${file.type};base64,${buffer.toString("base64")}`,
          public_id: `${Date.now()}-${file.name}`,
        };
      })
    );

    // ✅ Unique slug
    let baseSlug = slugInput
      ? generateSlug(slugInput)
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

    // ✅ Create product
    const product = await Product.create({
      title,
      slug: uniqueSlug,
      description,
      category,
      price,
      discount,
      finalPrice,
      stock,
      images,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
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
