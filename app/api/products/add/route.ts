import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Product from "@/models/product.model";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function GET() {
  await connect();
  const products = await Product.find()
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  try {
    await connect();

    // form-data
    const form = await req.formData();

    const title = (form.get("title") as string) ?? "";
    const slugInput = (form.get("slug") as string) ?? "";
    const price = Number(form.get("price"));
    const discount = Number(form.get("discount") || 0);
    const description = (form.get("description") as string) ?? "";
    const category = (form.get("category") as string) ?? "";
    const stock = Number(form.get("stock") || 0);

    const imageFile = form.get("images") as unknown as File;

    if (!imageFile) {
      return NextResponse.json({
        success: false,
        error: "Image is required",
      });
    }

    // convert to base64
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    // unique slug
    let slug = slugInput ? generateSlug(slugInput) : generateSlug(title);
    let uniqueSlug = slug;
    let counter = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const finalPrice = Math.round(price - (price * discount) / 100);

    // CREATE PRODUCT
    const product = await Product.create({
      title,
      slug: uniqueSlug,
      description,
      category,
      price,
      discount,
      finalPrice,
      stock,
      images: [
        {
          url: base64Image,
          public_id:
            imageFile.name || `${uniqueSlug}-${Date.now().toString()}`,
        },
      ],
      status: "active",
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err) {
    console.log("ERR PRODUCT ADD:", err);
    return NextResponse.json({
      success: false,
      error: "Failed to add product",
    });
  }
}
