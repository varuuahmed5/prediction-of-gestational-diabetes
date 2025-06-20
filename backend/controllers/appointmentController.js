import Appointment from "../models/appointmentModel.js"
import User from "../models/userModel.js"
import Notification from "../models/notificationModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"
import { sendEmail } from "../utils/email.js"
import { sendSMS } from "../utils/sms.js"


// Create a new appointment
export const createAppointment = catchAsync(async (req, res, next) => {
  
  // Add user to request body
  req.body.user = req.user.id

  // Validate required fields
  if (!req.body.date || !req.body.time || !req.body.reason) {
    return next(new AppError("Date, time, and reason are required fields", 400))
  }

  // Check if doctor exists if provided
  if (req.body.doctor) {
    const doctor = await User.findOne({
      _id: req.body.doctor,
      role: "doctor",
    })
    if (!doctor) {
      return next(new AppError("No doctor found with that ID", 404))
    }

    // Check for appointment conflicts
    const hasConflict = await Appointment.checkConflict(
      req.body.doctor,
      req.body.date,
      req.body.time.start,
      req.body.time.end,
    )
    if (hasConflict) {
      return next(new AppError("The doctor is not available at the selected time. Please choose another time.", 400))
    }
  }

  // Create appointment
  const appointment = await Appointment.create(req.body)

  // Create notification for user
  await Notification.createNotification(
    req.user.id,
    "appointment_confirmation",
    "Appointment Scheduled",
    `Your appointment has been scheduled for ${new Date(
      appointment.date,
    ).toLocaleDateString()} at ${appointment.time.start}.`,
    {
      priority: "high",
      link: `/appointment/${appointment._id}`,
      relatedModel: "Appointment",
      relatedId: appointment._id,
    },
  )

  // Create notification for doctor if assigned
  if (appointment.doctor) {
    await Notification.createNotification(
      appointment.doctor,
      "appointment_confirmation",
      "New Appointment",
      `A new appointment has been scheduled with you for ${new Date(
        appointment.date,
      ).toLocaleDateString()} at ${appointment.time.start}.`,
      {
        priority: "high",
        link: `/appointment/${appointment._id}`,
        relatedModel: "Appointment",
        relatedId: appointment._id,
      },
    )
  }

  // Send email confirmation
  try {
    const user = await User.findById(req.user.id)
    if (user && user.email) {
      await sendEmail({
        email: user.email,
        subject: "Appointment Confirmation",
        message: `Your appointment has been scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${
          appointment.time.start
        }. Please arrive 15 minutes early.`,
      })
    }
  } catch (err) {
    console.error("Error sending email:", err)
    // Don't stop the process if email fails
  }

  // Send SMS confirmation if phone number is available
  try {
    const user = await User.findById(req.user.id)
    if (user && user.phoneNumber) {
      await sendSMS({
        to: user.phoneNumber,
        body: `Your appointment has been scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${
          appointment.time.start
        }. Please arrive 15 minutes early.`,
      })
    }
  } catch (err) {
    console.error("Error sending SMS:", err)
    // Don't stop the process if SMS fails
  }

  res.status(201).json({
    status: "success",
    data: {
      appointment,
    },
  })
})

// Get all appointments for current user
export const getUserAppointments = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { user: req.user.id }

  // Add filters if provided
  if (req.query.status) {
    query.status = req.query.status
  }

  if (req.query.type) {
    query.type = req.query.type
  }

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    }
  } else if (req.query.startDate) {
    query.date = { $gte: new Date(req.query.startDate) }
  } else if (req.query.endDate) {
    query.date = { $lte: new Date(req.query.endDate) }
  }

  // Execute query with pagination
  const appointments = await Appointment.find(query)
    .populate({
      path: "doctor",
      select: "name",
    })
    .sort({ date: 1, "time.start": 1 })
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Appointment.countDocuments(query)

  res.status(200).json({
    status: "success",
    results: appointments.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: {
      appointments,
    },
  })
})

// Get a single appointment
export const getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: "user",
      select: "name email phoneNumber",
    })
    .populate({
      path: "doctor",
      select: "name email",
    })

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404))
  }

  // Check if user is authorized to view this appointment
  if (
    appointment.user._id.toString() !== req.user.id &&
    appointment.doctor?._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not authorized to view this appointment", 403))
  }

  res.status(200).json({
    status: "success",
    data: {
      appointment,
    },
  })
})

