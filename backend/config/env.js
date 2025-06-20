import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Get current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") })

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: 5001, // HARDCODED to 5001, ignoring process.env.PORT
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://varuu:1234@cluster0.e02tdrj.mongodb.net/diabetes_prediction?retryWrites=true&w=majority",
  JWT_SECRET: process.env.JWT_SECRET || "your_very_secure_secret_key_at_least_32_chars",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 30,
  API_KEY: process.env.API_KEY || "freeha123secure",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  ML_API_URL: process.env.ML_API_URL || "http://localhost:8000",
}

// Debug output
console.log("Environment config loaded:")
console.log("- NODE_ENV:", config.NODE_ENV)
console.log("- PORT:", config.PORT)
console.log("- MONGO_URI:", config.MONGO_URI ? "***loaded***" : "⚠️ NOT loaded")
console.log("- CORS_ORIGIN:", config.CORS_ORIGIN)
