"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"

const AppointmentForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams() // For editing existing appointment
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState([])

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    doctor: "",
    notes: "",
    type: "in-person", // 'in-person' or 'virtual'
  })

  useEffect(() => {
    // Mock doctors data - replace with real API call
    const mockDoctors = [
      {
        _id: "1",
        firstName: "Hebel",
        lastName: "Hebel",
        specialization: "Cardiologist",
        email: "hebel@hospital.com",
        phone: "+252-61-234-5678",
      },
      {
        _id: "2",
        firstName: "Fariha",
        lastName: "Nur",
        specialization: "Endocrinologist",
        email: "fariha@hospital.com",
        phone: "+252-61-234-5679",
      },
      {
        _id: "3",
        firstName: "Ali",
        lastName: "Warsame",
        specialization: "Neurologist",
        email: "ali@hospital.com",
        phone: "+252-61-234-5680",
      },
      {
        _id: "4",
        firstName: "Amina",
        lastName: "Hassan",
        specialization: "Gynecologist",
        email: "amina@hospital.com",
        phone: "+252-61-234-5681",
      },
      {
        _id: "5",
        firstName: "Omar",
        lastName: "Abdi",
        specialization: "General Practitioner",
        email: "omar@hospital.com",
        phone: "+252-61-234-5682",
      },
    ]

    setDoctors(mockDoctors)

    // If editing an existing appointment, fetch its data
    if (id) {
      const fetchAppointment = async () => {
        try {
          setLoading(true)

          // Try real API first, fallback to mock data
          const mockAppointment = {
            _id: id,
            date: "2024-01-15",
            time: "10:00",
            reason: "Regular checkup",
            doctor: { _id: "1" },
            notes: "Follow-up appointment",
            type: "in-person",
            status: "scheduled",
          }

          // Format date for the input field (YYYY-MM-DD)
          const appointmentDate = new Date(mockAppointment.date)
          const formattedDate = appointmentDate.toISOString().split("T")[0]

          setFormData({
            date: formattedDate,
            time: mockAppointment.time,
            reason: mockAppointment.reason,
            doctor: mockAppointment.doctor._id,
            notes: mockAppointment.notes || "",
            type: mockAppointment.type,
          })
          setLoading(false)
        } catch (error) {
          console.error("Error fetching appointment:", error)
          toast.error("Failed to load appointment details")
          setLoading(false)
        }
      }

      fetchAppointment()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (id) {
        // Update existing appointment
        toast.success("Appointment updated successfully")
      } else {
        // Create new appointment
        toast.success("Appointment scheduled successfully")
      }
      navigate("/admin/appointments")
    } catch (error) {
      console.error("Error saving appointment:", error)
      toast.error("Failed to save appointment")
    } finally {
      setLoading(false)
    }
  }

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {id ? "Edit Appointment" : "Schedule New Appointment"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {id ? "Update appointment details" : "Book a new appointment with our doctors"}
            </p>
          </div>
          <div className="text-4xl">📅</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📅 Appointment Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🕐 Appointment Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏥 Appointment Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="in-person">🏥 In-Person Visit</option>
              <option value="virtual">💻 Virtual (Telemedicine)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">👨‍⚕️ Select Doctor</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📝 Reason for Visit
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="Please describe the reason for your appointment..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📋 Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="Any additional information or special requests..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/appointments")}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span>{id ? "📝" : "📅"}</span>
                  {id ? "Update Appointment" : "Schedule Appointment"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppointmentForm
