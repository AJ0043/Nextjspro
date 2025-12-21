import { NextResponse } from "next/server";
import connectDB from "@/lib/databaseConnection";
import Order from "@/models/Order.model"; // Make sure Order.model exists

export async function GET() {
  try {
    await connectDB();

    // Count orders by status
    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled", "unverified"] as const;

    const counts = await Promise.all(
      statuses.map(async (status) => {
        const count = await Order.countDocuments({ status });
        return count;
      })
    );

    const stats = {
      pending: counts[0],
      processing: counts[1],
      shipped: counts[2],
      delivered: counts[3],
      cancelled: counts[4],
      unverified: counts[5],
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders stats" },
      { status: 500 }
    );
  }
}
