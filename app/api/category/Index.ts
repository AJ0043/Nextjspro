// File: /app/api/category/Index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import connect from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import { response, catchError } from "@/utils/helper";

// Disable Next.js default body parsing
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();

    // -------------------------
    // GET ALL CATEGORIES
    // -------------------------
    if (req.method === "GET") {
      const categories = await Category.find().populate("parent");
      return response(true, 200, "Categories fetched successfully", { categories });
    }

    // -------------------------
    // CREATE CATEGORY
    // -------------------------
    if (req.method === "POST") {
      const uploadDir = path.join(process.cwd(), "/public/uploads");

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const form = formidable({
        multiples: false,
        uploadDir,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) return response(false, 500, err.message);

        // -------------------------
        // Handle logo file safely
        // -------------------------
        const logoFile = files.logo as File | undefined;

        // -------------------------
        // Handle parent field safely
        // -------------------------
        let parentId: string | null = null;
        if (fields.parent) {
          parentId = Array.isArray(fields.parent) ? fields.parent[0] : fields.parent;
        }

        // -------------------------
        // Helper to convert string|string[]|undefined to string
        // -------------------------
        function toStringField(field: string | string[] | undefined): string {
          if (!field) return "";
          return Array.isArray(field) ? field[0] : field;
        }

        // -------------------------
        // Create category
        // -------------------------
        const category = new Category({
          title: toStringField(fields.title),
          slug: toStringField(fields.slug),
          parent: parentId,
          logo: logoFile ? "/uploads/" + path.basename(logoFile.filepath) : null,
        });

        await category.save();
        return response(true, 201, "Category created successfully", { category });
      });
    } else {
      return response(false, 405, "Method Not Allowed");
    }
  } catch (err: any) {
    return catchError(err);
  }
}
