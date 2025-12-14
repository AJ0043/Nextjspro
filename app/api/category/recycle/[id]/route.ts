import connect from "@/lib/databaseConnection";
import Category from "@/models/Category.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  const { id } = params;
  await Category.findByIdAndUpdate(id, { deleted_at: new Date() });
  return NextResponse.json({ success: true });
}
