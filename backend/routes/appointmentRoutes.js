import express from "express"
import {
  createAppointment,
  getUserAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAvailableTimeSlots,
} from "../controllers/appointmentController.js"
import { protect, restrictTo } from "../controllers/authController.js"

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes for all authenticated users
router.post("/", createAppointment)
router.get("/my-appointments", getUserAppointments)
router.get("/available-slots", getAvailableTimeSlots)
router.get("/:id", getAppointment)
router.patch("/:id", updateAppointment)
router.delete("/:id", deleteAppointment)

// Routes for admin and doctor only
router.get("/", restrictTo("admin", "doctor"), getAllAppointments)
router.post("/", protect, restrictTo("admin", "doctor", "patient"), createAppointment)


export default router