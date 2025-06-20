"use client"

import { useState, useEffect } from "react"
import api from "../../services/api" // Fixed import path
import { toast } from "react-toastify"
import { FileText, Download, Trash2, RefreshCw, AlertCircle } from "react-feather"

const ReportGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState("predictions")
  const [dateRange, setDateRange] = useState("last30days")
  const [format, setFormat] = useState("csv")
  const [generatedReports, setGeneratedReports] = useState([])
  const [error, setError] = useState(null)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    fetchGeneratedReports()
  }, [])

  const fetchGeneratedReports = async () => {
    try {
      setError(null)
      setRetrying(true)

      console.log("🔄 Fetching reports...")

      const response = await api.get("/admin/reports", {
        params: { limit: 20 },
      })

      if (response.data.success) {
        setGeneratedReports(response.data.data || [])
        console.log("✅ Reports fetched successfully")
      } else {
        throw new Error(response.data.message || "Failed to fetch reports")
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error)
      setError(error)

      if (error.type === "TIMEOUT_ERROR") {
        toast.error("Server is taking too long to respond. Please try again.")
      } else if (error.type === "NETWORK_ERROR") {
        toast.error("Network connection error. Please check your internet.")
      } else {
        toast.error("Failed to load reports. Please try again.")
      }
    } finally {
      setRetrying(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.post("/admin/reports/generate", {
        reportType,
        format,
        dateRange,
      })

      if (response.data.success) {
        toast.success("Report generated successfully")
        fetchGeneratedReports()
      } else {
        throw new Error(response.data.message || "Failed to generate report")
      }
    } catch (error) {
      console.error("❌ Error generating report:", error)

      if (error.type === "TIMEOUT_ERROR") {
        toast.error("Report generation is taking longer than expected. Please try again.")
      } else {
        toast.error("Failed to generate report. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const retryConnection = () => {
    fetchGeneratedReports()
  }

  if (error && error.type === "TIMEOUT_ERROR") {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Connection Timeout</h3>
          <p className="text-yellow-700 mb-4">The server is taking too long to respond. This might be due to:</p>
          <ul className="text-sm text-yellow-600 mb-4 text-left">
            <li>• Heavy database operations</li>
            <li>• Server maintenance</li>
            <li>• Network connectivity issues</li>
          </ul>
          <button
            onClick={retryConnection}
            disabled={retrying}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center mx-auto"
          >
            {retrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-600" />
          Report Generator
        </h1>
        <button
          onClick={fetchGeneratedReports}
          disabled={retrying}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 flex items-center"
        >
          {retrying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Report Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="predictions">Predictions Report</option>
                <option value="appointments">Appointments Report</option>
                <option value="users">Users Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Reports List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>

          {generatedReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports generated yet</p>
              <p className="text-sm text-gray-400">Generate your first report using the form</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedReports.slice(0, 5).map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{report.title || "Generated Report"}</p>
                      <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportGenerator
