import Notification from "../models/notificationModel.js"
import { sendEmail } from "./emailService.js"
import { sendSMS } from "./smsService.js"
import User from "../models/userModel.js"

export const createNotification = async (notificationData) => {
  try {
    // Create notification in database
    const notification = await Notification.create(notificationData)

    // Get recipient user
    const user = await User.findById(notificationData.recipient)

    if (!user) {
      console.error(`User not found for notification: ${notificationData.recipient}`)
      return notification
    }

    // Send email if enabled
    if (notificationData.deliveryChannels?.email && user.email) {
      await sendEmail({
        email: user.email,
        subject: notificationData.title,
        message: notificationData.message,
      })
    }

    // Send SMS if enabled
    if (notificationData.deliveryChannels?.sms && user.phoneNumber) {
      await sendSMS(user.phoneNumber, notificationData.message)
    }

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}
