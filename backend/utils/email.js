import nodemailer from "nodemailer"
import { config } from "../config/env.js"

export const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  })

  // Define the email options
  const mailOptions = {
    from: `Diabetes Prediction <${config.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  }

  // Send the email
  await transporter.sendMail(mailOptions)
}
