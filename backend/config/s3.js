import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

dotenv.config();

const region = process.env.AWS_REGION || "us-east-1";
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Check if AWS S3 credentials are functional
export const isS3Configured = () => {
    return Boolean(accessKeyId && secretAccessKey && bucketName);
};

let s3Client = null;

if (isS3Configured()) {
    s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
}

/**
 * Uploads a file buffer directly to AWS S3 Bucket
 * @param {Buffer} fileBuffer 
 * @param {string} originalName 
 * @param {string} mimeType 
 * @returns {Promise<{url: string, key: string}>}
 */
export const uploadToS3 = async (fileBuffer, originalName, mimeType) => {
    if (!isS3Configured()) {
        throw new Error("AWS S3 credentials not configured in environment.");
    }

    const fileExtension = path.extname(originalName);
    const uniqueFileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${fileExtension}`;
    const s3Key = `food-images/${uniqueFileName}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: mimeType,
        // Public read access if S3 bucket policy permits
        ACL: "public-read"
    });

    await s3Client.send(command);

    // Return direct AWS S3 URL
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    return {
        url: s3Url,
        key: s3Key,
        filename: s3Key
    };
};

/**
 * Deletes a file object from AWS S3 Bucket
 * @param {string} imagePathOrUrl 
 */
export const deleteFromS3 = async (imagePathOrUrl) => {
    if (!isS3Configured() || !imagePathOrUrl) return;

    try {
        let key = imagePathOrUrl;
        if (imagePathOrUrl.startsWith("http://") || imagePathOrUrl.startsWith("https://")) {
            const urlObj = new URL(imagePathOrUrl);
            key = urlObj.pathname.substring(1); // remove leading slash
        }

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        });

        await s3Client.send(command);
        console.log(`Successfully deleted S3 object: ${key}`);
    } catch (error) {
        console.error("Error deleting file from AWS S3:", error.message);
    }
};

export { s3Client, bucketName, region };
