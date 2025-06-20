import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import hpp from "hpp"
import cookieParser from "cookie-parser"
import compression from "compression"
import mongoose from "mongoose"
import { config } from "./config/env.js"
import { connectDB } from "./config/database.js"
import { errorHandler } from "./middleware/errorMiddleware.js"
import authRoutes from "./routes/authRoutes.js"
import predictionRoutes from "./routes/predictionRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import exportRoutes from "./routes/exportRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import savedReportRoutes from "./routes/savedReportRoutes.js"
import mlRoutes from "./routes/mlRoutes.js"




const app = express()

// Connect to MongoDB with error handling
;(async () => {
  try {
    await connectDB()
    console.log("✅ MongoDB connected successfully")
  } catch (err) {
    console.error("❌ Database connection error:", err.message)
    process.exit(1)
  }
})()

app.use("/api/ml", mlRoutes) // URL: /api/ml/predict

// Enhanced CORS with more debugging
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [config.CORS_ORIGIN || "http://localhost:3000", "http://localhost:3001"]
      console.log(`CORS request from origin: ${origin}`)

      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.error(`CORS blocked for origin: ${origin}`)
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

origin: (origin, callback) => {
  const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"]

  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true) // ✅ allow origin-less requests
  } else {
    callback(new Error("Not allowed by CORS"))
  }
}


// Add a simple test route at the root
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Diabetes Prediction API is running!",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  })
})

// Security middleware
app.use(helmet())

// Development logging
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  // Add some logging even in production
  app.use(morgan("combined"))
}

// Increase JSON payload limit
app.use(express.json({ limit: "50kb" }))
app.use(express.urlencoded({ extended: true, limit: "50kb" }))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp({ whitelist: ["duration", "ratings"] }))

// Rate limiting - make it more lenient for development
const limiter = rateLimit({
  max: config.NODE_ENV === "production" ? 100 : 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api", limiter)

// Compression
app.use(
  compression({
    filter: (req, res) => !req.headers["x-no-compression"],
  }),
)

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/predictions", predictionRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/export", exportRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/reports", savedReportRoutes)


// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    environment: config.NODE_ENV,
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
})

// Error handling
app.all("*", (req, res, next) => {
  console.log(`Route not found: ${req.originalUrl}`)
  const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  err.status = "fail"
  err.statusCode = 404
  next(err)
})

app.use(errorHandler)

// Server - Make sure PORT variable matches config.PORT
const PORT = config.PORT || 5002
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${config.NODE_ENV} mode
  🔗 Access it at ${config.CORS_ORIGIN || "http://localhost:3000"}
  📍 Listening on port ${PORT}
  `)
})

// Process handlers
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...")
  console.error(err.name, err.message, err.stack)
  server.close(() => {
    process.exit(1)
  })
})

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...")
  console.error(err.name, err.message, err.stack)
  process.exit(1)
})

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully")
  server.close(() => {
    console.log("💥 Process terminated!")
  })
})

process.on("SIGINT", () => {
  console.log("👋 SIGINT RECEIVED. Shutting down gracefully")
  server.close(() => {
    console.log("💥 Process terminated!")
  })
})

export default app
