import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFiles = formData.getAll("images") as File[];

  if (!imageFiles.length) {
    return NextResponse.json({
      success: false,
      message: "No files uploaded",
    });
  }

  const savedImages: { url: string; name: string }[] = [];

  // ✅ IMPORTANT CHANGE HERE
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "products"
  );

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (const file of imageFiles) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uniqueName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueName);

    await fs.promises.writeFile(filePath, buffer);

    savedImages.push({
      url: `/uploads/products/${uniqueName}`, // ✅ PUBLIC URL
      name: uniqueName,
    });
  }

  return NextResponse.json({
    success: true,
    files: savedImages,
  });
}
