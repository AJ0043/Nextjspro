import mongoose, { Document } from "mongoose";

// -----------------------------
// Interface
// -----------------------------
export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  validFrom: Date;
  validTill: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  deletedAt?: Date | null;

  // Optional old DB support fields
  discount?: number;
  expiryDate?: Date;
}

// -----------------------------
// Schema
// -----------------------------
const couponSchema = new mongoose.Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    // Optional fields for old DB support
    discount: {
      type: Number,
      required: false,
    },
    expiryDate: {
      type: Date,
      required: false,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validTill: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// -----------------------------
// Export Model
// -----------------------------
export default mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", couponSchema);
