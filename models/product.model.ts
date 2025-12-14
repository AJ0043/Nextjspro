import mongoose, { Document, Model } from "mongoose";

// ------------------------
// Variant Type
// ------------------------
export interface IVariant {
  color?: string;
  size?: string;
  price: number;
  discount?: number;
  sellingPrice: number;
}

// ------------------------
// Product Input Type
// ------------------------
export interface IProductInput {
  title: string;
  slug?: string;
  description?: string;
  category: mongoose.Types.ObjectId;
  brand?: string;
  price: number;
  discount?: number;
  stock?: number;
  images: { url: string; public_id: string }[];
  variants?: IVariant[]; // ✅ UPDATED
  status?: "active" | "inactive";
}

// ------------------------
// Product Interface
// ------------------------
export interface IProduct extends Document {
  title: string;
  slug: string;
  description?: string;
  category: mongoose.Types.ObjectId;
  brand?: string;
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  images: { url: string; public_id: string }[];
  variants?: IVariant[]; // ✅ UPDATED
  status: "active" | "inactive";
  deletedAt?: Date | null;

  softDelete: () => Promise<void>;
  restore: () => Promise<void>;
}

// ------------------------
// Variant Schema
// ------------------------
const variantSchema = new mongoose.Schema<IVariant>(
  {
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
  },
  { _id: false }
);

// ------------------------
// Product Schema
// ------------------------
const productSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String, default: "" },

    // Base product price (optional if variants exist)
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },

    stock: { type: Number, default: 0 },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // ✅ UPDATED VARIANTS
    variants: [variantSchema],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ------------------------
// Instance Methods
// ------------------------
productSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  this.status = "inactive";
  await this.save();
};

productSchema.methods.restore = async function () {
  this.deletedAt = null;
  this.status = "active";
  await this.save();
};

// ------------------------
// Static Methods
// ------------------------
interface ProductModel extends Model<IProduct> {
  createProduct: (data: IProductInput) => Promise<IProduct>;
  permanentDelete: (id: string) => Promise<void>;
}

productSchema.statics.createProduct = async function (data: IProductInput) {
  // Auto-generate slug
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().trim().replace(/\s+/g, "-");
  }

  // Base final price
  const price = data.price;
  const discount = data.discount || 0;
  const finalPrice = Math.round(price - (price * discount) / 100);

  // Process variants
  const variants = data.variants?.map((v) => ({
    ...v,
    sellingPrice: Math.round(
      v.price - (v.price * (v.discount || 0)) / 100
    ),
  }));

  return this.create({
    ...data,
    finalPrice,
    variants,
    stock: data.stock || 0,
  });
};

productSchema.statics.permanentDelete = async function (id: string) {
  await this.findByIdAndDelete(id);
};

// ------------------------
// Export Model
// ------------------------
const Product: ProductModel =
  (mongoose.models.Product as ProductModel) ||
  mongoose.model<IProduct, ProductModel>("Product", productSchema);

export default Product;
