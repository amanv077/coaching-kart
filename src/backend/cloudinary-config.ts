import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  fileName: string;
  originalName: string;
  size: number;
  format: string;
  width: number;
  height: number;
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'coaching-kart',
  transformation?: any
): Promise<CloudinaryUploadResult> {
  try {
    // Validate file size (10MB limit for Cloudinary)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: `coaching-kart/${folder}`,
      resource_type: 'image',
      transformation: transformation || {
        quality: 'auto',
        fetch_format: 'auto',
      },
      // Generate unique filename
      public_id: `${folder}_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    });

    return {
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      fileName: uploadResult.original_filename || 'uploaded_image',
      originalName: file.name,
      size: uploadResult.bytes,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    };

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function uploadMultipleImagesToCloudinary(
  files: File[],
  folder: string = 'coaching-kart',
  transformation?: any
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map(file => 
    uploadImageToCloudinary(file, folder, transformation)
  );
  return Promise.all(uploadPromises);
}

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

export function getOptimizedImageUrl(
  url: string, 
  options?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  }
): string {
  if (!url.includes('cloudinary.com')) {
    return url; // Return as-is if not a Cloudinary URL
  }

  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  // Build transformation string
  let transformation = `q_${quality},f_${format}`;
  
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  if (width && height) transformation += ',c_fill';

  // Insert transformation into Cloudinary URL
  return url.replace('/upload/', `/upload/${transformation}/`);
}

export default cloudinary;
