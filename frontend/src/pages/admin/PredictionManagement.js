"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { toast } from "react-toastify"

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const PredictionManagement = () => {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'high-risk', 'medium-risk', 'low-risk'
  const [sortBy, setSortBy] = useState("createdAt") // 'createdAt', 'risk', 'user'
  const [sortOrder, setSortOrder] = useState("desc") // 'asc', 'desc'

  useEffect(() => {
    fetchPredictions()
  }, [currentPage, filter, sortBy, sortOrder])

  const fetchPredictions = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/predictions", {
        params: {
          page: currentPage,
          limit: 10,
          filter,
          sort: sortBy,
          order: sortOrder,
          search: searchTerm,
        },
      })

      setPredictions(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching predictions:", error)
      toast.error("Failed to load predictions")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchPredictions()
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prediction?")) {
      try {
        await api.delete(`/admin/predictions/${id}`)
        toast.success("Prediction deleted successfully")
        fetchPredictions()
      } catch (error) {
        console.error("Error deleting prediction:", error)
        toast.error("Failed to delete prediction")
      }
    }
  }

  const handleExport = async () => {
    try {
      const response = await api.get("/export/predictions", {
        responseType: "blob",
        params: {
          filter,
          search: searchTerm,
        },
      })

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `predictions-export-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success("Predictions exported successfully")
    } catch (error) {
      console.error("Error exporting predictions:", error)
      toast.error("Failed to export predictions")
    }
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && predictions.length === 0) {
    return <div className="text-center py-10">Loading predictions...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prediction Management</h1>
        <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Export to CSV
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search by user name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-l-md w-full md:w-64"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </form>

          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("user")}
                >
                  User
                  {sortBy === "user" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prediction Data
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("risk")}
                >
                  Risk Level
                  {sortBy === "risk" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("createdAt")}
                >
                  Date
                  {sortBy === "createdAt" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((prediction) => (
                <tr key={prediction._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {prediction.user.firstName} {prediction.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{prediction.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Age: {prediction.age}</div>
                      <div>BMI: {prediction.bmi}</div>
                      <div>Glucose: {prediction.glucose}</div>
                      {/* Add more prediction data as needed */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeClass(prediction.riskLevel)}`}
                    >
                      {(prediction?.riskLevel?.charAt(0)?.toUpperCase() || "") + (prediction?.riskLevel?.slice(1) || "")}

                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(prediction.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/predictions/${prediction._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    <button onClick={() => handleDelete(prediction._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {predictions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No predictions found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md mr-2 bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md ml-2 bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictionManagement
