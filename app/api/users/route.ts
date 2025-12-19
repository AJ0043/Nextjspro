import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/databaseConnection";
import User from "@/models/User.model";

/* ======================================================
   GET : Fetch all users
====================================================== */
export async function GET() {
  try {
    await dbConnect();

    // Fetch all users (deleted or not)
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("GET USERS ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}

/* ======================================================
   DELETE : Permanent delete user by ID
====================================================== */
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User permanently deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE USER ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}
