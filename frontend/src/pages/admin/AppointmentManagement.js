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

// Mock data for when API fails
const MOCK_APPOINTMENTS = [
  {
    _id: "app1",
    user: { _id: "user1", firstName: "Ahmed", lastName: "Mohamed", email: "ahmed@example.com" },
    doctor: { _id: "doc1", firstName: "Fatima", lastName: "Hassan", specialization: "Endocrinologist" },
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    time: "10:00 AM",
    type: "virtual",
    status: "scheduled",
    reason: "Diabetes checkup",
    notes: "First appointment"
  },
  {
    _id: "app2",
    user: { _id: "user2", firstName: "Amina", lastName: "Ali", email: "amina@example.com" },
    doctor: { _id: "doc2", firstName: "Omar", lastName: "Abdi", specialization: "General Practitioner" },
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    time: "2:30 PM",
    type: "in-person",
    status: "scheduled",
    reason: "Follow-up appointment",
    notes: "Blood test results review"
  },
  {
    _id: "app3",
    user: { _id: "user3", firstName: "Hassan", lastName: "Yusuf", email: "hassan@example.com" },
    doctor: { _id: "doc1", firstName: "Fatima", lastName: "Hassan", specialization: "Endocrinologist" },
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    time: "11:15 AM",
    type: "virtual",
    status: "completed",
    reason: "Medication review",
    notes: "Adjusted insulin dosage"
  },
  {
    _id: "app4",
    user: { _id: "user4", firstName: "Sahra", lastName: "Mohamed", email: "sahra@example.com" },
    doctor: { _id: "doc3", firstName: "Abdirahman", lastName: "Sheikh", specialization: "Nutritionist" },
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    time: "3:00 PM",
    type: "in-person",
    status: "cancelled",
    reason: "Diet consultation",
    notes: "Patient cancelled due to emergency"
  },
  {
    _id: "app5",
    user: { _id: "user5", firstName: "Fartun", lastName: "Jama", email: "fartun@example.com" },
    doctor: { _id: "doc2", firstName: "Omar", lastName: "Abdi", specialization: "General Practitioner" },
    date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    time: "9:45 AM",
    type: "virtual",
    status: "scheduled",
    reason: "Initial consultation",
    notes: "New patient"
  }
];

const MOCK_DOCTORS = [
  { _id: "doc1", firstName: "Fatima", lastName: "Hassan", specialization: "Endocrinologist" },
  { _id: "doc2", firstName: "Omar", lastName: "Abdi", specialization: "General Practitioner" },
  { _id: "doc3", firstName: "Abdirahman", lastName: "Sheikh", specialization: "Nutritionist" },
  { _id: "doc4", firstName: "Maryam", lastName: "Ali", specialization: "Cardiologist" }
];

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'scheduled', 'completed', 'cancelled'
  const [sortBy, setSortBy] = useState("date") // 'date', 'user', 'doctor', 'status'
  const [sortOrder, setSortOrder] = useState("asc") // 'asc', 'desc'
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [currentPage, filter, sortBy, sortOrder, selectedDoctor, useMockData])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      
      if (useMockData) {
        // Use mock data
        console.log("Using mock appointment data")
        let filteredAppointments = [...MOCK_APPOINTMENTS]
        
        // Apply filters
        if (filter !== "all") {
          filteredAppointments = filteredAppointments.filter(app => app.status === filter)
        }
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          filteredAppointments = filteredAppointments.filter(app => 
            app.user.firstName.toLowerCase().includes(term) || 
            app.user.lastName.toLowerCase().includes(term) ||
            app.user.email.toLowerCase().includes(term)
          )
        }
        
        if (selectedDoctor) {
          filteredAppointments = filteredAppointments.filter(app => app.doctor._id === selectedDoctor)
        }
        
        // Apply sorting
        filteredAppointments.sort((a, b) => {
          let comparison = 0
          if (sortBy === 'date') {
            comparison = new Date(a.date) - new Date(b.date)
          } else if (sortBy === 'user') {
            comparison = a.user.lastName.localeCompare(b.user.lastName)
          } else if (sortBy === 'doctor') {
            comparison = a.doctor.lastName.localeCompare(b.doctor.lastName)
          } else if (sortBy === 'status') {
            comparison = a.status.localeCompare(b.status)
          }
          return sortOrder === 'asc' ? comparison : -comparison
        })
        
        setAppointments(filteredAppointments)
        setTotalPages(1) // Mock data is all on one page
        
        setTimeout(() => {
          setLoading(false)
        }, 500) // Simulate loading delay
        
        return
      }
      
      // Real API call
      const response = await api.get("/admin/appointments", {
        params: {
          page: currentPage,
          limit: 10,
          status: filter !== "all" ? filter : undefined,
          sort: sortBy,
          order: sortOrder,
          search: searchTerm,
          doctor: selectedDoctor || undefined,
        },
      })

      setAppointments(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments. Using mock data instead.")
      
      // Switch to mock data on error
      if (!useMockData) {
        setUseMockData(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      if (useMockData) {
        console.log("Using mock doctor data")
        setDoctors(MOCK_DOCTORS)
        return
      }
      
      const response = await api.get("/admin/doctors")
      setDoctors(response.data.data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
      
      // Use mock doctors on error
      if (!useMockData) {
        setDoctors(MOCK_DOCTORS)
        setUseMockData(true)
      }
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchAppointments()
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        if (useMockData) {
          // Mock delete
          setAppointments(appointments.filter(app => app._id !== id))
          toast.success("Appointment deleted successfully")
          return
        }
        
        await api.delete(`/admin/appointments/${id}`)
        toast.success("Appointment deleted successfully")
        fetchAppointments()
      } catch (error) {
        console.error("Error deleting appointment:", error)
        toast.error("Failed to delete appointment")
        
        if (!useMockData) {
          // Switch to mock data on error
          setUseMockData(true)
          // Mock delete anyway for better UX
          setAppointments(appointments.filter(app => app._id !== id))
        }
      }
    }
  }

  const handleExport = async () => {
    try {
      if (useMockData) {
        toast.info("Export functionality is not available in mock mode")
        return
      }
      
      const response = await api.get("/export/appointments", {
        responseType: "blob",
        params: {
          status: filter !== "all" ? filter : undefined,
          search: searchTerm,
          doctor: selectedDoctor || undefined,
        },
      })

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `appointments-export-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success("Appointments exported successfully")
    } catch (error) {
      console.error("Error exporting appointments:", error)
      toast.error("Failed to export appointments")
    }
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleMockData = () => {
    setUseMockData(!useMockData)
    toast.info(useMockData ? "Switching to API data" : "Switching to mock data")
  }

  if (loading && appointments.length === 0) {
    return <div className="text-center py-10">Loading appointments...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={toggleMockData} 
            className={`px-4 py-2 ${useMockData ? 'bg-yellow-600' : 'bg-purple-600'} text-white rounded-md hover:opacity-90`}
          >
            {useMockData ? "Using Mock Data" : "Using API Data"}
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Export to CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search by patient name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-l-md w-full md:w-64"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value)
                setCurrentPage(1)
              }}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
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
                  Patient
                  {sortBy === "user" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("doctor")}
                >
                  Doctor
                  {sortBy === "doctor" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("date")}
                >
                  Date & Time
                  {sortBy === "date" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("status")}
                >
                  Status
                  {sortBy === "status" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
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
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.user.firstName} {appointment.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{appointment.doctor.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.type === "virtual" ? "Virtual" : "In-Person"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/appointments/${appointment._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    <button onClick={() => handleDelete(appointment._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No appointments found</p>
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

export default AppointmentManagement
