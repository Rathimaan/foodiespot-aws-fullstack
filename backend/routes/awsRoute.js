import express from "express";
import { isS3Configured, bucketName, region } from "../config/s3.js";

const awsRouter = express.Router();

// GET /api/aws/status - Check AWS Service & S3 Connectivity Status
awsRouter.get("/status", (req, res) => {
    const configured = isS3Configured();
    res.json({
        success: true,
        aws: {
            service: "AWS S3 Image Storage Service",
            configured: configured,
            mode: configured ? "AWS S3 Cloud Mode" : "Local Storage Fallback Mode",
            region: region || "us-east-1",
            bucketName: bucketName || "Not configured (set AWS_S3_BUCKET_NAME in .env)",
            features: [
                "AWS S3 Direct Multipart Uploads",
                "Automatic Image Clean-up on Delete",
                "Least-Privilege IAM Policy Integration",
                "AWS EC2 Deployment Support",
                "AWS EBS Persistent Logs Support"
            ]
        }
    });
});

export default awsRouter;
