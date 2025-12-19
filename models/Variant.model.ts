import mongoose, { Schema, Document, models, model } from "mongoose";

/* ---------------------------------------
   Variant Interface
---------------------------------------- */
export interface ProductVariantDocument extends Document {
  product: mongoose.Types.ObjectId;

  sku: string;

  attributes: {
    color?: string;
    size?: string;
    storage?: string;
    [key: string]: string | undefined;
  };

  price: number;
  discount: number;
  finalPrice: number;

  stock: number;

  description?: string; // ✅ Added description

  images: {
    url: string;
    public_id?: string;
  }[];

  status: "active" | "inactive";

  createdAt: Date;
  updatedAt: Date;
}

/* ---------------------------------------
   Variant Schema
---------------------------------------- */
const ProductVariantSchema = new Schema<ProductVariantDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    attributes: {
      color: { type: String, trim: true },
      size: { type: String, trim: true },
      storage: { type: String, trim: true },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    /* 🔥 MAX 4 IMAGES ONLY */
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String },
        },
      ],
      validate: {
        validator: function (arr: any[]) {
          return arr.length <= 4;
        },
        message: "Maximum 4 images allowed per variant",
      },
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------------------------------
   Safe Export (Next.js Hot Reload Fix)
---------------------------------------- */
const ProductVariant =
  models.ProductVariant ||
  model<ProductVariantDocument>("ProductVariant", ProductVariantSchema);

export default ProductVariant;
