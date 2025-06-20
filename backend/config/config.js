import dotenv from "dotenv";

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI, // No fallback - we want it to fail explicitly if missing
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000"
};