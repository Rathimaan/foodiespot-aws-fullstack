import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import awsRouter from "./routes/awsRoute.js";
import { isS3Configured } from "./config/s3.js";
import 'dotenv/config';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/aws", awsRouter);

app.get("/", (req, res) => {
    res.json({
        name: "FoodieSpot API Service",
        status: "Online",
        awsS3Storage: isS3Configured() ? "Enabled (AWS S3)" : "Local Storage Mode",
        endpoints: {
            food: "/api/food",
            user: "/api/user",
            cart: "/api/cart",
            order: "/api/order",
            awsStatus: "/api/aws/status"
        }
    });
});

app.listen(port, () => {
    console.log(`====================================================`);
    console.log(`🚀 FoodieSpot Backend API running on port ${port}`);
    console.log(`☁️  AWS S3 Image Storage: ${isS3Configured() ? "ACTIVATED (S3 Bucket Connected)" : "LOCAL FALLBACK MODE"}`);
    console.log(`====================================================`);
});