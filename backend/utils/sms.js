import twilio from "twilio"
import { config } from "../config/env.js"

export const sendSMS = async (options) => {
  // Create a Twilio client
  const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

  // Send the SMS
  await client.messages.create({
    body: options.body,
    from: config.TWILIO_PHONE_NUMBER,
    to: options.to,
  })
}
