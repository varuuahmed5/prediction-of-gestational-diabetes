import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Appointment must belong to a user"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    time: {
      start: {
        type: String,
        required: [true, "Start time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time format (HH:MM)"],
      },
      end: {
        type: String,
        required: [true, "End time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time format (HH:MM)"],
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed", "no-show"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["consultation", "follow-up", "test", "other"],
      default: "consultation",
    },
    reason: {
      type: String,
      required: [true, "Appointment reason is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: "Main Clinic",
      trim: true,
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "sms", "app"],
        },
        sentAt: Date,
        status: {
          type: String,
          enum: ["pending", "sent", "failed"],
          default: "pending",
        },
      },
    ],
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledAt: Date,
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for faster queries
appointmentSchema.index({ user: 1, date: 1 })
appointmentSchema.index({ doctor: 1, date: 1 })
appointmentSchema.index({ status: 1 })
appointmentSchema.index({ date: 1, "time.start": 1 })

// Virtual field for duration in minutes
appointmentSchema.virtual("durationMinutes").get(function () {
  const startParts = this.time.start.split(":")
  const endParts = this.time.end.split(":")

  const startMinutes = Number.parseInt(startParts[0]) * 60 + Number.parseInt(startParts[1])
  const endMinutes = Number.parseInt(endParts[0]) * 60 + Number.parseInt(endParts[1])

  return endMinutes - startMinutes
})

// Check for appointment conflicts
appointmentSchema.statics.checkConflict = async function (
  doctorId,
  date,
  startTime,
  endTime,
  excludeAppointmentId = null,
) {
  const startParts = startTime.split(":")
  const endParts = endTime.split(":")

  const startMinutes = Number.parseInt(startParts[0]) * 60 + Number.parseInt(startParts[1])
  const endMinutes = Number.parseInt(endParts[0]) * 60 + Number.parseInt(endParts[1])

  const appointmentDate = new Date(date)
  appointmentDate.setHours(0, 0, 0, 0)

  const nextDay = new Date(appointmentDate)
  nextDay.setDate(nextDay.getDate() + 1)

  const query = {
    doctor: doctorId,
    date: {
      $gte: appointmentDate,
      $lt: nextDay,
    },
    status: { $nin: ["cancelled", "no-show"] },
  }

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId }
  }

  const appointments = await this.find(query)

  for (const appointment of appointments) {
    const existingStartParts = appointment.time.start.split(":")
    const existingEndParts = appointment.time.end.split(":")

    const existingStartMinutes = Number.parseInt(existingStartParts[0]) * 60 + Number.parseInt(existingStartParts[1])
    const existingEndMinutes = Number.parseInt(existingEndParts[0]) * 60 + Number.parseInt(existingEndParts[1])

    // Check for overlap
    if (
      (startMinutes >= existingStartMinutes && startMinutes < existingEndMinutes) ||
      (endMinutes > existingStartMinutes && endMinutes <= existingEndMinutes) ||
      (startMinutes <= existingStartMinutes && endMinutes >= existingEndMinutes)
    ) {
      return true // Conflict exists
    }
  }

  return false // No conflict
}

const Appointment = mongoose.model("Appointment", appointmentSchema)

export default Appointment
