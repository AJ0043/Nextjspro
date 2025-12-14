import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IMedia extends Document {
  asset_id: string;
  public_id: string;
  path: string;          // Cloudinary secure URL
  url: string;           // <-- add this for frontend
  thumbnail_url?: string;
  alt?: string;
  title?: string;
  deleted_at?: Date | null;
}

const mediaSchema = new Schema<IMedia>(
  {
    asset_id: { type: String, required: true, unique: true },
    public_id: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    url: { type: String, required: true },             // <-- new
    thumbnail_url: { type: String, default: null },
    alt: { type: String, default: "" },
    title: { type: String, default: "" },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

const Media = models.Media || model<IMedia>("Media", mediaSchema);
export default Media;
