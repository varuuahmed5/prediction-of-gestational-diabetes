import express from "express"
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  getMe,
  updateMe,
  deleteMe,
  verifyEmail,
} from "../controllers/authController.js"

const router = express.Router()

// Add a simple test route
router.get("/test", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Auth routes are working!",
    timestamp: new Date().toISOString(),
  })
})

// Public routes
router.post("/register", signup)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.patch("/reset-password/:token", resetPassword)
router.get("/verify-email/:token", verifyEmail)

// Protected routes
router.use(protect)

router.get("/me", getMe)
router.patch("/update-profile", updateMe)
router.delete("/delete-account", deleteMe)
router.patch("/change-password", updatePassword)

// Admin only routes
router.use(restrictTo("admin"))

export default router
