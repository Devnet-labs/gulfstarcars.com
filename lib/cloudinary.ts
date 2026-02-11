/**
 * Optimizes Cloudinary image URLs with transformation parameters
 * for faster loading and better performance
 */

export interface CloudinaryOptions {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'limit' | 'pad';
    gravity?: 'auto' | 'face' | 'center';
    fetchFormat?: 'auto';
}

/**
 * Optimizes a Cloudinary URL with transformation parameters
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(
    url: string,
    options: CloudinaryOptions = {}
): string {
    // Return original URL if empty, placeholder, or not a Cloudinary URL
    if (!url || url.startsWith('/') || url.startsWith('data:') || !url.includes('res.cloudinary.com')) {
        return url;
    }

    // Check if URL already has our optimization parameters to prevent double-optimization
    if (url.includes('q_auto') || url.includes('f_auto') || url.includes('dpr_auto')) {
        return url;
    }

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto',
        crop = 'fill',
        gravity = 'auto',
        fetchFormat = 'auto',
    } = options;

    // Build transformation string
    const transformations: string[] = [];

    // Add quality - use 'auto:best' for better quality with auto optimization
    if (quality === 'auto') {
        transformations.push('q_auto:best');
    } else {
        transformations.push(`q_${quality}`);
    }

    // Add format with auto fallback
    transformations.push('f_auto');

    // Add dimensions if provided
    if (width) {
        transformations.push(`w_${width}`);
    }
    if (height) {
        transformations.push(`h_${height}`);
    }

    // Add crop mode if dimensions are provided
    if (width || height) {
        transformations.push(`c_${crop}`);
        if (gravity && crop === 'fill') {
            transformations.push(`g_${gravity}`);
        }
    }

    // Add DPR (Device Pixel Ratio) auto
    transformations.push('dpr_auto');

    // Parse the URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
        console.warn('Invalid Cloudinary URL structure:', url);
        return url; // Invalid Cloudinary URL structure
    }

    // Check if transformations already exist
    const [baseUrl, pathAfterUpload] = urlParts;
    const transformationString = transformations.join(',');

    // If there are existing transformations, we'll replace them
    // Otherwise, add new transformations
    const existingTransformMatch = pathAfterUpload.match(/^([^/]+)\//);
    if (existingTransformMatch && existingTransformMatch[1].includes('_')) {
        // Has existing transformations, replace them
        const pathWithoutTransform = pathAfterUpload.replace(/^[^/]+\//, '');
        return `${baseUrl}/upload/${transformationString}/${pathWithoutTransform}`;
    } else {
        // No existing transformations, add them
        return `${baseUrl}/upload/${transformationString}/${pathAfterUpload}`;
    }
}

/**
 * Preset configurations for common use cases
 */
export const cloudinaryPresets = {
    thumbnail: {
        width: 150,
        height: 150,
        quality: 60,
        crop: 'fill' as const,
        gravity: 'auto' as const,
    },
    cardImage: {
        width: 800,
        height: 600,
        quality: 85,
        crop: 'fill' as const,
        gravity: 'auto' as const,
    },
    galleryMain: {
        width: 1200,
        quality: 90,
        crop: 'limit' as const,
    },
    hero: {
        width: 2000,
        quality: 85,
        crop: 'fill' as const,
    },
    fullscreen: {
        width: 2400,
        quality: 95,
        crop: 'limit' as const,
    },
} as const;

/**
 * Helper to optimize an array of Cloudinary URLs
 */
export function optimizeCloudinaryUrls(
    urls: string[],
    options: CloudinaryOptions = {}
): string[] {
    return urls.map((url) => optimizeCloudinaryUrl(url, options));
}
