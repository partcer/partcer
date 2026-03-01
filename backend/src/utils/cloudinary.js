import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import path from 'path';

// Configure Cloudinary
export const configureCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log('Cloudinary configured successfully');
    } catch (error) {
        console.error('Cloudinary configuration failed:', error);
        throw new Error('Cloudinary configuration failed');
    }
};

// ============= IMAGE UPLOAD FUNCTIONS =============

// Upload single image
export const uploadImage = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const originalNameWithoutExt = path.parse(originalName).name;
        const publicId = `${originalNameWithoutExt}-${Date.now()}`;

        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                public_id: publicId,
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Image upload failed:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Upload multiple images
export const uploadMultipleImages = async (files) => {
    try {
        const uploadPromises = files.map(file => 
            uploadImage(file.buffer, file.originalname)
        );
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('❌ Multiple images upload failed:', error);
        throw error;
    }
};

// ============= DOCUMENT UPLOAD FUNCTIONS =============

// Upload single document (PDF, DOC, ZIP, etc.)
export const uploadDocument = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const originalNameWithoutExt = path.parse(originalName).name;
        const extension = path.parse(originalName).ext;
        const publicId = `${originalNameWithoutExt}-${Date.now()}${extension}`;

        const uploadOptions = {
            public_id: publicId,
            resource_type: 'raw',
        };

        // Special handling for PDFs if needed
        const isPDF = originalName.toLowerCase().endsWith('.pdf');
        if (isPDF) {
            // PDF-specific options can go here
            console.log('Uploading PDF document');
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('❌ Document upload failed:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Upload multiple documents
export const uploadMultipleDocuments = async (files) => {
    try {
        const uploadPromises = files.map(file => 
            uploadDocument(file.buffer, file.originalname)
        );
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('❌ Multiple documents upload failed:', error);
        throw error;
    }
};

// ============= AUTO-DETECT UPLOAD FUNCTION =============

// Upload any file (auto-detects image vs document)
export const uploadFile = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const fileExtension = path.extname(originalName).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].includes(fileExtension);
        
        const originalNameWithoutExt = path.parse(originalName).name;
        const publicId = isImage 
            ? `${originalNameWithoutExt}-${Date.now()}`
            : `${originalNameWithoutExt}-${Date.now()}${fileExtension}`;

        const uploadOptions = {
            public_id: publicId,
            resource_type: isImage ? 'image' : 'raw',
            ...(isImage ? { quality: 'auto', fetch_format: 'auto' } : {})
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('❌ File upload failed:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Upload multiple files (mixed types)
export const uploadMultipleFiles = async (files) => {
    try {
        const uploadPromises = files.map(file => 
            uploadFile(file.buffer, file.originalname)
        );
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('❌ Multiple files upload failed:', error);
        throw error;
    }
};

// ============= DELETE FUNCTIONS =============

// Delete single file by public ID
export const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        
        if (result.result === 'ok') {
            console.log(`✅ File deleted successfully: ${publicId}`);
        } else {
            console.log(`⚠️ File not found or already deleted: ${publicId}`);
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error deleting file:', error);
        throw error;
    }
};

// Delete multiple files
export const deleteMultipleFiles = async (files) => {
    try {
        const deletePromises = files.map(file => 
            deleteFile(file.publicId, file.resourceType)
        );
        const results = await Promise.all(deletePromises);
        return results;
    } catch (error) {
        console.error('❌ Error deleting multiple files:', error);
        throw error;
    }
};

// Delete file by URL (extracts public ID from URL)
export const deleteFileByUrl = async (url) => {
    try {
        // Extract public ID from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567/public-id.jpg
        const urlParts = url.split('/');
        const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
        const publicIdWithExtension = urlParts[versionIndex + 1];
        const publicId = publicIdWithExtension.split('.')[0];
        
        // Determine resource type from URL
        const resourceType = url.includes('/image/') ? 'image' : 'raw';
        
        const result = await deleteFile(publicId, resourceType);
        return result;
    } catch (error) {
        console.error('❌ Error deleting file by URL:', error);
        throw error;
    }
};

// ============= UTILITY FUNCTIONS =============

// Get file info by public ID
export const getFileInfo = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.api.resource(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error('❌ Error getting file info:', error);
        throw error;
    }
};

// Generate optimized URL for images
export const getOptimizedImageUrl = (publicId, options = {}) => {
    const { width, height, crop = 'fill', quality = 'auto' } = options;
    
    const transformation = [];
    if (width) transformation.push({ width });
    if (height) transformation.push({ height });
    if (crop) transformation.push({ crop });
    transformation.push({ quality, fetch_format: 'auto' });
    
    return cloudinary.url(publicId, {
        transformation
    });
};

// Check if file exists
export const fileExists = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.api.resource(publicId, { resource_type: resourceType });
        return true;
    } catch (error) {
        if (error.http_code === 404) {
            return false;
        }
        throw error;
    }
};