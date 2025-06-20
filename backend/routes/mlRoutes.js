// routes/mlRoutes.js
import express from "express"
import axios from "axios"

const router = express.Router()

// POST /api/ml-predict
router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/predict", req.body)
    res.status(200).json(response.data)
  } catch (error) {
    console.error("ML Prediction error:", error.message)
    res.status(500).json({ error: "Failed to connect to ML service" })
  }
})

export default router
