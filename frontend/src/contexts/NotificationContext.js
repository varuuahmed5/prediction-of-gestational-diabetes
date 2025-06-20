"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "./AuthContext"
import api from "../services/api"

const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()

      // Set up polling for new notifications every minute
      const interval = setInterval(fetchNotifications, 60000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const response = await api.get("/notifications?limit=10")

      // Ensure we have an array of notifications
      const notificationsData = response.data.data?.notifications || response.data.data || []

      // Make sure it's an array
      if (Array.isArray(notificationsData)) {
        setNotifications(notificationsData)
        setUnreadCount(response.data.unreadCount || 0)
        setError(null)
      } else {
        console.error("Notifications data is not an array:", notificationsData)
        setNotifications([])
        setError("Invalid notifications data format")
      }
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError("Failed to fetch notifications")
      setNotifications([]) // Ensure notifications is an array even on error
    } finally {
      setLoading(false)
    }
  }

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    setLoading(true)
    try {
      await api.patch(`/notifications/${notificationId}/read`)

      // Update local state
      setNotifications((prevNotifications) =>
        Array.isArray(prevNotifications)
          ? prevNotifications.map((notification) =>
              notification._id === notificationId ? { ...notification, read: true } : notification,
            )
          : [],
      )

      setUnreadCount((prevCount) => Math.max(0, prevCount - 1))
      setError(null)
    } catch (err) {
      console.error("Error marking notification as read:", err)
      setError("Failed to mark notification as read")
      toast.error("Failed to mark notification as read")
    } finally {
      setLoading(false)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setLoading(true)
    try {
      await api.patch("/notifications/mark-all-read")

      // Update local state
      setNotifications((prevNotifications) =>
        Array.isArray(prevNotifications)
          ? prevNotifications.map((notification) => ({ ...notification, read: true }))
          : [],
      )

      setUnreadCount(0)
      setError(null)
      toast.success("All notifications marked as read")
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      setError("Failed to mark all notifications as read")
      toast.error("Failed to mark all notifications as read")
    } finally {
      setLoading(false)
    }
  }

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    setLoading(true)
    try {
      await api.delete(`/notifications/${notificationId}`)

      // Update local state
      const updatedNotifications = Array.isArray(notifications)
        ? notifications.filter((notification) => notification._id !== notificationId)
        : []

      setNotifications(updatedNotifications)

      // Update unread count if the deleted notification was unread
      if (Array.isArray(notifications)) {
        const wasUnread = notifications.find(
          (notification) => notification._id === notificationId && !notification.read,
        )
        if (wasUnread) {
          setUnreadCount((prevCount) => Math.max(0, prevCount - 1))
        }
      }

      setError(null)
      toast.success("Notification deleted successfully")
    } catch (err) {
      console.error("Error deleting notification:", err)
      setError("Failed to delete notification")
      toast.error("Failed to delete notification")
    } finally {
      setLoading(false)
    }
  }

  // Delete all read notifications
  const deleteAllRead = async () => {
    setLoading(true)
    try {
      await api.delete("/notifications/read")

      // Update local state
      const updatedNotifications = Array.isArray(notifications)
        ? notifications.filter((notification) => !notification.read)
        : []

      setNotifications(updatedNotifications)
      setError(null)
      toast.success("All read notifications deleted successfully")
    } catch (err) {
      console.error("Error deleting read notifications:", err)
      setError("Failed to delete read notifications")
      toast.error("Failed to delete read notifications")
    } finally {
      setLoading(false)
    }
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
