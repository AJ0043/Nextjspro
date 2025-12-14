import mongoose, { Schema, Document, models, model } from "mongoose";

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
  discount?: number;
  finalPrice: number;

  stock: number;

  images: {
    url: string;
    public_id?: string;
  }[];

  status: "active" | "inactive";

  createdAt: Date;
  updatedAt: Date;
}

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
      color: String,
      size: String,
      storage: String,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String },
        },
      ],
      validate: {
        validator: function (arr: any[]) {
          return arr.length <= 7;
        },
        message: "Maximum 7 images allowed per variant",
      },
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Prevent Next.js hot-reload error
const ProductVariant =
  models.ProductVariant ||
  model<ProductVariantDocument>("ProductVariant", ProductVariantSchema);

export default ProductVariant;
