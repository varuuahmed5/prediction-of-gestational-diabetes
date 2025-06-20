import mongoose from "mongoose"
import { config } from "./env.js"
import SavedReport from "../models/savedReportModel.js"
import Prediction from "../models/predictionModel.js"  // Haddii aad rabto inaad hubiso prediction ID

export const seedTestReport = async () => {
  const reportExists = await SavedReport.findOne({ title: "Test Report" })
  if (reportExists) {
    console.log("🚫 Test report already exists. Skipping insert.")
    return
  }

  const testReport = {
    _id: new mongoose.Types.ObjectId("683bf8bd54a00db89e69c3c2"),
    user: new mongoose.Types.ObjectId("682980729c56b3a23b884a1a"),
    prediction: new mongoose.Types.ObjectId("683b51fc36e45c5103130580"),
    title: "Test Report",
    description: "Seeded test report",
    tags: ["manual"],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  try {
    await SavedReport.create(testReport)
    console.log("✅ Seeded test report into database.")
  } catch (error) {
    console.error("❌ Failed to insert test report:", error.message)
  }
}




export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...")
    console.log(`MongoDB URI: ${config.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")}`) // Hide credentials in logs

    const conn = await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    await seedTestReport()
    return conn
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    console.error(error.stack)
    throw error
  }
}


// Add a function to check database connection
export const checkDBConnection = async () => {
  try {
    const state = mongoose.connection.readyState
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    return {
      status: states[state] || "unknown",
      connected: state === 1,
      host: mongoose.connection.host || "none",
    }
  } catch (error) {
    console.error(`Error checking database connection: ${error.message}`)
    return {
      status: "error",
      connected: false,
      error: error.message,
    }
  }
}
