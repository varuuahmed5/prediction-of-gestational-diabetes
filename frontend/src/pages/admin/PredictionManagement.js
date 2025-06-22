"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import {
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "react-feather"

// Mock API service
const api = {
  get: (url, config = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock prediction data
        const mockPredictions = [
          {
            _id: "1",
            user: { firstName: "Amina", lastName: "Hassan", email: "amina.hassan@email.com" },
            age: 28,
            bmi: 24.5,
            glucose: 95,
            bloodPressure: 120,
            insulin: 85,
            riskLevel: "low",
            riskScore: 0.15,
            createdAt: "2025-04-15T10:30:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "2",
            user: { firstName: "Fatima", lastName: "Ahmed", email: "fatima.ahmed@email.com" },
            age: 32,
            bmi: 28.2,
            glucose: 140,
            bloodPressure: 135,
            insulin: 120,
            riskLevel: "medium",
            riskScore: 0.65,
            createdAt: "2025-04-14T14:20:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "3",
            user: { firstName: "Khadija", lastName: "Omar", email: "khadija.omar@email.com" },
            age: 35,
            bmi: 32.1,
            glucose: 180,
            bloodPressure: 150,
            insulin: 160,
            riskLevel: "high",
            riskScore: 0.85,
            createdAt: "2025-04-13T09:15:00Z",
            hasErrors: true,
            errors: ["High glucose reading needs verification", "BMI calculation may be inaccurate"],
          },
          {
            _id: "4",
            user: { firstName: "Sahra", lastName: "Ali", email: "sahra.ali@email.com" },
            age: 29,
            bmi: 23.8,
            glucose: 88,
            bloodPressure: 115,
            insulin: 75,
            riskLevel: "low",
            riskScore: 0.12,
            createdAt: "2025-04-12T16:45:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "5",
            user: { firstName: "Maryam", lastName: "Yusuf", email: "maryam.yusuf@email.com" },
            age: 31,
            bmi: 26.7,
            glucose: 125,
            bloodPressure: 128,
            insulin: 95,
            riskLevel: "medium",
            riskScore: 0.58,
            createdAt: "2025-05-11T11:30:00Z",
            hasErrors: true,
            errors: ["Missing family history data"],
          },
          {
            _id: "6",
            user: { firstName: "Halima", lastName: "Mohamed", email: "halima.mohamed@email.com" },
            age: 26,
            bmi: 22.3,
            glucose: 92,
            bloodPressure: 118,
            insulin: 78,
            riskLevel: "low",
            riskScore: 0.18,
            createdAt: "2025-05-10T08:20:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "7",
            user: { firstName: "Zahra", lastName: "Ibrahim", email: "zahra.ibrahim@email.com" },
            age: 33,
            bmi: 29.4,
            glucose: 155,
            bloodPressure: 142,
            insulin: 135,
            riskLevel: "high",
            riskScore: 0.78,
            createdAt: "2025-05-09T13:45:00Z",
            hasErrors: true,
            errors: ["Elevated blood pressure", "High insulin resistance"],
          },
          {
            _id: "8",
            user: { firstName: "Asma", lastName: "Abdi", email: "asma.abdi@email.com" },
            age: 27,
            bmi: 25.1,
            glucose: 98,
            bloodPressure: 122,
            insulin: 82,
            riskLevel: "low",
            riskScore: 0.22,
            createdAt: "2025-05-08T15:30:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "9",
            user: { firstName: "Hawa", lastName: "Farah", email: "hawa.farah@email.com" },
            age: 30,
            bmi: 27.8,
            glucose: 132,
            bloodPressure: 130,
            insulin: 110,
            riskLevel: "medium",
            riskScore: 0.52,
            createdAt: "2025-06-07T10:15:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "10",
            user: { firstName: "Asha", lastName: "Nur", email: "asha.nur@email.com" },
            age: 34,
            bmi: 31.2,
            glucose: 175,
            bloodPressure: 148,
            insulin: 155,
            riskLevel: "high",
            riskScore: 0.82,
            createdAt: "2025-04-06T12:00:00Z",
            hasErrors: true,
            errors: ["Critical glucose levels", "Requires immediate attention"],
          },
          {
            _id: "11",
            user: { firstName: "Fardowsa", lastName: "Osman", email: "fardowsa.osman@email.com" },
            age: 25,
            bmi: 21.9,
            glucose: 85,
            bloodPressure: 112,
            insulin: 70,
            riskLevel: "low",
            riskScore: 0.08,
            createdAt: "2025-05-05T09:30:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "12",
            user: { firstName: "Hodan", lastName: "Aden", email: "hodan.aden@email.com" },
            age: 36,
            bmi: 33.5,
            glucose: 190,
            bloodPressure: 155,
            insulin: 170,
            riskLevel: "high",
            riskScore: 0.91,
            createdAt: "2025-06-04T14:45:00Z",
            hasErrors: true,
            errors: ["Extremely high glucose", "Severe insulin resistance", "Urgent medical consultation needed"],
          },
          {
            _id: "13",
            user: { firstName: "Ikran", lastName: "Jama", email: "ikran.jama@email.com" },
            age: 28,
            bmi: 24.7,
            glucose: 102,
            bloodPressure: 125,
            insulin: 88,
            riskLevel: "low",
            riskScore: 0.25,
            createdAt: "2025-05-03T11:20:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "14",
            user: { firstName: "Naima", lastName: "Hersi", email: "naima.hersi@email.com" },
            age: 32,
            bmi: 28.9,
            glucose: 148,
            bloodPressure: 138,
            insulin: 125,
            riskLevel: "medium",
            riskScore: 0.68,
            createdAt: "2025-03-02T16:10:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "15",
            user: { firstName: "Sagal", lastName: "Warsame", email: "sagal.warsame@email.com" },
            age: 29,
            bmi: 26.3,
            glucose: 115,
            bloodPressure: 127,
            insulin: 95,
            riskLevel: "medium",
            riskScore: 0.45,
            createdAt: "2025-04-01T08:45:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "16",
            user: { firstName: "Ubah", lastName: "Duale", email: "ubah.duale@email.com" },
            age: 31,
            bmi: 30.1,
            glucose: 165,
            bloodPressure: 145,
            insulin: 145,
            riskLevel: "high",
            riskScore: 0.75,
            createdAt: "2025-05-31T13:25:00Z",
            hasErrors: true,
            errors: ["High glucose trend", "Monitoring required"],
          },
          {
            _id: "17",
            user: { firstName: "Warsan", lastName: "Ismail", email: "warsan.ismail@email.com" },
            age: 26,
            bmi: 23.4,
            glucose: 94,
            bloodPressure: 119,
            insulin: 76,
            riskLevel: "low",
            riskScore: 0.16,
            createdAt: "2025-06-30T10:50:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "18",
            user: { firstName: "Xalima", lastName: "Abdirahman", email: "xalima.abdirahman@email.com" },
            age: 33,
            bmi: 29.7,
            glucose: 152,
            bloodPressure: 140,
            insulin: 130,
            riskLevel: "high",
            riskScore: 0.72,
            createdAt: "2025-06-29T15:35:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "19",
            user: { firstName: "Yasmin", lastName: "Abdullahi", email: "yasmin.abdullahi@email.com" },
            age: 27,
            bmi: 25.8,
            glucose: 108,
            bloodPressure: 124,
            insulin: 90,
            riskLevel: "low",
            riskScore: 0.28,
            createdAt: "2025-05-28T12:15:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "20",
            user: { firstName: "Zeinab", lastName: "Sheikh", email: "zeinab.sheikh@email.com" },
            age: 35,
            bmi: 32.8,
            glucose: 178,
            bloodPressure: 152,
            insulin: 165,
            riskLevel: "high",
            riskScore: 0.88,
            createdAt: "2025-04-27T09:40:00Z",
            hasErrors: true,
            errors: ["Multiple risk factors", "Comprehensive evaluation needed"],
          },
          {
            _id: "21",
            user: { firstName: "Amran", lastName: "Mohamud", email: "amran.mohamud@email.com" },
            age: 24,
            bmi: 20.8,
            glucose: 82,
            bloodPressure: 110,
            insulin: 68,
            riskLevel: "low",
            riskScore: 0.05,
            createdAt: "2025-05-26T14:20:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "22",
            user: { firstName: "Bisharo", lastName: "Yusuf", email: "bisharo.yusuf@email.com" },
            age: 30,
            bmi: 27.2,
            glucose: 128,
            bloodPressure: 132,
            insulin: 105,
            riskLevel: "medium",
            riskScore: 0.48,
            createdAt: "2025-05-25T11:55:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "23",
            user: { firstName: "Caasha", lastName: "Hassan", email: "caasha.hassan@email.com" },
            age: 34,
            bmi: 31.5,
            glucose: 172,
            bloodPressure: 147,
            insulin: 150,
            riskLevel: "high",
            riskScore: 0.79,
            createdAt: "2025-05-24T16:30:00Z",
            hasErrors: true,
            errors: ["Borderline diabetic range"],
          },
          {
            _id: "24",
            user: { firstName: "Dahabo", lastName: "Ahmed", email: "dahabo.ahmed@email.com" },
            age: 28,
            bmi: 24.1,
            glucose: 96,
            bloodPressure: 121,
            insulin: 80,
            riskLevel: "low",
            riskScore: 0.19,
            createdAt: "2025-05-23T08:10:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "25",
            user: { firstName: "Ebyan", lastName: "Omar", email: "ebyan.omar@email.com" },
            age: 32,
            bmi: 28.6,
            glucose: 145,
            bloodPressure: 136,
            insulin: 118,
            riskLevel: "medium",
            riskScore: 0.62,
            createdAt: "2025-04-22T13:45:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "26",
            user: { firstName: "Fowsia", lastName: "Ali", email: "fowsia.ali@email.com" },
            age: 29,
            bmi: 26.9,
            glucose: 118,
            bloodPressure: 129,
            insulin: 98,
            riskLevel: "medium",
            riskScore: 0.42,
            createdAt: "2025-04-21T10:25:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "27",
            user: { firstName: "Gacalo", lastName: "Farah", email: "gacalo.farah@email.com" },
            age: 37,
            bmi: 34.2,
            glucose: 185,
            bloodPressure: 158,
            insulin: 175,
            riskLevel: "high",
            riskScore: 0.94,
            createdAt: "2025-05-20T15:50:00Z",
            hasErrors: true,
            errors: ["Critical risk level", "Immediate intervention required", "Multiple complications possible"],
          },
          {
            _id: "28",
            user: { firstName: "Habibo", lastName: "Mohamud", email: "habibo.mohamud@email.com" },
            age: 25,
            bmi: 22.7,
            glucose: 89,
            bloodPressure: 116,
            insulin: 73,
            riskLevel: "low",
            riskScore: 0.12,
            createdAt: "2025-05-19T12:35:00Z",
            hasErrors: false,
            errors: [],
          },
          {
            _id: "29",
            user: { firstName: "Ifrah", lastName: "Abdi", email: "ifrah.abdi@email.com" },
            age: 31,
            bmi: 29.1,
            glucose: 158,
            bloodPressure: 143,
            insulin: 140,
            riskLevel: "high",
            riskScore: 0.76,
            createdAt: "2025-05-18T09:20:00Z",
            hasErrors: true,
            errors: ["Trending upward", "Regular monitoring advised"],
          },
          {
            _id: "30",
            user: { firstName: "Jawahir", lastName: "Ibrahim", email: "jawahir.ibrahim@email.com" },
            age: 26,
            bmi: 25.5,
            glucose: 105,
            bloodPressure: 123,
            insulin: 85,
            riskLevel: "low",
            riskScore: 0.32,
            createdAt: "2025-04-17T14:15:00Z",
            hasErrors: false,
            errors: [],
          },
        ]

        // Apply search filter
        let filteredData = mockPredictions
        const searchTerm = config.params?.search?.toLowerCase() || ""
        const filter = config.params?.filter || "all"
        const dateFilter = config.params?.dateFilter || ""

        if (searchTerm) {
          filteredData = filteredData.filter(
            (prediction) =>
              prediction.user.firstName.toLowerCase().includes(searchTerm) ||
              prediction.user.lastName.toLowerCase().includes(searchTerm),
          )
        }

        if (filter !== "all") {
          filteredData = filteredData.filter((prediction) => prediction.riskLevel === filter)
        }

        if (dateFilter) {
          const filterDate = new Date(dateFilter)
          filteredData = filteredData.filter((prediction) => {
            const predictionDate = new Date(prediction.createdAt)
            return predictionDate.toDateString() === filterDate.toDateString()
          })
        }

        resolve({
          data: {
            data: filteredData,
            totalPages: Math.ceil(filteredData.length / 10),
            total: filteredData.length,
          },
        })
      }, 500)
    })
  },

  delete: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: "Prediction deleted successfully" } })
      }, 500)
    })
  },

  put: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: "Prediction updated successfully" } })
      }, 500)
    })
  },
}

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
  const [dateFilter, setDateFilter] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'high', 'medium', 'low'
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [editingPrediction, setEditingPrediction] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchPredictions()
  }, [currentPage, filter, sortBy, sortOrder, dateFilter])

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
          dateFilter,
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
    setCurrentPage(1)
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

  const handleEdit = (prediction) => {
    setEditingPrediction({ ...prediction })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      await api.put(`/admin/predictions/${editingPrediction._id}`, editingPrediction)
      toast.success("Prediction updated successfully")
      setShowEditModal(false)
      setEditingPrediction(null)
      fetchPredictions()
    } catch (error) {
      console.error("Error updating prediction:", error)
      toast.error("Failed to update prediction")
    }
  }

  const handleExport = async () => {
    try {
      // Mock CSV export
      const csvContent = predictions
        .map(
          (p) =>
            `${p.user.firstName} ${p.user.lastName},${p.user.email},${p.age},${p.bmi},${p.glucose},${p.riskLevel},${formatDate(p.createdAt)}`,
        )
        .join("\n")

      const csvHeader = "Name,Email,Age,BMI,Glucose,Risk Level,Date\n"
      const fullCsv = csvHeader + csvContent

      const blob = new Blob([fullCsv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
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

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 border border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border border-blue-200"
    }
  }

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "high":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />
    }
  }

  if (loading && predictions.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Prediction Management</h1>
          <p className="text-blue-600 mt-1">Manage and monitor patient predictions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search by Name */}
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="text"
                placeholder="Search by name only"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("")
              setDateFilter("")
              setFilter("all")
              setCurrentPage(1)
              fetchPredictions()
            }}
            className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-blue-600">
          Showing {predictions.length} predictions
          {searchTerm && ` matching "${searchTerm}"`}
          {dateFilter && ` from ${formatDate(dateFilter)}`}
          {filter !== "all" && ` with ${filter} risk`}
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-white rounded-lg shadow-lg border border-blue-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Patient Info
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Prediction Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Risk Assessment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Date & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {predictions.map((prediction) => (
                <tr key={prediction._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-900">
                          {prediction.user.firstName} {prediction.user.lastName}
                        </div>
                        <div className="text-sm text-blue-600">{prediction.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-blue-900 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Age:</span>
                        <span className="font-medium">{prediction.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">BMI:</span>
                        <span className="font-medium">{prediction.bmi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Glucose:</span>
                        <span className="font-medium">{prediction.glucose} mg/dL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">BP:</span>
                        <span className="font-medium">{prediction.bloodPressure} mmHg</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {getRiskIcon(prediction.riskLevel)}
                        <span
                          className={`ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeClass(prediction.riskLevel)}`}
                        >
                          {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} Risk
                        </span>
                      </div>
                      <div className="text-xs text-blue-600">Score: {(prediction.riskScore * 100).toFixed(1)}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="text-sm text-blue-900">{formatDate(prediction.createdAt)}</div>
                      {prediction.hasErrors ? (
                        <div className="flex items-center text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {prediction.errors.length} Error(s)
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          No Issues
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          /* View details */
                        }}
                        className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(prediction)}
                        className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                        title="Edit Prediction"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prediction._id)}
                        className="flex items-center px-3 py-1 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                        title="Delete Prediction"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {predictions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-blue-500 text-lg font-medium">No predictions found</p>
            <p className="text-blue-400 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-blue-50 px-6 py-3 flex items-center justify-between border-t border-blue-200">
            <div className="text-sm text-blue-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white border border-blue-300 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-blue-300 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingPrediction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Edit Prediction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Age</label>
                <input
                  type="number"
                  value={editingPrediction.age}
                  onChange={(e) => setEditingPrediction({ ...editingPrediction, age: Number.parseInt(e.target.value) })}
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">BMI</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingPrediction.bmi}
                  onChange={(e) =>
                    setEditingPrediction({ ...editingPrediction, bmi: Number.parseFloat(e.target.value) })
                  }
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Glucose (mg/dL)</label>
                <input
                  type="number"
                  value={editingPrediction.glucose}
                  onChange={(e) =>
                    setEditingPrediction({ ...editingPrediction, glucose: Number.parseInt(e.target.value) })
                  }
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Risk Level</label>
                <select
                  value={editingPrediction.riskLevel}
                  onChange={(e) => setEditingPrediction({ ...editingPrediction, riskLevel: e.target.value })}
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingPrediction(null)
                }}
                className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionManagement
