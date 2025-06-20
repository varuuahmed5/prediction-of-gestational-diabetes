import Notification from "../models/notificationModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"

// Get all notifications for current user
export const getUserNotifications = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { recipient: req.user.id }

  // Add filters if provided
  if (req.query.read !== undefined) {
    query.read = req.query.read === "true"
  }

  if (req.query.type) {
    query.type = req.query.type
  }

  if (req.query.priority) {
    query.priority = req.query.priority
  }

  // Execute query with pagination
  const notifications = await Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

  // Get total count for pagination
  const total = await Notification.countDocuments(query)

  // Get unread count
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    read: false,
  })

  res.status(200).json({
    status: "success",
    results: notifications.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    unreadCount,
    data: {
      notifications,
    },
  })
})

// Mark notification as read
export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return next(new AppError("No notification found with that ID", 404))
  }

  // Check if user is authorized to mark this notification as read
  if (notification.recipient.toString() !== req.user.id) {
    return next(new AppError("You are not authorized to mark this notification as read", 403))
  }

  notification.read = true
  notification.readAt = Date.now()
  await notification.save()

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  })
})

// Mark all notifications as read
export const markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true, readAt: Date.now() })

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  })
})

// Delete a notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return next(new AppError("No notification found with that ID", 404))
  }

  // Check if user is authorized to delete this notification
  if (notification.recipient.toString() !== req.user.id) {
    return next(new AppError("You are not authorized to delete this notification", 403))
  }

  await Notification.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Delete all read notifications
export const deleteAllRead = catchAsync(async (req, res, next) => {
  await Notification.deleteMany({
    recipient: req.user.id,
    read: true,
  })

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Get unread count
export const getUnreadCount = catchAsync(async (req, res, next) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    read: false,
  })

  res.status(200).json({
    status: "success",
    data: {
      unreadCount,
    },
  })
})
