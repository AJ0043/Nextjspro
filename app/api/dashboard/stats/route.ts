import { NextResponse } from "next/server";
import connectDB from "@/lib/databaseConnection";

import Product from "@/models/product.model";
import Category from "@/models/Category.model";
import Coupon from "@/models/Coupons.model";
import User from "@/models/User.model";

export async function GET() {
  try {
    await connectDB();

    const [
      products,
      categories,
      coupons,
      totalUsers,
      normalUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Coupon.countDocuments(),
      User.countDocuments(),                  // total users
      User.find({ role: "user" }),            // only normal users
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        products,
        categories,
        coupons,
        users: totalUsers,
      },
      users: normalUsers, // ye frontend me users box ke liye
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
