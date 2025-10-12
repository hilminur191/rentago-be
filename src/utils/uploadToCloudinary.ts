import cloudinary from "../lib/cloudinary";

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "properties"
) {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}
