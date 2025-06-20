import User from "../models/userModel.js"
import Prediction from "../models/predictionModel.js"
import Appointment from "../models/appointmentModel.js"
import SavedReport from "../models/savedReportModel.js"
import Notification from "../models/notificationModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"
export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: "doctor" }) // role: doctor waa muhiim
    res.status(200).json({
      status: "success",
      data: {
        doctors,
      },
    })
  } catch (error) {
    console.error("❌ Failed to fetch doctors:", error.message)
    res.status(500).json({
      status: "error",
      message: "Failed to load doctors",
    })
  }
}

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find() // Make sure MongoDB is connected!
    res.status(200).json({
      status: "success",
      data: users,
    })
  } catch (err) {
    console.error("❌ Error in getAllUsers:", err)
    res.status(500).json({ status: "fail", message: "Server error" })
  }
}


// Get a single user (admin only)
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+active")

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

// Create a new user (admin only)
export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    verified: true, // Admin-created users are automatically verified
  })

  

  // Remove password from output
  newUser.password = undefined

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  })
})

// Update a user (admin only)
export const updateUser = catchAsync(async (req, res, next) => {
  // Don't allow password updates through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /update-password.", 400))
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("+active")

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

// Delete a user (admin only)
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new AppError("No user found with that ID", 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Get dashboard statistics (admin only)
export const getDashboardStats = catchAsync(async (req, res, next) => {
  // Get user statistics
  const totalUsers = await User.countDocuments()
  const newUsers = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  })
  const activeUsers = await User.countDocuments({ active: true })
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ])

  // Get prediction statistics
  const totalPredictions = await Prediction.countDocuments()
  const newPredictions = await Prediction.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  })
  const predictionsByResult = await Prediction.aggregate([
    {
      $group: {
        _id: "$result.prediction",
        count: { $sum: 1 },
      },
    },
  ])
  const predictionsByRisk = await Prediction.aggregate([
    {
      $group: {
        _id: "$result.riskLevel",
        count: { $sum: 1 },
      },
    },
  ])

  // Get appointment statistics
  const totalAppointments = await Appointment.countDocuments()
  const upcomingAppointments = await Appointment.countDocuments({
    date: { $gte: new Date() },
    status: { $in: ["scheduled", "confirmed"] },
  })
  const appointmentsByStatus = await Appointment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  // Get report statistics
  const totalReports = await SavedReport.countDocuments()
  const publicReports = await SavedReport.countDocuments({ isPublic: true })

  // Get recent activity
  const recentPredictions = await Prediction.find()
    .populate({
      path: "user",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .limit(5)

  const recentAppointments = await Appointment.find()
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "doctor",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .limit(5)

  res.status(200).json({
    status: "success",
    data: {
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        byRole: usersByRole,
      },
      predictions: {
        total: totalPredictions,
        new: newPredictions,
        byResult: predictionsByResult,
        byRisk: predictionsByRisk,
      },
      appointments: {
        total: totalAppointments,
        upcoming: upcomingAppointments,
        byStatus: appointmentsByStatus,
      },
      reports: {
        total: totalReports,
        public: publicReports,
      },
      recentActivity: {
        predictions: recentPredictions,
        appointments: recentAppointments,
      },
    },
  })
})

// Send notification to users (admin only)
export const sendNotification = catchAsync(async (req, res, next) => {
  const { recipients, title, message, priority, link } = req.body

  if (!recipients || !title || !message) {
    return next(new AppError("Recipients, title, and message are required", 400))
  }

  let users = []

  // If recipients is 'all', send to all users
  if (recipients === "all") {
    users = await User.find().select("_id")
  }
  // If recipients is a role, send to all users with that role
  else if (["user", "admin", "doctor"].includes(recipients)) {
    users = await User.find({ role: recipients }).select("_id")
  }
  // If recipients is an array of user IDs, send to those users
  else if (Array.isArray(recipients)) {
    users = await User.find({ _id: { $in: recipients } }).select("_id")
  } else {
    return next(new AppError("Invalid recipients format", 400))
  }

  // Create notifications for each user
  const notifications = []
  for (const user of users) {
    const notification = await Notification.createNotification(user._id, "system_alert", title, message, {
      priority: priority || "normal",
      link,
    })
    notifications.push(notification)
  }

  res.status(201).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  })
})
