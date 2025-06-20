import express from "express"
import {
  exportPredictionAsPDF,
  exportPredictionsAsExcel,
  exportAppointmentsAsExcel,
} from "../controllers/exportController.js"
import { protect, restrictTo } from "../controllers/authController.js"

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes for all authenticated users
router.get("/predictions/pdf", exportPredictionAsPDF)

// Routes for admin only
router.get("/predictions/excel", restrictTo("admin", "doctor"), exportPredictionsAsExcel)
router.get("/appointments/excel", restrictTo("admin", "doctor"), exportAppointmentsAsExcel)

export default router
