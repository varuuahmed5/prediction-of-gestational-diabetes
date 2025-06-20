import twilio from "twilio"
import { config } from "../../config/env.js"

export const sendSMS = async (phoneNumber, message) => {
  try {
    // Check if Twilio credentials are configured
    if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN || !config.TWILIO_PHONE_NUMBER) {
      console.warn("Twilio credentials not configured. SMS not sent.")
      return
    }

    // Initialize Twilio client
    const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: config.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    console.log(`SMS sent with SID: ${result.sid}`)
    return result
  } catch (error) {
    console.error("Error sending SMS:", error)
    // Don't throw error to prevent notification creation failure
    return null
  }
}
