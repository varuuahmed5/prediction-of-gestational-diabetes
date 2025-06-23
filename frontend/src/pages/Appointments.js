"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Appointments = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [currentPage, filters])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockAppointments = [
        {
          _id: "1",
          date: "2025-04-15T00:00:00.000Z",
          time: "10:00",
          reason: "Regular diabetes checkup and blood sugar monitoring",
          doctor: {
            _id: "1",
            firstName: "Hebel",
            lastName: "Hebel",
            specialization: "Endocrinologist",
            email: "hebel@hospital.com",
          },
          patient: {
            name: "Amina Hassan",
            email: "amina@example.com",
          },
          notes: "Follow-up appointment for diabetes management",
          type: "in-person",
          status: "scheduled",
          appointmentType: "Diabetes Consultation",
        },
        {
          _id: "2",
          date: "2025-04-18T00:00:00.000Z",
          time: "14:30",
          reason: "Heart palpitations and chest discomfort",
          doctor: {
            _id: "2",
            firstName: "Fariha",
            lastName: "Nur",
            specialization: "Cardiologist",
            email: "fariha@hospital.com",
          },
          patient: {
            name: "Ahmed Mohamed",
            email: "ahmed@example.com",
          },
          notes: "Patient experiencing irregular heartbeat",
          type: "virtual",
          status: "confirmed",
          appointmentType: "Cardiology Consultation",
        },
        {
          _id: "3",
          date: "2025-06-20T00:00:00.000Z",
          time: "09:15",
          reason: "Prenatal checkup and ultrasound",
          doctor: {
            _id: "4",
            firstName: "Amina",
            lastName: "Hassan",
            specialization: "Gynecologist",
            email: "amina.dr@hospital.com",
          },
          patient: {
            name: "Fatima Ahmed",
            email: "fatima@example.com",
          },
          notes: "20-week pregnancy checkup",
          type: "in-person",
          status: "scheduled",
          appointmentType: "Prenatal Care",
        },
        {
          _id: "4",
          date: "2025-05-12T00:00:00.000Z",
          time: "11:00",
          reason: "Headaches and dizziness evaluation",
          doctor: {
            _id: "3",
            firstName: "Ali",
            lastName: "Warsame",
            specialization: "Neurologist",
            email: "ali@hospital.com",
          },
          patient: {
            name: "Hassan Yusuf",
            email: "hassan@example.com",
          },
          notes: "Completed neurological examination",
          type: "in-person",
          status: "completed",
          appointmentType: "Neurology Consultation",
        },
        {
          _id: "5",
          date: "2025-05-25T00:00:00.000Z",
          time: "16:00",
          reason: "General health checkup and vaccination",
          doctor: {
            _id: "5",
            firstName: "Omar",
            lastName: "Abdi",
            specialization: "General Practitioner",
            email: "omar@hospital.com",
          },
          patient: {
            name: "Khadija Omar",
            email: "khadija@example.com",
          },
          notes: "Annual physical examination",
          type: "in-person",
          status: "pending",
          appointmentType: "General Checkup",
        },
      ]

      // Apply filters
      let filteredAppointments = mockAppointments

      if (filters.status) {
        filteredAppointments = filteredAppointments.filter((apt) => apt.status === filters.status)
      }

      if (filters.date) {
        filteredAppointments = filteredAppointments.filter((apt) => apt.date.split("T")[0] === filters.date)
      }

      if (filters.search) {
        filteredAppointments = filteredAppointments.filter(
          (apt) =>
            apt.doctor.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
            apt.doctor.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
            apt.patient.name.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      setAppointments(filteredAppointments)
      setTotalPages(Math.ceil(filteredAppointments.length / 10))
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const refreshAppointments = async () => {
    setRefreshing(true)
    try {
      await fetchAppointments()
      toast.success("Appointments refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh appointments")
    } finally {
      setRefreshing(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const applyFilters = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchAppointments()
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      date: "",
      search: "",
    })
    setCurrentPage(1)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    const options = { hour: "2-digit", minute: "2-digit" }
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, options)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">📅 Appointment Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all patient appointments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <button
            onClick={refreshAppointments}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span className={`mr-2 ${refreshing ? "animate-spin" : ""}`}>🔄</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">🔍</span>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => navigate("/admin/appointments/new")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">➕</span>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">🔍 Filter Appointments</h3>
          <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by doctor or patient name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading appointments...</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No appointments found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {filters.status || filters.date || filters.search
                ? "No appointments match your current filters."
                : "No appointments have been scheduled yet."}
            </p>
            <button
              onClick={() => navigate("/admin/appointments/new")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="mr-2">➕</span>
              Book First Appointment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => navigate(`/admin/appointments/${appointment._id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {appointment.appointmentType}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{appointment.reason}</p>
                  </div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="mr-2">🕐</span>
                    <span>{formatTime(appointment.time)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="mr-2">👨‍⚕️</span>
                    <span>
                      Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="mr-2">👤</span>
                    <span>{appointment.patient.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="mr-2">{appointment.type === "virtual" ? "💻" : "🏥"}</span>
                    <span>{appointment.type === "virtual" ? "Virtual" : "In-Person"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-1">←</span>
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
