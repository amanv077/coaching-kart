import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { 
  uploadImageToCloudinary, 
  uploadMultipleImagesToCloudinary, 
  CloudinaryUploadResult,
  deleteImageFromCloudinary,
  getOptimizedImageUrl
} from './cloudinary-config';

export interface UploadResult {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  publicId?: string; // For Cloudinary
  width?: number;
  height?: number;
}

// Environment check for storage method
const USE_CLOUDINARY = process.env.NODE_ENV === 'production' || process.env.USE_CLOUDINARY === 'true';

export async function uploadImage(
  file: File, 
  folder: string = 'general',
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): Promise<UploadResult> {
  try {
    if (USE_CLOUDINARY) {
      // Use Cloudinary for production
      const result = await uploadImageToCloudinary(file, folder);
      return {
        url: result.secure_url, // Use secure HTTPS URL
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      };
    } else {
      // Use local storage for development
      return uploadImageLocally(file, folder, maxSize);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Local storage function (for development)
async function uploadImageLocally(
  file: File, 
  folder: string = 'general',
  maxSize: number = 5 * 1024 * 1024
): Promise<UploadResult> {
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
  maxSize: number = 5 * 1024 * 1024
): Promise<UploadResult[]> {
  if (USE_CLOUDINARY) {
    // Use Cloudinary for multiple uploads
    const results = await uploadMultipleImagesToCloudinary(files, folder);
    return results.map(result => ({
      url: result.secure_url,
      fileName: result.fileName,
      originalName: result.originalName,
      size: result.size,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }));
  } else {
    // Use local storage for development
    const uploadPromises = files.map(file => uploadImageLocally(file, folder, maxSize));
    return Promise.all(uploadPromises);
  }
}

export async function deleteImage(filePathOrPublicId: string): Promise<void> {
  if (USE_CLOUDINARY && !filePathOrPublicId.startsWith('/uploads')) {
    // Delete from Cloudinary using public_id
    await deleteImageFromCloudinary(filePathOrPublicId);
  } else {
    // Delete from local storage
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      const fullPath = path.join(process.cwd(), 'public', filePathOrPublicId);
      
      fs.unlink(fullPath, (err: any) => {
        if (err && err.code !== 'ENOENT') {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export function getImageUrl(
  relativePath: string, 
  options?: { width?: number; height?: number; quality?: string }
): string {
  if (relativePath.startsWith('http')) {
    // External URL - optimize if it's Cloudinary
    if (USE_CLOUDINARY && relativePath.includes('cloudinary.com')) {
      return getOptimizedImageUrl(relativePath, options);
    }
    return relativePath;
  }
  
  if (relativePath.startsWith('/uploads')) {
    return relativePath; // Local path
  }
  
  return `/uploads/${relativePath}`;
}
