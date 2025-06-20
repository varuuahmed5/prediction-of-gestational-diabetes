"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

// Mock data for when API fails
const MOCK_USERS = [
  {
    _id: "user1",
    firstName: "Ahmed",
    lastName: "Mohamed",
    email: "ahmed@example.com",
    role: "patient",
    verified: true,
    createdAt: "2025-04-15T08:30:00.000Z",
    lastLogin: "2025-06-10T14:22:00.000Z",
    active: true,
  },
  {
    _id: "user2",
    firstName: "Fatima",
    lastName: "Hassan",
    email: "fatima@example.com",
    role: "doctor",
    specialization: "Endocrinologist",
    verified: true,
    createdAt: "2025-04-20T10:15:00.000Z",
    lastLogin: "2025-06-12T09:45:00.000Z",
    active: true,
  },
  {
    _id: "user3",
    firstName: "Omar",
    lastName: "Abdi",
    email: "omar@example.com",
    role: "doctor",
    specialization: "General Practitioner",
    verified: true,
    createdAt: "2025-03-05T11:20:00.000Z",
    lastLogin: "2025-06-11T16:30:00.000Z",
    active: true,
  },
  {
    _id: "user4",
    firstName: "Amina",
    lastName: "Ali",
    email: "amina@example.com",
    role: "patient",
    verified: false,
    createdAt: "2023-05-18T14:10:00.000Z",
    lastLogin: null,
    active: true,
  },
  {
    _id: "user5",
    firstName: "Hassan",
    lastName: "Yusuf",
    email: "hassan@example.com",
    role: "patient",
    verified: true,
    createdAt: "2025-04-22T09:05:00.000Z",
    lastLogin: "2025-06-09T11:15:00.000Z",
    active: false,
  },
  {
    _id: "admin1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    verified: true,
    createdAt: "2025-02-01T00:00:00.000Z",
    lastLogin: "2025-06-12T08:00:00.000Z",
    active: true,
  },
]

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [useMockData, setUseMockData] = useState(true) // Default to mock data

  useEffect(() => {
    fetchUsers()
  }, [currentPage, roleFilter, sortBy, sortOrder])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Always use mock data for now
      console.log("Using mock user data")
      let filteredUsers = [...MOCK_USERS]

      // Apply filters
      if (roleFilter !== "all") {
        filteredUsers = filteredUsers.filter((user) => user.role === roleFilter)
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term),
        )
      }

      // Apply sorting
      filteredUsers.sort((a, b) => {
        let comparison = 0
        if (sortBy === "createdAt") {
          comparison = new Date(a.createdAt) - new Date(b.createdAt)
        } else if (sortBy === "name") {
          comparison = a.lastName.localeCompare(b.lastName)
        } else if (sortBy === "email") {
          comparison = a.email.localeCompare(b.email)
        } else if (sortBy === "lastLogin") {
          // Handle null lastLogin values
          if (!a.lastLogin) return 1
          if (!b.lastLogin) return -1
          comparison = new Date(a.lastLogin) - new Date(b.lastLogin)
        }
        return sortOrder === "asc" ? comparison : -comparison
      })

      setUsers(filteredUsers)
      setTotalPages(1) // Mock data is all on one page

      setTimeout(() => {
        setLoading(false)
      }, 500) // Simulate loading delay
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users. Using mock data instead.")

      // Switch to mock data on error
      if (!useMockData) {
        setUseMockData(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    fetchUsers()
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        // Mock delete
        setUsers(users.filter((user) => user._id !== id))
        toast.success("User deleted successfully")
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Failed to delete user")
      }
    }
  }

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      // Mock toggle status
      setUsers(users.map((user) => (user._id === id ? { ...user, active: !currentStatus } : user)))
      toast.success(`User ${currentStatus ? "deactivated" : "activated"} successfully`)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error("Failed to update user status")
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

  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "doctor":
        return "bg-green-100 text-green-800"
      case "patient":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && users.length === 0) {
    return <div className="text-center py-10">Loading users...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:opacity-90">Using Mock Data</button>
          <Link to="/admin/users/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add New User
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-l-md w-full md:w-64"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
              Search
            </button>
          </form>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("email")}
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("createdAt")}
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("lastLogin")}
                >
                  Last Login
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {user.firstName?.charAt(0) || ""}
                          {user.lastName?.charAt(0) || ""}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                        user.role,
                      )}`}
                    >
                      {user.role}
                    </span>
                    {user.specialization && <div className="text-xs text-gray-500 mt-1">{user.specialization}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.lastLogin)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => toggleUserStatus(user._id, user.active)}
                        className={`px-2 py-1 rounded text-xs ${
                          user.active
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement