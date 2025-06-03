import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface UploadResult {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  publicId?: string; // For Cloudinary
}

// Configure Cloudinary (optional - only if you want to use cloud storage)
const initCloudinary = () => {
  if (process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
};

export async function uploadImage(
  file: File, 
  folder: string = 'general',
  maxSize: number = 5 * 1024 * 1024, // 5MB default
  useCloudStorage: boolean = false
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use cloud storage if configured and requested
    if (useCloudStorage && initCloudinary()) {
      return await uploadToCloudinary(file, buffer, folder);
    } else {
      return await uploadToLocal(file, buffer, folder);
    }
    
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function uploadToCloudinary(
  file: File, 
  buffer: Buffer, 
  folder: string
): Promise<UploadResult> {
  const fileExtension = path.extname(file.name);
  const publicId = `${folder}/${randomUUID()}`;

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: `coaching-kart/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  return {
    url: result.secure_url,
    fileName: `${publicId}${fileExtension}`,
    originalName: file.name,
    size: file.size,
    publicId: result.public_id,
  };
}

async function uploadToLocal(
  file: File, 
  buffer: Buffer, 
  folder: string
): Promise<UploadResult> {
  // Generate unique filename
  const fileExtension = path.extname(file.name);
  const fileName = `${randomUUID()}${fileExtension}`;
  
  // Create upload directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });
  
  // Write file
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  
  // Return upload result
  return {
    url: `/uploads/${folder}/${fileName}`,
    fileName,
    originalName: file.name,
    size: file.size,
  };
}

export async function uploadMultipleImages(
  files: File[],
  folder: string = 'general',
  maxSize: number = 5 * 1024 * 1024,
  useCloudStorage: boolean = false
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => 
    uploadImage(file, folder, maxSize, useCloudStorage)
  );
  return Promise.all(uploadPromises);
}

export function deleteImage(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    fs.unlink(fullPath, (err: any) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (initCloudinary()) {
    await cloudinary.uploader.destroy(publicId);
  }
}

export function getImageUrl(relativePath: string): string {
  if (relativePath.startsWith('http')) {
    return relativePath; // External URL or Cloudinary URL
  }
  
  if (relativePath.startsWith('/uploads')) {
    return relativePath; // Already a proper local path
  }
  
  return `/uploads/${relativePath}`;
}
