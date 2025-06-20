"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
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
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/admin/doctors")
        setDoctors(response.data.data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        toast.error("Failed to load doctors")
      }
    }

    fetchDoctors()

    // If editing an existing appointment, fetch its data
    if (id) {
      const fetchAppointment = async () => {
        try {
          setLoading(true)
          const response = await api.get(`/appointments/${id}`)
          const appointment = response.data.data

          // Format date for the input field (YYYY-MM-DD)
          const appointmentDate = new Date(appointment.date)
          const formattedDate = appointmentDate.toISOString().split("T")[0]

          setFormData({
            date: formattedDate,
            time: appointment.time,
            reason: appointment.reason,
            doctor: appointment.doctor._id,
            notes: appointment.notes || "",
            type: appointment.type,
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
      if (id) {
        // Update existing appointment
        await api.patch(`/appointments/${id}`, formData)
        toast.success("Appointment updated successfully")
      } else {
        // Create new appointment
        await api.post("/appointments", formData)
        toast.success("Appointment scheduled successfully")
      }
      navigate("/appointments")
    } catch (error) {
      console.error("Error saving appointment:", error)
      toast.error(error.response?.data?.message || "Failed to save appointment")
    } finally {
      setLoading(false)
    }
  }

  if (loading && id) {
    return <div className="text-center py-10">Loading appointment details...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{id ? "Edit Appointment" : "Schedule New Appointment"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="in-person">In-Person</option>
            <option value="virtual">Virtual (Telemedicine)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
          <select
  name="doctor"
  value={formData.doctor}
  onChange={handleChange}
  className="w-full p-2 border border-gray-300 rounded-md"
  required
>
  <option value="">Select a doctor</option>
  <option value="1">Dr. Hebel Hebel - Cardiologist</option>
  <option value="2">Dr. Fariha Nur - Endocrinologist</option>
  <option value="3">Dr. Ali Warsame - Neurologist</option>
</select>

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/appointments")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : id ? "Update Appointment" : "Schedule Appointment"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AppointmentForm
