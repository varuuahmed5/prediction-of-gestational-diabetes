import axios from "axios"
import { config } from "../../config/env.js"

export const makePrediction = async (patientData) => {
  try {
    // Make request to ML API
    const response = await axios.post(config.ML_API_URL, {
      patientData,
    })

    // Return prediction result
    return {
      prediction: response.data.prediction,
      probability: response.data.probability,
    }
  } catch (error) {
    console.error("Error making prediction:", error)

    // For development/testing purposes, return a mock prediction
    // In production, this should be removed and proper error handling implemented
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock prediction data for development")
      return mockPrediction(patientData)
    }

    return null
  }
}

// Mock prediction function for development/testing
const mockPrediction = (patientData) => {
  // Calculate a simple probability based on some risk factors
  let probability = 0.3 // Base probability

  // Age factor (older = higher risk)
  if (patientData.age > 40) {
    probability += 0.1
  }
  if (patientData.age > 60) {
    probability += 0.1
  }

  // BMI factor
  if (patientData.bmi > 25) {
    probability += 0.1
  }
  if (patientData.bmi > 30) {
    probability += 0.1
  }

  // Glucose level factor
  if (patientData.glucoseLevel > 100) {
    probability += 0.1
  }
  if (patientData.glucoseLevel > 125) {
    probability += 0.2
  }

  // Family history factor
  if (patientData.familyHistory) {
    probability += 0.1
  }

  // Cap probability at 0.95
  probability = Math.min(probability, 0.95)

  // Determine prediction based on probability
  let prediction
  if (probability < 0.4) {
    prediction = "non-diabetic"
  } else if (probability < 0.7) {
    prediction = "pre-diabetic"
  } else {
    prediction = "diabetic"
  }

  return {
    prediction,
    probability,
  }
}
