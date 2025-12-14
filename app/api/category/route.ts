// app/api/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import fs from "fs";
import path from "path";

// Connect DB
await connect();

// ================= GET ALL CATEGORIES =================
export async function GET() {
  try {
    const categories = await Category.find()
      .populate("parent", "title")
      .lean();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("Fetch categories error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// ================= CREATE NEW CATEGORY =================
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = (formData.get("title") as string)?.trim();
    const slugInput = (formData.get("slug") as string)?.trim();
    const parent = formData.get("parent") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!title || !slugInput) {
      return NextResponse.json({ error: "Title and slug required" }, { status: 400 });
    }

    const slug = slugInput || title.toLowerCase().replace(/\s+/g, "-");

    const exists = await Category.findOne({ slug });
    if (exists) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    // Image upload
    let imagePath: string | null = null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads/category");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${imageFile.name}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      imagePath = `/uploads/category/${fileName}`;
    }

    const category = await Category.create({
      title,
      slug,
      parent: parent || null,
      image: imagePath,
    });

    await category.populate("parent", "title");

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// ================= UPDATE CATEGORY =================
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const formData = await req.formData();
    const title = (formData.get("title") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim();
    const parent = formData.get("parent") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (title) category.title = title;
    if (slug) category.slug = slug;
    if (parent !== undefined) category.parent = parent || null;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads/category");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${imageFile.name}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      category.image = `/uploads/category/${fileName}`;
    }

    await category.save();
    await category.populate("parent", "title");

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("Update category error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// ================= DELETE CATEGORY =================
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
