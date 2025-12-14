import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function uploadToCloudinary(file: File): Promise<UploadApiResponse> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "categories" },
      (error: any, result?: UploadApiResponse) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result);
      }
    ).end(buffer);
  });
}
