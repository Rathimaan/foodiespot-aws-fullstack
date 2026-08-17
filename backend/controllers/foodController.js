import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { isS3Configured, uploadToS3, deleteFromS3 } from "../config/s3.js";

// Add food item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        let imageIdentifier = "";

        if (isS3Configured()) {
            // Upload directly to AWS S3 Bucket
            const s3Result = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
            // Store S3 URL or S3 key
            imageIdentifier = s3Result.url;
            console.log(`[AWS S3] Image uploaded successfully: ${imageIdentifier}`);
        } else {
            // Local fallback storage
            const uploadsDir = path.join(process.cwd(), "uploads");
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const localFilename = `${Date.now()}-${req.file.originalname}`;
            const filePath = path.join(uploadsDir, localFilename);
            fs.writeFileSync(filePath, req.file.buffer);
            imageIdentifier = localFilename;
            console.log(`[Local Storage Fallback] Image saved locally: ${imageIdentifier}`);
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: imageIdentifier
        });

        await food.save();
        res.json({
            success: true,
            message: "Food Added Successfully",
            storage: isS3Configured() ? "AWS S3" : "Local Disk Storage"
        });
    } catch (error) {
        console.error("Error in addFood:", error);
        res.status(500).json({ success: false, message: error.message || "Error adding food" });
    }
};

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Error in listFood:", error);
        res.status(500).json({ success: false, message: "Error fetching food list" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        if (food.image.startsWith("http://") || food.image.startsWith("https://")) {
            // Delete from AWS S3
            await deleteFromS3(food.image);
            console.log(`[AWS S3] Cleaned up S3 image: ${food.image}`);
        } else {
            // Delete from local disk
            const localPath = path.join(process.cwd(), "uploads", food.image);
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
            }
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed Successfully" });
    } catch (error) {
        console.error("Error in removeFood:", error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};

export { addFood, listFood, removeFood };