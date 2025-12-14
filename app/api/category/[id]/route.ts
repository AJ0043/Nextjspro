import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import Category from "@/models/Category.model";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connect();
  const { id } = await context.params;

  await Category.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await context.params;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const parent = formData.get("parent") as string | null;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    category.title = title;
    category.slug = slug;
    category.parent = parent || null;

    await category.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH Error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