// Update an appointment
export const updateAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404))
  }

  // Check if user is authorized to update this appointment
  if (
    appointment.user.toString() !== req.user.id &&
    appointment.doctor?.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not authorized to update this appointment", 403))
  }

  // Check for appointment conflicts if date or time is being updated
  if ((req.body.date || req.body.time) && appointment.doctor && appointment.status !== "cancelled") {
    const hasConflict = await Appointment.checkConflict(
      appointment.doctor,
      req.body.date || appointment.date,
      req.body.time?.start || appointment.time.start,
      req.body.time?.end || appointment.time.end,
      appointment._id,
    )
    if (hasConflict) {
      return next(new AppError("The doctor is not available at the selected time. Please choose another time.", 400))
    }
  }

  // Handle cancellation
  if (req.body.status === "cancelled" && appointment.status !== "cancelled") {
    req.body.cancelledBy = req.user.id
    req.body.cancelledAt = Date.now()

    // Create notification for user
    await Notification.createNotification(
      appointment.user,
      "appointment_cancellation",
      "Appointment Cancelled",
      `Your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${
        appointment.time.start
      } has been cancelled.`,
      {
        priority: "high",
        link: `/appointment/${appointment._id}`,
        relatedModel: "Appointment",
        relatedId: appointment._id,
      },
    )

    // Create notification for doctor if assigned
    if (appointment.doctor) {
      await Notification.createNotification(
        appointment.doctor,
        "appointment_cancellation",
        "Appointment Cancelled",
        `The appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${
          appointment.time.start
        } has been cancelled.`,
        {
          priority: "high",
          link: `/appointment/${appointment._id}`,
          relatedModel: "Appointment",
          relatedId: appointment._id,
        },
      )
    }
  }

  // Update appointment
  const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      appointment: updatedAppointment,
    },
  })
})

// Delete an appointment
export const deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404))
  }

  // Check if user is authorized to delete this appointment
  if (appointment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not authorized to delete this appointment", 403))
  }

  await Appointment.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Get all appointments (admin or doctor only)
export const getAllAppointments = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = {}

  // If doctor, only show their appointments
  if (req.user.role === "doctor") {
    query.doctor = req.user.id
  }

  // Add filters if provided
  if (req.query.user) {
    query.user = req.query.user
  }

  if (req.query.doctor) {
    query.doctor = req.query.doctor
  }

  if (req.query.status) {
    query.status = req.query.status
  }

  if (req.query.type) {
    query.type = req.query.type
  }

  if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    }
  } else if (req.query.startDate) {
    query.date = { $gte: new Date(req.query.startDate) }
  } else if (req.query.endDate) {
    query.date = { $lte: new Date(req.query.endDate) }
  }

  // Execute query with pagination
  const appointments = await Appointment.find(query)
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "doctor",
      select: "name email",
    })
    .sort({ date: 1, "time.start": 1 })
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Appointment.countDocuments(query)

  res.status(200).json({
    status: "success",
    results: appointments.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: {
      appointments,
    },
  })
})

// Get available time slots for a doctor
export const getAvailableTimeSlots = catchAsync(async (req, res, next) => {
  const { doctorId, date } = req.query

  if (!doctorId || !date) {
    return next(new AppError("Doctor ID and date are required parameters", 400))
  }

  // Check if doctor exists
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  })
  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404))
  }

  // Get all appointments for the doctor on the specified date
  const appointmentDate = new Date(date)
  appointmentDate.setHours(0, 0, 0, 0)

  const nextDay = new Date(appointmentDate)
  nextDay.setDate(nextDay.getDate() + 1)

  const appointments = await Appointment.find({
    doctor: doctorId,
    date: {
      $gte: appointmentDate,
      $lt: nextDay,
    },
    status: { $nin: ["cancelled", "no-show"] },
  }).select("time")

  // Define available time slots (9 AM to 5 PM, 30-minute intervals)
  const timeSlots = []
  const startHour = 9
  const endHour = 17
  const intervalMinutes = 30

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      const endHourValue = minute + intervalMinutes >= 60 ? hour + 1 : hour
      const endMinuteValue = (minute + intervalMinutes) % 60
      const endTime = `${endHourValue.toString().padStart(2, "0")}:${endMinuteValue.toString().padStart(2, "0")}`

      // Check if this time slot conflicts with any existing appointment
      const isAvailable = !appointments.some((appointment) => {
        const apptStartParts = appointment.time.start.split(":")
        const apptEndParts = appointment.time.end.split(":")

        const apptStartMinutes = Number.parseInt(apptStartParts[0]) * 60 + Number.parseInt(apptStartParts[1])
        const apptEndMinutes = Number.parseInt(apptEndParts[0]) * 60 + Number.parseInt(apptEndParts[1])

        const slotStartMinutes = hour * 60 + minute
        const slotEndMinutes = endHourValue * 60 + endMinuteValue

        return (
          (slotStartMinutes >= apptStartMinutes && slotStartMinutes < apptEndMinutes) ||
          (slotEndMinutes > apptStartMinutes && slotEndMinutes <= apptEndMinutes) ||
          (slotStartMinutes <= apptStartMinutes && slotEndMinutes >= apptEndMinutes)
        )
      })

      if (isAvailable) {
        timeSlots.push({
          start: startTime,
          end: endTime,
        })
      }
    }
  }

  res.status(200).json({
    status: "success",
    results: timeSlots.length,
    data: {
      date: appointmentDate,
      timeSlots,
    },
  })
})
