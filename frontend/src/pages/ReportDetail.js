"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { AlertTriangle, Check, X, Download, Share, Edit, Trash2, Eye, EyeOff, Tag } from "react-feather"
import { toast } from "react-toastify"
import api from "../services/api"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const ReportDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${id}`)
        setReport(response.data.data.report)
      } catch (err) {
        console.error("Error fetching report:", err)
        setError("Failed to load report data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

  const handleExportPDF = async () => {
    try {
      const response = await api.get(`/export/predictions/pdf?id=${report.prediction._id}`, {
        responseType: "blob",
      })

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `report-${report._id}.pdf`)
      document.body.appendChild(link)
      link.click()

      // Clean up
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully")
    } catch (err) {
      console.error("Error exporting PDF:", err)
      toast.error("Failed to download PDF. Please try again.")
    }
  }

  const handleShare = () => {
    // Copy link to clipboard
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"))
  }

  const togglePublicStatus = async () => {
    try {
      const response = await api.patch(`/reports/${id}`, {
        isPublic: !report.isPublic,
      })

      setReport(response.data.data.report)
      toast.success(`Report is now ${response.data.data.report.isPublic ? "public" : "private"}`)
    } catch (err) {
      console.error("Error updating report visibility:", err)
      toast.error("Failed to update report visibility")
    }
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/reports/${id}`)
      toast.success("Report deleted successfully")
      navigate("/reports")
    } catch (err) {
      console.error("Error deleting report:", err)
      toast.error("Failed to delete report")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const getResultColor = (prediction) => {
    switch (prediction) {
      case "diabetic":
        return "#EF4444" // red-500
      case "non-diabetic":
        return "#10B981" // green-500
      case "pre-diabetic":
        return "#F59E0B" // amber-500
      default:
        return "#6B7280" // gray-500
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return "#10B981" // green-500
      case "moderate":
        return "#F59E0B" // amber-500
      case "high":
        return "#F97316" // orange-500
      case "very high":
        return "#EF4444" // red-500
      default:
        return "#6B7280" // gray-500
    }
  }

  const getResultIcon = (prediction) => {
    switch (prediction) {
      case "diabetic":
        return <X className="h-6 w-6 text-white" />
      case "non-diabetic":
        return <Check className="h-6 w-6 text-white" />
      case "pre-diabetic":
        return <AlertTriangle className="h-6 w-6 text-white" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Error Loading Report</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error || "Failed to load report data."}</p>
            <Link
              to="/reports"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Reports
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const prediction = report.prediction

  // Prepare chart data
  const probabilityData = [
    { name: prediction.result.prediction, value: prediction.result.probability },
    { name: "Other", value: 1 - prediction.result.probability },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Report header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{report.title}</h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-4">Created: {new Date(report.createdAt).toLocaleString()}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${report.isPublic ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {report.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </button>
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => document.getElementById("dropdown-menu").classList.toggle("hidden")}
                  >
                    More
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  id="dropdown-menu"
                  className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <Link
                      to={`/reports/edit/${report._id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <Edit className="mr-3 h-4 w-4" />
                      Edit Report
                    </Link>
                    <button
                      onClick={togglePublicStatus}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      {report.isPublic ? (
                        <>
                          <EyeOff className="mr-3 h-4 w-4" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Eye className="mr-3 h-4 w-4" />
                          Make Public
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <Trash2 className="mr-3 h-4 w-4" />
                      Delete Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {report.description && (
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">{report.description}</p>
            </div>
          )}

          {report.tags && report.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {report.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prediction result */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <div
                className={`flex items-center justify-center h-16 w-16 rounded-full mb-3`}
                style={{ backgroundColor: getResultColor(prediction.result.prediction) }}
              >
                {getResultIcon(prediction.result.prediction)}
              </div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-1 capitalize">
                {prediction.result.prediction}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prediction Result</p>
            </div>

            {/* Probability */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <div className="h-16 w-16 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={probabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={15}
                      outerRadius={30}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell key={`cell-0`} fill={getResultColor(prediction.result.prediction)} />
                      <Cell key={`cell-1`} fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                {Math.round(prediction.result.probability * 100)}%
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Probability</p>
            </div>

            {/* Risk level */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <div
                className={`flex items-center justify-center h-16 w-16 rounded-full mb-3`}
                style={{ backgroundColor: getRiskColor(prediction.result.riskLevel) }}
              >
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-1 capitalize">
                {prediction.result.riskLevel} Risk
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
            </div>
          </div>

          {/* Date and disclaimer */}
          <div className="mt-6 flex flex-col md:flex-row md:justify-between text-sm text-gray-500 dark:text-gray-400">
            <p>Prediction date: {new Date(prediction.createdAt).toLocaleString()}</p>
            <p>Report saved: {new Date(report.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Patient Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Patient Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Demographics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Age:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{prediction.patientData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {prediction.patientData.gender}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">BMI:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{prediction.patientData.bmi} kg/m²</span>
                </div>
                {prediction.patientData.gender === "female" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pregnancies:</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {prediction.patientData.pregnancies}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Vital Signs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Blood Pressure:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {prediction.patientData.bloodPressure.systolic}/{prediction.patientData.bloodPressure.diastolic}{" "}
                    mmHg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Glucose Level:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {prediction.patientData.glucoseLevel} mg/dL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Insulin Level:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {prediction.patientData.insulinLevel} µU/mL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Skin Thickness:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {prediction.patientData.skinThickness} mm
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Lifestyle Factors</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Physical Activity:</span>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {prediction.patientData.physicalActivity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Smoking Status:</span>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {prediction.patientData.smokingStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Alcohol Consumption:</span>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {prediction.patientData.alcoholConsumption}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Family History of Diabetes:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {prediction.patientData.familyHistory ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Other Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Diabetes Pedigree Function:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {prediction.patientData.diabetesPedigreeFunction}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/reports"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            Back to Reports
          </Link>

          <Link
            to={`/reports/edit/${report._id}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Report
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Report</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this report? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportDetail
