import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/databaseConnection";
import Coupon from "@/models/Coupons.model";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!params?.id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID missing" },
        { status: 400 }
      );
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(params.id);

    if (!deletedCoupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
