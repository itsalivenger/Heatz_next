import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload images to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // Return the URL of the uploaded image
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

async function deleteFromCloudinary(imageUrl, folder = 'products') {
    try {
        // Extract the public ID (folder and filename without extension)
        const publicId = folder + '/' + imageUrl.split('/').pop().split('.')[0];
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: ${imageUrl}`);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error; // Re-throw to handle in the calling code
    }
}


module.exports = {uploadToCloudinary, deleteFromCloudinary};