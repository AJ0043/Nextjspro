import { NextResponse } from "next/server";
import Coupon from "@/models/Coupons.model";
import dbConnect from "@/lib/databaseConnection";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Basic validation
    if (!data.code || !data.discountValue || !data.validFrom || !data.validTill) {
      return NextResponse.json({ message: "Please fill all required fields" }, { status: 400 });
    }

    // Check if code exists
    const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),

      // For old DB support
      discount: Number(data.discountValue),
      expiryDate: new Date(data.validTill),

      minOrderAmount: Number(data.minOrderAmount || 0),
      validFrom: new Date(data.validFrom),
      validTill: new Date(data.validTill),
      usageLimit: Number(data.usageLimit || 1),
      isActive: data.isActive ?? true,
    });

    // After saving, return all coupons
    const coupons = await Coupon.find();

    return NextResponse.json({ message: "Coupon created successfully ✅", coupon, coupons });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || "Failed to create coupon" }, { status: 500 });
  }
}

// GET request to fetch all coupons
export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find();
    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || "Failed to fetch coupons" }, { status: 500 });
  }
}
