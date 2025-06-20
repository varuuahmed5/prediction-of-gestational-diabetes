"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { predictionAPI } from "../services/api"
import { toast } from "react-toastify"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const PredictionResult = () => {
  const { id } = useParams()
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true)
        const response = await predictionAPI.getPrediction(id)
        setPrediction(response.data.data.prediction)
      } catch (err) {
        console.error("Error fetching prediction:", err)
        setError(err.response?.data?.message || "Failed to fetch prediction results")
        toast.error(err.response?.data?.message || "Failed to fetch prediction results")
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Prediction not found</h2>
        <p className="mt-2 text-gray-600">The prediction you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/prediction/new"
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Prediction
        </Link>
      </div>
    )
  }

  // Prepare chart data
  const chartData = {
    labels: ["Diabetes Risk", "No Diabetes Risk"],
    datasets: [
      {
        data: [prediction.result.probability * 100, (1 - prediction.result.probability) * 100],
        backgroundColor: ["#EF4444", "#10B981"],
        borderColor: ["#B91C1C", "#047857"],
        borderWidth: 1,
      },
    ],
  }

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Determine risk level and color
  const getRiskLevel = (probability) => {
    if (probability >= 0.7) return { level: "High", color: "text-red-600" }
    if (probability >= 0.4) return { level: "Moderate", color: "text-yellow-600" }
    return { level: "Low", color: "text-green-600" }
  }

  const risk = getRiskLevel(prediction.result.probability)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Prediction Results</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Result Header */}
        <div
          className={`p-6 ${
            prediction.result.diabetic ? "bg-red-100 border-b border-red-200" : "bg-green-100 border-b border-green-200"
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">
            {prediction.result.diabetic ? "Positive Diabetes Prediction" : "Negative Diabetes Prediction"}
          </h2>
          <p className="text-gray-700">Prediction made on {formatDate(prediction.createdAt)}</p>
        </div>

        <div className="p-6">
          {/* Result Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Result Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Prediction:</span>{" "}
                  {prediction.result.diabetic ? "Diabetic" : "Non-Diabetic"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Probability:</span> {(prediction.result.probability * 100).toFixed(2)}%
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Risk Level:</span> <span className={risk.color}>{risk.level}</span>
                </p>
              </div>
              <div className="max-w-xs mx-auto">
                <Pie data={chartData} />
              </div>
            </div>
          </div>

          {/* Input Parameters */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Input Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Pregnancies</p>
                <p className="text-lg font-medium">{prediction.pregnancies}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Glucose (mg/dL)</p>
                <p className="text-lg font-medium">{prediction.glucose}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Blood Pressure (mm Hg)</p>
                <p className="text-lg font-medium">{prediction.bloodPressure}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Skin Thickness (mm)</p>
                <p className="text-lg font-medium">{prediction.skinThickness}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Insulin (μU/ml)</p>
                <p className="text-lg font-medium">{prediction.insulin}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">BMI (kg/m²)</p>
                <p className="text-lg font-medium">{prediction.bmi}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Diabetes Pedigree Function</p>
                <p className="text-lg font-medium">{prediction.diabetesPedigreeFunction}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Age (years)</p>
                <p className="text-lg font-medium">{prediction.age}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-2">
                {prediction.result.diabetic ? (
                  <>
                    <li>Schedule an appointment with a healthcare provider to discuss your diabetes risk.</li>
                    <li>Consider regular blood glucose monitoring.</li>
                    <li>Maintain a healthy diet low in refined sugars and carbohydrates.</li>
                    <li>Engage in regular physical activity (at least 150 minutes per week).</li>
                    <li>Maintain a healthy weight or work towards weight loss if needed.</li>
                  </>
                ) : (
                  <>
                    <li>Continue maintaining a healthy lifestyle with regular exercise.</li>
                    <li>Follow a balanced diet rich in fruits, vegetables, and whole grains.</li>
                    <li>Consider annual check-ups to monitor your health status.</li>
                    <li>Stay hydrated and limit alcohol consumption.</li>
                    <li>Manage stress through relaxation techniques or mindfulness practices.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Link to="/prediction/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              New Prediction
            </Link>
            <Link
              to="/prediction/history"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              View History
            </Link>
            {prediction.result.diabetic && (
              <Link
                to="/appointment/new"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Schedule Appointment
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionResult
