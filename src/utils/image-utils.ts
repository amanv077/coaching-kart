// Utility functions for handling image URLs
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';
  
  // If it's already a full URL (Cloudinary or external), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path starting with /uploads, return as is
  if (imagePath.startsWith('/uploads')) {
    return imagePath;
  }
  
  // Otherwise, assume it's a relative path and prepend /uploads/
  return `/uploads/${imagePath}`;
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

export function getOptimizedImageUrl(
  imagePath: string | null | undefined,
  width?: number,
  height?: number,
  quality?: string
): string {
  const baseUrl = getImageUrl(imagePath);
  
  if (!baseUrl || !isCloudinaryUrl(baseUrl)) {
    return baseUrl; // Return as is for local images
  }
  
  // For Cloudinary URLs, we can add transformations
  // This is a simple implementation - Cloudinary URLs have a specific structure
  try {
    const url = new URL(baseUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex !== -1) {
      const transformations = [];
      if (width && height) {
        transformations.push(`w_${width},h_${height},c_fill`);
      } else if (width) {
        transformations.push(`w_${width}`);
      } else if (height) {
        transformations.push(`h_${height}`);
      }
      
      if (quality) {
        transformations.push(`q_${quality}`);
      }
      
      if (transformations.length > 0) {
        pathParts.splice(uploadIndex + 1, 0, transformations.join(','));
        url.pathname = pathParts.join('/');
        return url.toString();
      }
    }
  } catch (error) {
    console.warn('Failed to parse Cloudinary URL for optimization:', error);
  }
  
  return baseUrl;
}

export function getImageAlt(imagePath: string | null | undefined, fallback: string = 'Image'): string {
  if (!imagePath) return fallback;
  
  // Extract filename from path
  const filename = imagePath.split('/').pop()?.split('.')[0];
  return filename ? filename.replace(/[-_]/g, ' ') : fallback;
}
