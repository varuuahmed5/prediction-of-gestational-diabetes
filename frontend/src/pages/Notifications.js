"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { toast } from "react-toastify"

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years ago"

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months ago"

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days ago"

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours ago"

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes ago"

  return Math.floor(seconds) + " seconds ago"
}

const Notifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // 'all', 'unread', 'read'
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get("/notifications")

      // Ensure we have an array of notifications
      const notificationsData = response.data.data?.notifications || response.data.data || []

      // Make sure it's an array
      if (Array.isArray(notificationsData)) {
        setNotifications(notificationsData)
      } else {
        console.error("Notifications data is not an array:", notificationsData)
        setNotifications([])
        setError("Invalid notifications data format")
        toast.error("Failed to load notifications: Invalid data format")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
      setError("Failed to load notifications")
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to update notification")
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read")

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true })),
      )

      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to update notifications")
    }
  }

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`)

      // Update local state
      setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification._id !== id))

      toast.success("Notification deleted")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const clearAllNotifications = async () => {
    try {
      await api.delete("/notifications")
      setNotifications([])
      toast.success("All notifications cleared")
    } catch (error) {
      console.error("Error clearing notifications:", error)
      toast.error("Failed to clear notifications")
    }
  }

  // Ensure notifications is an array before filtering
  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        if (filter === "all") return true
        if (filter === "unread") return !notification.read
        if (filter === "read") return notification.read
        return true
      })
    : []

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "prediction":
        return `/predictions/${notification.reference}`
      case "appointment":
        return `/appointments/${notification.reference}`
      case "report":
        return `/reports/${notification.reference}`
      case "system":
      default:
        return "#"
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "prediction":
        return "📊"
      case "appointment":
        return "📅"
      case "report":
        return "📝"
      case "system":
        return "⚙️"
      default:
        return "🔔"
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading notifications...</div>
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-10 bg-red-50 rounded-lg">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!notifications.some((n) => !n.read)}
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-md ${
              filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-md ${
              filter === "read" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No notifications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border ${notification.read ? "bg-white" : "bg-blue-50"}`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-4">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    <div className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</div>
                  </div>
                  <p className="text-gray-700 my-2">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {notification.reference && (
                        <Link
                          to={getNotificationLink(notification)}
                          className="text-blue-600 hover:underline mr-4"
                          onClick={() => !notification.read && markAsRead(notification._id)}
                        >
                          View Details
                        </Link>
                      )}
                      {!notification.read && (
                        <button onClick={() => markAsRead(notification._id)} className="text-green-600 hover:underline">
                          Mark as Read
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
