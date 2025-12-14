// src/lib/db.ts
import mongoose from "mongoose";

declare global {
  var _mongoose:
    | {
        conn?: typeof mongoose | null;
        promise?: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env file");
}

export default async function connect() {
  if (global._mongoose?.conn) {
    return global._mongoose.conn;
  }

  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  if (!global._mongoose.promise) {
    console.log("⏳ Connecting to MongoDB...");

    global._mongoose.promise = mongoose
      .connect(MONGODB_URI, {
        ssl: true,
        tlsAllowInvalidCertificates: true, // 🟢 FIX for SSL/TLS handshake error
      } as any)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}
