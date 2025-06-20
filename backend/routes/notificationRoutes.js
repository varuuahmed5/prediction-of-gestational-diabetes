import express from "express"
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getUnreadCount,
} from "../controllers/notificationController.js"
import { protect } from "../controllers/authController.js"

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes for all authenticated users
router.get("/", getUserNotifications)
router.get("/unread-count", getUnreadCount)
router.patch("/mark-all-read", markAllAsRead)
router.delete("/read", deleteAllRead)
router.patch("/:id/mark-read", markAsRead)
router.delete("/:id", deleteNotification)

export default router
