"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
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
        const response = await api.get(`/appointments/${id}`)
        setAppointment(response.data.data)
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
    try {
      await api.patch(`/appointments/${id}/cancel`, { cancelReason })
      toast.success("Appointment cancelled successfully")
      setCancelModalOpen(false)

      // Refresh appointment data
      const response = await api.get(`/appointments/${id}`)
      setAppointment(response.data.data)
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Failed to cancel appointment")
    }
  }

  const handleReschedule = () => {
    navigate(`/appointments/edit/${id}`)
  }

  if (loading) {
    return <div className="text-center py-10">Loading appointment details...</div>
  }

  if (!appointment) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4">Appointment not found</p>
        <Link to="/appointments" className="text-blue-600 hover:underline">
          Back to Appointments
        </Link>
      </div>
    )
  }

  const appointmentDate = new Date(appointment.date)
  const formattedDate = formatDate(appointment.date)
  const isPastAppointment = appointmentDate < new Date()

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment Details</h1>
        <div className="flex space-x-2">
          <Link to="/appointments" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Back to Appointments
          </Link>

          {!isPastAppointment && appointment.status !== "cancelled" && (
            <>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reschedule
              </button>
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Appointment Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Status: </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    appointment.status === "scheduled"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : appointment.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              <div>
                <span className="font-medium">Date: </span>
                <span>{formattedDate}</span>
              </div>
              <div>
                <span className="font-medium">Time: </span>
                <span>{appointment.time}</span>
              </div>
              <div>
                <span className="font-medium">Type: </span>
                <span>{appointment.type === "virtual" ? "Virtual (Telemedicine)" : "In-Person"}</span>
              </div>
              {appointment.type === "virtual" && appointment.meetingLink && (
                <div>
                  <span className="font-medium">Meeting Link: </span>
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Doctor Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Doctor: </span>
                <span>
                  Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                </span>
              </div>
              <div>
                <span className="font-medium">Specialization: </span>
                <span>{appointment.doctor.specialization}</span>
              </div>
              <div>
                <span className="font-medium">Email: </span>
                <span>{appointment.doctor.email}</span>
              </div>
              {appointment.doctor.phone && (
                <div>
                  <span className="font-medium">Phone: </span>
                  <span>{appointment.doctor.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Reason for Visit</h2>
          <p className="bg-gray-50 p-4 rounded-md">{appointment.reason}</p>
        </div>

        {appointment.notes && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Additional Notes</h2>
            <p className="bg-gray-50 p-4 rounded-md">{appointment.notes}</p>
          </div>
        )}

        {appointment.status === "cancelled" && appointment.cancelReason && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Cancellation Reason</h2>
            <p className="bg-red-50 p-4 rounded-md text-red-800">{appointment.cancelReason}</p>
          </div>
        )}

        {appointment.status === "completed" && appointment.doctorNotes && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Doctor's Notes</h2>
            <p className="bg-blue-50 p-4 rounded-md">{appointment.doctorNotes}</p>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Cancel Appointment</h2>
            <p className="mb-4">Are you sure you want to cancel this appointment?</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                No, Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetails
