import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must have a recipient"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "prediction_result",
        "appointment_reminder",
        "appointment_confirmation",
        "appointment_cancellation",
        "system_alert",
        "account_update",
        "new_message",
      ],
      required: [true, "Notification type is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    link: {
      type: String,
      trim: true,
    },
    relatedModel: {
      type: String,
      enum: ["Prediction", "Appointment", "User", "SavedReport"],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 })
notificationSchema.index({ recipient: 1, read: 1 })
notificationSchema.index({ recipient: 1, type: 1 })
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.read = true
  this.readAt = Date.now()
  return this.save()
}

// Static method to create a new notification
notificationSchema.statics.createNotification = async function (recipientId, type, title, message, options = {}) {
  const notification = await this.create({
    recipient: recipientId,
    sender: options.sender,
    type,
    title,
    message,
    priority: options.priority || "normal",
    link: options.link,
    relatedModel: options.relatedModel,
    relatedId: options.relatedId,
    expiresAt: options.expiresAt,
  })

  return notification
}

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ recipient: userId, read: false })
}

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
