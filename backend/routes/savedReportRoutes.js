import express from "express"
import {
  saveReport,
  getUserReports,
  getReport,
  updateReport,
  deleteReport,
  getPublicReports,
  getRecentReports,
} from "../controllers/savedReportController.js"
import { protect } from "../controllers/authController.js"

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes for all authenticated users
router.post("/", saveReport)
router.get("/my-reports", getUserReports)
router.get("/recent", getRecentReports); // e.g. /api/reports/recent
router.get("/public", getPublicReports)
router.get("/:id", getReport);
router.patch("/:id", updateReport)
router.delete("/:id", deleteReport)


export default router
