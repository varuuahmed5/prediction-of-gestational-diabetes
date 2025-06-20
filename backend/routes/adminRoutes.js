import express from "express"
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  sendNotification,
  getAllDoctors
} from "../controllers/adminController.js"
import { getAllPredictions, getPredictionStats } from "../controllers/predictionController.js"
import { getAllAppointments } from "../controllers/appointmentController.js"
import { protect, restrictTo } from "../controllers/authController.js"
import Prediction from "../models/predictionModel.js"

const router = express.Router()
router.get("/predictions", async (req, res) => {
  try {
    const predictions = await Prediction.find().limit(50) // Optional: add filters, pagination etc
    res.status(200).json({
      status: "success",
      results: predictions.length,
      data: predictions,
    })
  } catch (err) {
    console.error("Prediction fetch error:", err)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch predictions",
    })
  }
})



// Protect all routes and restrict to admin only
router.use(protect)
router.use(restrictTo("admin", "doctor", "patient"))


// Dashboard routes
router.get("/dashboard", getDashboardStats)

// User management routes
router.route("/users").get(getAllUsers).post(createUser)
router.get("/users", getAllUsers)
// inside adminRoutes.js
router.get("/users", protect, restrictTo("admin"), getAllUsers)

router.route("/users/:id").get(getUser).patch(updateUser).delete(deleteUser)
router.get('/auth/me', protect, (req, res) => {
  console.log("🔐 Auth route hit")
  res.status(200).json({ user: req.user })
})

// Prediction management routes
router.get("/predictions", getAllPredictions)
router.get("/predictions/stats", getPredictionStats)

// Appointment management routes
router.get("/appointments", getAllAppointments)







// Notification routes
router.post("/notifications", sendNotification)

export default router
