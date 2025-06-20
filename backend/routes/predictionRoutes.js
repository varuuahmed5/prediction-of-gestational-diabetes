import express from "express"
import {
  createPrediction,
  getUserPredictions,
  getPrediction,
  updatePrediction,
  deletePrediction,
} from "../controllers/predictionController.js"
import { protect, restrictTo } from "../controllers/authController.js"

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes for all authenticated users
router.post("/", createPrediction)
router.get("/my-predictions", getUserPredictions)
router.get("/:id", getPrediction)
router.delete("/:id", deletePrediction)

// Routes for admin and doctor only
router.patch("/:id", restrictTo("admin", "doctor"), updatePrediction)

export default router
