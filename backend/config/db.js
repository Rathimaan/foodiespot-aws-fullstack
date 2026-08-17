import mongoose from "mongoose";
import dns from "dns";

// Fix for querySrv ECONNREFUSED on Wi-Fi / ISP DNS blocking SRV lookup
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore if not supported
}

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/foodiespot";
    await mongoose.connect(mongoUrl);
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
