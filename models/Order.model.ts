import mongoose, { Schema, Document, Model } from "mongoose";

// Order Item interface
interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId; // reference to Product
  quantity: number;
  price: number; // price per item
}

// Order interface
export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId; // reference to User
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "unverified";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema<IOrderItem> = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "unverified"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Avoid model overwrite issue in Next.js hot reload
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
