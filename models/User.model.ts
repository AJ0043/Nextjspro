import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ---------------------------------------------
// 📌 USER INTERFACE
// ---------------------------------------------
export interface IUser extends Document {
  role: "user" | "admin";
  name: string;
  email: string;
  password: string;

  avatar?: {
    url?: string;
    public_id?: string;
  };

  isEmailVerified: boolean;
  verificationToken?: string | null;

  otp?: string | null;
  otpExpiry?: number | null;

  phone?: string;
  address?: string;

  deletedAt?: Date | null;

  resetPasswordToken?: string | null;
  resetPasswordExpiry?: Date | null;

  comparePassword(password: string): Promise<boolean>;
  softDelete(): Promise<void>;
}

// ---------------------------------------------
// 📌 USER SCHEMA
// ---------------------------------------------
const userSchema = new mongoose.Schema<IUser>(
  {
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true, trim: true, select: false },
    avatar: { url: { type: String, default: "" }, public_id: { type: String, default: "" } },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Number, default: null },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    deletedAt: { type: Date, default: null, index: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// ---------------------------------------------
// 📌 PRE-SAVE → HASH PASSWORD & LOWERCASE EMAIL
// ---------------------------------------------
userSchema.pre<IUser>("save", async function () {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// ---------------------------------------------
// 📌 COMPARE PASSWORD
// ---------------------------------------------
userSchema.methods.comparePassword = async function (
  this: IUser,
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// ---------------------------------------------
// 📌 SOFT DELETE
// ---------------------------------------------
userSchema.methods.softDelete = async function (this: IUser) {
  this.deletedAt = new Date();
  // TypeScript-safe save
  await (this as unknown as Document).save();
};

// ---------------------------------------------
// 📌 EXPORT
// ---------------------------------------------
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
