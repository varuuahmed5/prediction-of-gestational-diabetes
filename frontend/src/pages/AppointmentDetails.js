"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockAppointment = {
          _id: id,
          date: "2025-04-15T00:00:00.000Z",
          time: "10:00",
          reason:
            "Regular diabetes checkup and blood sugar monitoring. Patient has been experiencing fluctuating glucose levels.",
          doctor: {
            _id: "1",
            firstName: "Hebel",
            lastName: "Hebel",
            specialization: "Endocrinologist",
            email: "hebel@hospital.com",
            phone: "+252-61-234-5678",
          },
          patient: {
            _id: "p1",
            name: "Amina Hassan",
            email: "amina@example.com",
            phone: "+252-61-987-6543",
          },
          notes: "Follow-up appointment for diabetes management. Patient should bring recent lab results.",
          type: "in-person",
          status: "scheduled",
          appointmentType: "Diabetes Consultation",
          meetingLink: null,
          cancelReason: null,
          doctorNotes: null,
          createdAt: "2025-05-10T00:00:00.000Z",
          updatedAt: "2025-05-10T00:00:00.000Z",
        }

        setAppointment(mockAppointment)
      } catch (error) {
        console.error("Error fetching appointment:", error)
        toast.error("Failed to load appointment details")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [id])

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Appointment cancelled successfully")
      setCancelModalOpen(false)

      // Update appointment status
      setAppointment((prev) => ({
        ...prev,
        status: "cancelled",
        cancelReason: cancelReason,
      }))
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Failed to cancel appointment")
    }
  }

  const handleReschedule = () => {
    navigate(`/admin/appointments/edit/${id}`)
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAppointment((prev) => ({
        ...prev,
        status: newStatus,
      }))

      toast.success(`Appointment ${newStatus} successfully`)
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast.error("Failed to update appointment status")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Appointment not found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">The appointment you're looking for doesn't exist.</p>
        <Link to="/admin/appointments" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to Appointments
        </Link>
      </div>
    )
  }

  const appointmentDate = new Date(appointment.date)
  const formattedDate = formatDate(appointment.date)
  const isPastAppointment = appointmentDate < new Date()

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📅</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{appointment.appointmentType}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Appointment Details & Management</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/appointments"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              ← Back to List
            </Link>

            {!isPastAppointment && appointment.status !== "cancelled" && (
              <>
                {appointment.status === "scheduled" && (
                  <button
                    onClick={() => handleStatusUpdate("confirmed")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Confirm
                  </button>
                )}

                {appointment.status !== "completed" && (
                  <button
                    onClick={() => handleStatusUpdate("completed")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✅ Mark Complete
                  </button>
                )}

                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📝 Reschedule
                </button>
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Appointment Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span>
            Appointment Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{appointment.type === "virtual" ? "💻" : "🏥"}</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {appointment.type === "virtual" ? "Virtual (Telemedicine)" : "In-Person"}
                </p>
              </div>
            </div>
            {appointment.type === "virtual" && appointment.meetingLink && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Link</p>
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Join Meeting
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>👨‍⚕️</span>
            Doctor Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👨‍⚕️</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏥</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Specialization</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.doctor.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.doctor.email}</p>
              </div>
            </div>
            {appointment.doctor.phone && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{appointment.doctor.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>👤</span>
          Patient Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{appointment.patient.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{appointment.patient.email}</p>
            </div>
          </div>
          {appointment.patient.phone && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.patient.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📝</span>
            Reason for Visit
          </h2>
          <p className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-900 dark:text-white">
            {appointment.reason}
          </p>
        </div>

        {appointment.notes && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              Additional Notes
            </h2>
            <p className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-gray-900 dark:text-white">
              {appointment.notes}
            </p>
          </div>
        )}

        {appointment.status === "cancelled" && appointment.cancelReason && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-red-200 dark:border-red-700">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center gap-2">
              <span>❌</span>
              Cancellation Reason
            </h2>
            <p className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
              {appointment.cancelReason}
            </p>
          </div>
        )}

        {appointment.status === "completed" && appointment.doctorNotes && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-green-200 dark:border-green-700">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center gap-2">
              <span>👨‍⚕️</span>
              Doctor's Notes
            </h2>
            <p className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-green-800 dark:text-green-200">
              {appointment.doctorNotes}
            </p>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>❌</span>
              Cancel Appointment
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Cancellation *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows="3"
                placeholder="Please provide a reason for cancelling this appointment..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetails
