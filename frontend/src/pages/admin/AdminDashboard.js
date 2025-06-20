"use client"

import { useState, useEffect } from "react"
import { Users, FileText, Calendar, Activity, TrendingUp, AlertCircle, CheckCircle } from "react-feather"
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      new: 0,
      active: 0,
      byRole: [],
    },
    predictions: {
      total: 0,
      new: 0,
      byResult: [],
      byRisk: [],
    },
    appointments: {
      total: 0,
      upcoming: 0,
      byStatus: [],
    },
    reports: {
      total: 0,
      public: 0,
    },
    recentActivity: {
      predictions: [],
      appointments: [],
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)

        // Try real API call first
        try {
          const response = await fetch("/api/admin/dashboard-stats")
          if (response.ok) {
            const data = await response.json()
            setStats(data)
            setLoading(false)
            return
          }
        } catch (apiError) {
          console.log("API not available, using mock data")
        }

        // Fallback to mock data with realistic delay
        setTimeout(() => {
          setStats({
            users: {
              total: 1247,
              new: 45,
              active: 892,
              byRole: [
                { _id: "patient", count: 1200 },
                { _id: "doctor", count: 35 },
                { _id: "admin", count: 12 },
              ],
            },
            predictions: {
              total: 5678,
              new: 234,
              byResult: [
                { _id: "non-diabetic", count: 3400 },
                { _id: "diabetic", count: 1800 },
                { _id: "pre-diabetic", count: 478 },
              ],
            },
            appointments: {
              total: 892,
              upcoming: 156,
              byStatus: [
                { _id: "confirmed", count: 450 },
                { _id: "pending", count: 200 },
                { _id: "cancelled", count: 242 },
              ],
            },
            reports: {
              total: 45,
              public: 12,
            },
            recentActivity: {
              predictions: [
                {
                  _id: "1",
                  user: { name: "John Doe" },
                  result: { prediction: "non-diabetic" },
                  createdAt: new Date().toISOString(),
                },
                {
                  _id: "2",
                  user: { name: "Jane Smith" },
                  result: { prediction: "diabetic" },
                  createdAt: new Date().toISOString(),
                },
                {
                  _id: "3",
                  user: { name: "Bob Johnson" },
                  result: { prediction: "pre-diabetic" },
                  createdAt: new Date().toISOString(),
                },
              ],
              appointments: [
                {
                  _id: "1",
                  user: { name: "Alice Wilson" },
                  date: new Date().toISOString(),
                  time: { start: "10:00 AM" },
                  status: "confirmed",
                },
                {
                  _id: "2",
                  user: { name: "Mike Davis" },
                  date: new Date().toISOString(),
                  time: { start: "2:00 PM" },
                  status: "pending",
                },
              ],
            },
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="bg-white shadow rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">System Administration & Management Overview</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <Users size={16} className="mr-2" />
              Manage Users
            </Link>
            <Link
              to="/admin/reports"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
            >
              <FileText size={16} className="mr-2" />
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-600" />}
          title="Total Users"
          value={stats.users.total.toLocaleString()}
          subtitle={`+${stats.users.new} new this month`}
          color="blue"
          link="/admin/users"
        />
        <StatCard
          icon={<Activity className="h-8 w-8 text-green-600" />}
          title="Predictions"
          value={stats.predictions.total.toLocaleString()}
          subtitle={`+${stats.predictions.new} new this week`}
          color="green"
          link="/admin/predictions"
        />
        <StatCard
          icon={<Calendar className="h-8 w-8 text-purple-600" />}
          title="Appointments"
          value={stats.appointments.total.toLocaleString()}
          subtitle={`${stats.appointments.upcoming} upcoming`}
          color="purple"
          link="/admin/appointments"
        />
        <StatCard
          icon={<FileText className="h-8 w-8 text-orange-600" />}
          title="Reports"
          value={stats.reports.total}
          subtitle={`${stats.reports.public} public reports`}
          color="orange"
          link="/admin/reports"
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Recent Predictions */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Predictions
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest diabetes prediction results</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {stats.recentActivity.predictions.map((prediction) => (
                <div key={prediction._id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{prediction.user?.name || "Unknown User"}</p>
                        <p className="text-sm text-gray-500">{new Date(prediction.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prediction.result.prediction === "diabetic"
                            ? "bg-red-100 text-red-800"
                            : prediction.result.prediction === "non-diabetic"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {prediction.result.prediction === "diabetic" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {prediction.result.prediction === "non-diabetic" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {prediction.result.prediction === "pre-diabetic" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {prediction.result.prediction}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3">
            <Link to="/admin/predictions" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all predictions →
            </Link>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Recent Appointments
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest appointment bookings</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {stats.recentActivity.appointments.map((appointment) => (
                <div key={appointment._id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{appointment.user?.name || "Unknown User"}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time.start}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3">
            <Link to="/admin/appointments" className="text-sm font-medium text-purple-600 hover:text-purple-500">
              View all appointments →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Stat Card Component
const StatCard = ({ icon, title, value, subtitle, color, link }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
  }

  const bgColorClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  }

  return (
    <Link to={link} className="block">
      <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
        <div className={`px-4 py-5 ${bgColorClasses[color]}`}>
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}
            >
              {icon}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AdminDashboard
