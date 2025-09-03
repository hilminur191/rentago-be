// Nurbani
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadStream = (buffer: Buffer, folder = "payment_proofs") => {
  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload to Cloudinary failed"));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      stream.end(buffer);
    }
  );
};

export default cloudinary;
