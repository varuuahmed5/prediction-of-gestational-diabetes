"use client"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Download, Save, FileText, Calendar, Users, BarChart2, User, Shield, Mail, Lock } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

// Create adminAPI object
const adminAPI = {
  getAdminProfile: () => api.get("/admin/profile"),
  updateAdminProfile: (data) => api.put("/admin/profile", data),
  getAdminReports: () => api.get("/admin/reports"),
  saveAdminReport: (data) => api.post("/admin/reports", data),
  downloadAdminReport: (id) => api.get(`/admin/reports/${id}/download`, { responseType: "blob" }),
}

const AdminProfile = () => {
  // Ku dar console.log si aad u hubiso in component-ku la render-gareenayo
  console.log("AdminProfile component rendered")

 const { user , logout} = useAuth()
 // Now properly defined
  
  // Redirect if user is not admin
  useEffect(() => {
    if (!user || user?.role !== 'admin') {
      toast.error("Admin access required")
    }
  }, [user])


  const [profile, setProfile] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@example.com",
    password: "",
    confirmPassword: "",
    role: user?.role || "admin",
    department: "IT Department",
    phone: "+1234567890",
    lastLogin: new Date().toISOString(),
  })

  const [report, setReport] = useState({
    title: "",
    type: "user_activity",
    dateRange: "last_30_days",
    description: "",
    includeCharts: true,
  })

  const [savedReports, setSavedReports] = useState([])
  const [isLoading, setIsLoading] = useState({
    profile: false,
    reports: false,
    saving: false,
    updating: false,
  })

  useEffect(() => {
    fetchProfile()
    fetchSavedReports()
  }, [])

  const fetchProfile = async () => {
    setIsLoading((prev) => ({ ...prev, profile: true }))
    try {
      // Mock data for now since we don't have the backend endpoint
      const mockProfile = {
        name: user?.name || "Admin User",
        email: user?.email || "admin@example.com",
        role: user?.role || "admin",
        department: "IT Department",
        phone: "+1234567890",
        lastLogin: new Date().toISOString(),
      }

      setProfile({
        ...mockProfile,
        password: "",
        confirmPassword: "",
      })
      // Ku dar console.log si aad u hubiso profile data
      console.log("Profile data:", profile)
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast.error("Failed to load profile data")
    } finally {
      setIsLoading((prev) => ({ ...prev, profile: false }))
    }
  }

  const fetchSavedReports = async () => {
    setIsLoading((prev) => ({ ...prev, reports: true }))
    try {
      // Mock data for now
      const mockReports = [
        {
          id: 1,
          title: "Monthly User Activity Report",
          type: "user_activity",
          dateRange: "last_30_days",
          description: "Comprehensive analysis of user engagement and activity patterns",
          createdAt: new Date().toISOString(),
          includeCharts: true,
        },
        {
          id: 2,
          title: "Appointment Statistics",
          type: "appointment_stats",
          dateRange: "last_90_days",
          description: "Analysis of appointment booking trends and completion rates",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          includeCharts: true,
        },
      ]

      setSavedReports(mockReports)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
      toast.error("Failed to load saved reports")
    } finally {
      setIsLoading((prev) => ({ ...prev, reports: false }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleReportChange = (e) => {
    const { name, value, type, checked } = e.target
    setReport((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (profile.password && profile.password !== profile.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    setIsLoading((prev) => ({ ...prev, updating: true }))
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        department: profile.department,
        ...(profile.password && { password: profile.password }),
      }

      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully")
      setProfile((prev) => ({ ...prev, password: "", confirmPassword: "" }))
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsLoading((prev) => ({ ...prev, updating: false }))
    }
  }

  const handleSaveReport = async (e) => {
    e.preventDefault()

    if (!report.title.trim()) {
      return toast.error("Report title is required")
    }

    setIsLoading((prev) => ({ ...prev, saving: true }))
    try {
      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newReport = {
        id: Date.now(),
        ...report,
        createdAt: new Date().toISOString(),
      }

      setSavedReports((prev) => [newReport, ...prev])
      toast.success("Report saved successfully")

      // Reset form
      setReport({
        title: "",
        type: "user_activity",
        dateRange: "last_30_days",
        description: "",
        includeCharts: true,
      })
    } catch (error) {
      console.error("Save report error:", error)
      toast.error(error.response?.data?.message || "Failed to save report")
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }))
    }
  }

  const handleDownloadReport = async (reportId) => {
    try {
      // Mock download for now
      toast.success("Report download started")

      // Create a mock PDF download
      const mockPdfContent = "Mock PDF content for report " + reportId
      const blob = new Blob([mockPdfContent], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `report-${reportId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download report")
    }
  }

  const getReportIcon = (type) => {
    switch (type) {
      case "user_activity":
        return <Users className="h-5 w-5 text-blue-600" />
      case "appointment_stats":
        return <Calendar className="h-5 w-5 text-green-600" />
      case "prediction_accuracy":
        return <BarChart2 className="h-5 w-5 text-purple-600" />
      case "system_performance":
        return <FileText className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile & Management</h1>
            <p className="text-gray-600 mt-1">Manage your administrator account and generate system reports</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Shield className="h-5 w-5 text-purple-600" />}
            title="Administrator"
            value={profile.role || "Admin"}
            description="Your role"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title="Total Users"
            value="1,247"
            description="Registered users"
          />
          <StatCard
            icon={<Calendar className="h-5 w-5 text-green-600" />}
            title="Appointments"
            value="156"
            description="This month"
          />
          <StatCard
            icon={<FileText className="h-5 w-5 text-orange-600" />}
            title="Reports"
            value={savedReports.length}
            description="Generated"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <ProfileForm
            profile={profile}
            onChange={handleChange}
            onSubmit={handleUpdate}
            isLoading={isLoading.updating}
          />
        </div>

        {/* Reports Section */}
        <div className="lg:col-span-2 space-y-6">
          <ReportGenerator
            report={report}
            onChange={handleReportChange}
            onSubmit={handleSaveReport}
            isLoading={isLoading.saving}
          />

          <ReportList
            reports={savedReports}
            onDownload={handleDownloadReport}
            getIcon={getReportIcon}
            isLoading={isLoading.reports}
          />
        </div>
      </div>
    </div>
  )
}

// Sub-components for better organization
const StatCard = ({ icon, title, value, description }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm font-semibold text-gray-800">{title}</span>
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
)

const ProfileForm = ({ profile, onChange, onSubmit, isLoading }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Admin Profile</h2>
          <p className="text-purple-100 text-sm">System Administrator</p>
        </div>
      </div>
    </div>

    <div className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          name="name"
          value={profile.name}
          onChange={onChange}
          icon={<User className="h-4 w-4 inline mr-2" />}
          type="text"
          placeholder="Enter your full name"
        />

        <FormField
          label="Email Address"
          name="email"
          value={profile.email}
          onChange={onChange}
          icon={<Mail className="h-4 w-4 inline mr-2" />}
          type="email"
          placeholder="Enter your email"
        />

        <FormField
          label="Phone Number"
          name="phone"
          value={profile.phone}
          onChange={onChange}
          type="tel"
          placeholder="Enter your phone number"
        />

        <FormField
          label="Department"
          name="department"
          value={profile.department}
          onChange={onChange}
          type="text"
          placeholder="Enter your department"
        />

        <FormField
          label="New Password (optional)"
          name="password"
          value={profile.password}
          onChange={onChange}
          icon={<Lock className="h-4 w-4 inline mr-2" />}
          type="password"
          placeholder="Enter new password"
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          value={profile.confirmPassword}
          onChange={onChange}
          icon={<Lock className="h-4 w-4 inline mr-2" />}
          type="password"
          placeholder="Confirm new password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </span>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Update Profile
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Role:</span>
            <span className="font-medium text-purple-600">{profile.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Last Login:</span>
            <span className="font-medium">
              {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const FormField = ({ label, name, value, onChange, icon, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {icon}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder={placeholder}
    />
  </div>
)

const ReportGenerator = ({ report, onChange, onSubmit, isLoading }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <Save className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Generate System Report</h2>
          <p className="text-blue-100 text-sm">Create comprehensive system analytics</p>
        </div>
      </div>
    </div>

    <div className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Report Title"
          name="title"
          value={report.title}
          onChange={onChange}
          required
          placeholder="e.g., Monthly User Activity Report"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              name="type"
              value={report.type}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user_activity">User Activity</option>
              <option value="appointment_stats">Appointment Statistics</option>
              <option value="prediction_accuracy">Prediction Accuracy</option>
              <option value="system_performance">System Performance</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              name="dateRange"
              value={report.dateRange}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="last_year">Last Year</option>
              <option value="all_time">All Time</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            name="description"
            value={report.description}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Brief description of what this report contains..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeCharts"
            name="includeCharts"
            checked={report.includeCharts}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeCharts" className="ml-2 text-sm text-gray-700">
            Include charts and visualizations
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-medium flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </span>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Generate & Save Report
            </>
          )}
        </button>
      </form>
    </div>
  </div>
)

const ReportList = ({ reports, onDownload, getIcon, isLoading }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Saved Reports</h2>
            <p className="text-green-100 text-sm">{reports.length} reports available</p>
          </div>
        </div>
      </div>
    </div>

    <div className="p-6">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No saved reports yet</p>
          <p className="text-gray-400 text-sm mt-2">Generate your first report using the form above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} onDownload={onDownload} getIcon={getIcon} />
          ))}
        </div>
      )}
    </div>
  </div>
)

const ReportItem = ({ report, onDownload, getIcon }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
    <div className="flex justify-between items-start">
      <div className="flex items-start space-x-3">
        <div className="mt-1">{getIcon(report.type)}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{report.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <ReportBadge icon="📅" text={new Date(report.createdAt).toLocaleDateString()} />
            <ReportBadge icon="📊" text={report.type.replace("_", " ")} />
            <ReportBadge icon="⏱️" text={report.dateRange.replace("_", " ")} />
          </div>
          {report.description && (
            <p className="text-sm text-gray-600 mt-3 bg-white p-2 rounded">{report.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDownload(report.id)}
        className="bg-green-100 hover:bg-green-200 p-3 rounded-lg transition-colors"
        title="Download Report"
      >
        <Download className="h-5 w-5 text-green-600" />
      </button>
    </div>
  </div>
)

const ReportBadge = ({ icon, text }) => (
  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
    {icon} {text}
  </span>
)

export default AdminProfile
