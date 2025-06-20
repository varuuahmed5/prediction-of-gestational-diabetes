"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { AlertTriangle, RefreshCw, ArrowLeft } from "react-feather"

const ReportDetail = () => {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fixing, setFixing] = useState(false)

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5001/api/reports/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setReport(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fixReport = async () => {
    try {
      setFixing(true)
      const response = await fetch(`http://localhost:5001/api/reports/${id}/fix`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to fix report")
      }

      const data = await response.json()
      setReport(data.report)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setFixing(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Report</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={fetchReport}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/reports"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Go Back to Reports
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Check if prediction is missing
  const hasBrokenPrediction = !report?.prediction || !report?._hasValidPrediction

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/reports" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go back to Reports
        </Link>
      </div>

      {/* Broken Prediction Warning */}
      {hasBrokenPrediction && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Prediction not found</h3>
                <p className="text-yellow-700">This report may be broken or the prediction it refers to was deleted.</p>
              </div>
            </div>
            <button
              onClick={fixReport}
              disabled={fixing}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center"
            >
              {fixing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fix Report
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Report Content */}
      {report && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
            <p className="text-gray-600 mt-1">{report.description}</p>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Report Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">User:</span> {report.user?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {report.type}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {report.status}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span> {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Prediction Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Prediction Details</h3>
                {report.prediction ? (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Result:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          report.prediction.result?.prediction === "diabetic"
                            ? "bg-red-100 text-red-800"
                            : report.prediction.result?.prediction === "non-diabetic"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.prediction.result?.prediction || "Unknown"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Confidence:</span>{" "}
                      {((report.prediction.result?.confidence || 0) * 100).toFixed(1)}%
                    </p>
                    <p>
                      <span className="font-medium">Risk Level:</span> {report.prediction.result?.riskLevel}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Prediction data not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportDetail
