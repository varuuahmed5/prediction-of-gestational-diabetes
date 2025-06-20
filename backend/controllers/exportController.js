import { Parser } from "json2csv"
import PDFDocument from "pdfkit"
import ExcelJS from "exceljs"
import User from "../models/userModel.js"
import Prediction from "../models/predictionModel.js"
import Appointment from "../models/appointmentModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"

// Export user predictions to CSV
export const exportPredictionsToCSV = catchAsync(async (req, res, next) => {
  // Determine if admin or regular user
  const isAdmin = req.user.role === "admin"

  // Build query based on user role and filters
  const query = isAdmin ? {} : { user: req.user.id }

  // Add filters if provided
  if (req.query.result) {
    query["result.prediction"] = req.query.result
  }

  if (req.query.riskLevel) {
    query["result.riskLevel"] = req.query.riskLevel
  }

  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    }
  }

  // If admin is exporting for a specific user
  if (isAdmin && req.query.userId) {
    query.user = req.query.userId
  }

  // Get predictions
  const predictions = await Prediction.find(query)
    .populate({
      path: "user",
      select: "name email",
    })
    .sort({ createdAt: -1 })

  if (predictions.length === 0) {
    return next(new AppError("No predictions found with the specified criteria", 404))
  }

  // Prepare data for CSV
  const flattenedData = predictions.map((prediction) => {
    return {
      id: prediction._id,
      userName: prediction.user.name,
      userEmail: prediction.user.email,
      age: prediction.patientData.age,
      gender: prediction.patientData.gender,
      bmi: prediction.patientData.bmi,
      systolicBP: prediction.patientData.bloodPressure.systolic,
      diastolicBP: prediction.patientData.bloodPressure.diastolic,
      glucoseLevel: prediction.patientData.glucoseLevel,
      insulinLevel: prediction.patientData.insulinLevel,
      skinThickness: prediction.patientData.skinThickness,
      pregnancies: prediction.patientData.pregnancies,
      diabetesPedigreeFunction: prediction.patientData.diabetesPedigreeFunction,
      physicalActivity: prediction.patientData.physicalActivity,
      smokingStatus: prediction.patientData.smokingStatus,
      alcoholConsumption: prediction.patientData.alcoholConsumption,
      familyHistory: prediction.patientData.familyHistory ? "Yes" : "No",
      prediction: prediction.result.prediction,
      probability: prediction.result.probability,
      riskLevel: prediction.result.riskLevel,
      notes: prediction.notes,
      status: prediction.status,
      createdAt: prediction.createdAt.toISOString(),
      updatedAt: prediction.updatedAt ? prediction.updatedAt.toISOString() : "",
    }
  })

  // Convert to CSV
  const fields = Object.keys(flattenedData[0])
  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(flattenedData)

  // Set response headers
  res.setHeader("Content-Type", "text/csv")
  res.setHeader("Content-Disposition", "attachment; filename=predictions.csv")

  // Send CSV
  res.status(200).send(csv)
})

// Export user predictions to PDF
export const exportPredictionsToPDF = catchAsync(async (req, res, next) => {
  // Determine if admin or regular user
  const isAdmin = req.user.role === "admin"

  // Build query based on user role and filters
  const query = isAdmin ? {} : { user: req.user.id }

  // Add filters if provided
  if (req.query.result) {
    query["result.prediction"] = req.query.result
  }

  if (req.query.riskLevel) {
    query["result.riskLevel"] = req.query.riskLevel
  }

  // Date range filter
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    }
  }

  // If admin is exporting for a specific user
  if (isAdmin && req.query.userId) {
    query.user = req.query.userId
  }

  // Get predictions
  const predictions = await Prediction.find(query)
    .populate({
      path: "user",
      select: "name email",
    })
    .sort({ createdAt: -1 })

  if (predictions.length === 0) {
    return next(new AppError("No predictions found with the specified criteria", 404))
  }

  // Create PDF document
  const doc = new PDFDocument()

  // Set response headers
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=predictions.pdf")

  // Pipe PDF to response
  doc.pipe(res)

  // Add title
  doc.fontSize(20).text("Diabetes Prediction Report", { align: "center" })
  doc.moveDown()

  // Add generation info
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`)
  doc.moveDown()

  // Add user info if not admin or if admin is exporting for a specific user
  if (!isAdmin || req.query.userId) {
    const user = predictions[0].user
    doc.fontSize(14).text("User Information:")
    doc.fontSize(12).text(`Name: ${user.name}`)
    doc.fontSize(12).text(`Email: ${user.email}`)
    doc.moveDown()
  }

  // Add predictions
  doc.fontSize(14).text(`Predictions (${predictions.length}):`, { underline: true })
  doc.moveDown()

  predictions.forEach((prediction, index) => {
    doc.fontSize(12).text(`Prediction ${index + 1}:`)
    doc.fontSize(10).text(`Date: ${prediction.createdAt.toLocaleString()}`)
    doc
      .fontSize(10)
      .text(`Result: ${prediction.result.prediction} (${Math.round(prediction.result.probability * 100)}% probability)`)
    doc.fontSize(10).text(`Risk Level: ${prediction.result.riskLevel}`)
    doc.fontSize(10).text(`Patient Age: ${prediction.patientData.age}`)
    doc.fontSize(10).text(`Gender: ${prediction.patientData.gender}`)
    doc.fontSize(10).text(`BMI: ${prediction.patientData.bmi}`)
    doc
      .fontSize(10)
      .text(
        `Blood Pressure: ${prediction.patientData.bloodPressure.systolic}/${prediction.patientData.bloodPressure.diastolic}`,
      )
    doc.fontSize(10).text(`Glucose Level: ${prediction.patientData.glucoseLevel}`)

    if (prediction.notes) {
      doc.fontSize(10).text(`Notes: ${prediction.notes}`)
    }

    doc.moveDown()
  })

  // Add summary
  doc.fontSize(14).text("Summary:", { underline: true })
  doc.moveDown()

  // Count predictions by result
  const resultCounts = {}
  predictions.forEach((prediction) => {
    const result = prediction.result.prediction
    resultCounts[result] = (resultCounts[result] || 0) + 1
  })

  // Add result counts
  Object.entries(resultCounts).forEach(([result, count]) => {
    doc.fontSize(12).text(`${result}: ${count} (${Math.round((count / predictions.length) * 100)}%)`)
  })

  // Finalize PDF
  doc.end()
})

// Export admin dashboard data
export const exportDashboardData = catchAsync(async (req, res, next) => {
  // Only admins can access this route
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to perform this action", 403))
  }

  // Get user statistics
  const totalUsers = await User.countDocuments()
  const activeUsers = await User.countDocuments({ active: true })

  // Get prediction statistics
  const totalPredictions = await Prediction.countDocuments()

  // Get prediction distribution
  const predictionDistribution = await Prediction.aggregate([
    {
      $group: {
        _id: "$result.prediction",
        count: { $sum: 1 },
      },
    },
  ])

  // Get risk level distribution
  const riskDistribution = await Prediction.aggregate([
    {
      $group: {
        _id: "$result.riskLevel",
        count: { $sum: 1 },
      },
    },
  ])

  // Get appointment statistics
  const totalAppointments = await Appointment.countDocuments()

  // Get appointment status distribution
  const appointmentStatusDistribution = await Appointment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  // Get monthly trends (last 12 months)
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const monthlyTrends = await Prediction.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  // Prepare data for export
  const data = {
    generatedAt: new Date().toISOString(),
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
    },
    predictions: {
      total: totalPredictions,
      distribution: predictionDistribution,
      riskDistribution,
    },
    appointments: {
      total: totalAppointments,
      statusDistribution: appointmentStatusDistribution,
    },
    trends: {
      monthly: monthlyTrends,
    },
  }

  // Determine export format
  const format = req.query.format || "json"

  if (format === "csv") {
    // Flatten the data for CSV
    const flattenedData = [
      {
        metric: "Total Users",
        value: data.users.total,
      },
      {
        metric: "Active Users",
        value: data.users.active,
      },
      {
        metric: "Inactive Users",
        value: data.users.inactive,
      },
      {
        metric: "Total Predictions",
        value: data.predictions.total,
      },
      {
        metric: "Total Appointments",
        value: data.appointments.total,
      },
    ]

    // Add prediction distribution
    data.predictions.distribution.forEach((item) => {
      flattenedData.push({
        metric: `Predictions - ${item._id}`,
        value: item.count,
      })
    })

    // Add risk distribution
    data.predictions.riskDistribution.forEach((item) => {
      flattenedData.push({
        metric: `Risk Level - ${item._id}`,
        value: item.count,
      })
    })

    // Add appointment status distribution
    data.appointments.statusDistribution.forEach((item) => {
      flattenedData.push({
        metric: `Appointment Status - ${item._id}`,
        value: item.count,
      })
    })

    // Add monthly trends
    data.trends.monthly.forEach((item) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      const monthName = monthNames[item._id.month - 1]
      flattenedData.push({
        metric: `Predictions - ${monthName} ${item._id.year}`,
        value: item.count,
      })
    })

    // Convert to CSV
    const fields = ["metric", "value"]
    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(flattenedData)

    // Set response headers
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=dashboard-data.csv")

    // Send CSV
    res.status(200).send(csv)
  } else if (format === "pdf") {
    // Create PDF document
    const doc = new PDFDocument()

    // Set response headers
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=dashboard-data.pdf")

    // Pipe PDF to response
    doc.pipe(res)

    // Add title
    doc.fontSize(20).text("Dashboard Report", { align: "center" })
    doc.moveDown()

    // Add generation info
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`)
    doc.moveDown()

    // Add user statistics
    doc.fontSize(16).text("User Statistics", { underline: true })
    doc.fontSize(12).text(`Total Users: ${data.users.total}`)
    doc.fontSize(12).text(`Active Users: ${data.users.active}`)
    doc.fontSize(12).text(`Inactive Users: ${data.users.inactive}`)
    doc.moveDown()

    // Add prediction statistics
    doc.fontSize(16).text("Prediction Statistics", { underline: true })
    doc.fontSize(12).text(`Total Predictions: ${data.predictions.total}`)
    doc.moveDown()

    // Add prediction distribution
    doc.fontSize(14).text("Prediction Distribution:")
    data.predictions.distribution.forEach((item) => {
      doc.fontSize(12).text(`${item._id}: ${item.count}`)
    })
    doc.moveDown()

    // Add risk distribution
    doc.fontSize(14).text("Risk Level Distribution:")
    data.predictions.riskDistribution.forEach((item) => {
      doc.fontSize(12).text(`${item._id}: ${item.count}`)
    })
    doc.moveDown()

    // Add appointment statistics
    doc.fontSize(16).text("Appointment Statistics", { underline: true })
    doc.fontSize(12).text(`Total Appointments: ${data.appointments.total}`)
    doc.moveDown()

    // Add appointment status distribution
    doc.fontSize(14).text("Appointment Status Distribution:")
    data.appointments.statusDistribution.forEach((item) => {
      doc.fontSize(12).text(`${item._id}: ${item.count}`)
    })
    doc.moveDown()

    // Add monthly trends
    doc.fontSize(16).text("Monthly Trends", { underline: true })
    data.trends.monthly.forEach((item) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      const monthName = monthNames[item._id.month - 1]
      doc.fontSize(12).text(`${monthName} ${item._id.year}: ${item.count} predictions`)
    })

    // Finalize PDF
    doc.end()
  } else {
    // Default to JSON
    res.status(200).json({
      status: "success",
      data,
    })
  }
})

// Export a single prediction as PDF
export const exportPredictionAsPDF = catchAsync(async (req, res, next) => {
  const prediction = await Prediction.findById(req.query.id).populate({
    path: "user",
    select: "name email",
  })

  if (!prediction) {
    return next(new AppError("No prediction found with that ID", 404))
  }

  // Check if user is authorized to export this prediction
  if (prediction.user._id.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "doctor") {
    return next(new AppError("You are not authorized to export this prediction", 403))
  }

  // Create a PDF document
  const doc = new PDFDocument({ margin: 50 })

  // Set response headers
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename=prediction-${prediction._id}.pdf`)

  // Pipe the PDF to the response
  doc.pipe(res)

  // Add content to the PDF
  doc.fontSize(25).text("Diabetes Prediction Report", { align: "center" }).moveDown()

  doc
    .fontSize(12)
    .text(`Report ID: ${prediction._id}`)
    .text(`Date: ${new Date(prediction.createdAt).toLocaleString()}`)
    .text(`Patient: ${prediction.user.name}`)
    .moveDown()

  doc.fontSize(16).text("Prediction Result", { underline: true }).moveDown()

  doc
    .fontSize(14)
    .text(`Prediction: ${prediction.result.prediction}`)
    .text(`Probability: ${(prediction.result.probability * 100).toFixed(2)}%`)
    .text(`Risk Level: ${prediction.result.riskLevel}`)
    .moveDown()

  if (prediction.result.riskFactors && prediction.result.riskFactors.length > 0) {
    doc.fontSize(14).text("Risk Factors:")
    prediction.result.riskFactors.forEach((factor) => {
      doc.fontSize(12).text(`• ${factor}`)
    })
    doc.moveDown()
  }

  if (prediction.result.recommendations && prediction.result.recommendations.length > 0) {
    doc.fontSize(14).text("Recommendations:")
    prediction.result.recommendations.forEach((recommendation) => {
      doc.fontSize(12).text(`• ${recommendation}`)
    })
    doc.moveDown()
  }

  doc.fontSize(16).text("Patient Data", { underline: true }).moveDown()

  doc
    .fontSize(12)
    .text(`Age: ${prediction.patientData.age} years`)
    .text(`Gender: ${prediction.patientData.gender}`)
    .text(`BMI: ${prediction.patientData.bmi} kg/m²`)
    .text(
      `Blood Pressure: ${prediction.patientData.bloodPressure.systolic}/${prediction.patientData.bloodPressure.diastolic} mmHg`,
    )
    .text(`Glucose Level: ${prediction.patientData.glucoseLevel} mg/dL`)
    .text(`Insulin Level: ${prediction.patientData.insulinLevel} µU/mL`)
    .text(`Skin Thickness: ${prediction.patientData.skinThickness} mm`)
    .text(`Diabetes Pedigree Function: ${prediction.patientData.diabetesPedigreeFunction}`)
    .text(`Physical Activity: ${prediction.patientData.physicalActivity}`)
    .text(`Smoking Status: ${prediction.patientData.smokingStatus}`)
    .text(`Alcohol Consumption: ${prediction.patientData.alcoholConsumption}`)
    .text(`Family History of Diabetes: ${prediction.patientData.familyHistory ? "Yes" : "No"}`)
    .moveDown()

  if (prediction.notes) {
    doc.fontSize(16).text("Notes", { underline: true }).moveDown().fontSize(12).text(prediction.notes).moveDown()
  }

  // Disclaimer
  doc
    .fontSize(10)
    .text(
      "Disclaimer: This prediction is based on machine learning algorithms and should not be considered as a medical diagnosis. Please consult with a healthcare professional for proper medical advice.",
      { align: "center", italics: true },
    )

  // Finalize the PDF
  doc.end()
})

// Export predictions as Excel
export const exportPredictionsAsExcel = catchAsync(async (req, res, next) => {
  // Build query based on user role
  const query = {}
  if (req.user.role === "user") {
    query.user = req.user.id
  } else if (req.query.userId && req.user.role === "admin") {
    query.user = req.query.userId
  }

  // Add filters if provided
  if (req.query.status) {
    query.status = req.query.status
  }

  if (req.query.result) {
    query["result.prediction"] = req.query.result
  }

  if (req.query.riskLevel) {
    query["result.riskLevel"] = req.query.riskLevel
  }

  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    }
  } else if (req.query.startDate) {
    query.createdAt = { $gte: new Date(req.query.startDate) }
  } else if (req.query.endDate) {
    query.createdAt = { $lte: new Date(req.query.endDate) }
  }

  // Get predictions
  const predictions = await Prediction.find(query)
    .populate({
      path: "user",
      select: "name email",
    })
    .sort({ createdAt: -1 })

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Predictions")

  // Add headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 30 },
    { header: "User", key: "user", width: 20 },
    { header: "Date", key: "date", width: 20 },
    { header: "Prediction", key: "prediction", width: 15 },
    { header: "Probability", key: "probability", width: 15 },
    { header: "Risk Level", key: "riskLevel", width: 15 },
    { header: "Age", key: "age", width: 10 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "BMI", key: "bmi", width: 10 },
    { header: "Glucose Level", key: "glucoseLevel", width: 15 },
    { header: "Insulin Level", key: "insulinLevel", width: 15 },
    { header: "Blood Pressure", key: "bloodPressure", width: 15 },
    { header: "Status", key: "status", width: 15 },
  ]

  // Add rows
  predictions.forEach((prediction) => {
    worksheet.addRow({
      id: prediction._id.toString(),
      user: prediction.user.name,
      date: new Date(prediction.createdAt).toLocaleString(),
      prediction: prediction.result.prediction,
      probability: (prediction.result.probability * 100).toFixed(2) + "%",
      riskLevel: prediction.result.riskLevel,
      age: prediction.patientData.age,
      gender: prediction.patientData.gender,
      bmi: prediction.patientData.bmi,
      glucoseLevel: prediction.patientData.glucoseLevel,
      insulinLevel: prediction.patientData.insulinLevel,
      bloodPressure: `${prediction.patientData.bloodPressure.systolic}/${prediction.patientData.bloodPressure.diastolic}`,
      status: prediction.status,
    })
  })

  // Set response headers
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  res.setHeader("Content-Disposition", "attachment; filename=predictions.xlsx")

  // Write to response
  await workbook.xlsx.write(res)
  res.end()
})

// Export appointments as Excel
export const exportAppointmentsAsExcel = catchAsync(async (req, res, next) => {
  // Build query based on user role
  const query = {}
  if (req.user.role === "user") {
    query.user = req.user.id
  } else if (req.user.role === "doctor") {
    query.doctor = req.user.id
  } else if (req.query.userId && req.user.role === "admin") {
    query.user = req.query.userId
  } else if (req.query.doctorId && req.user.role === "admin") {
    query.doctor = req.query.doctorId
  }

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

  // Get appointments
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

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Appointments")

  // Add headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 30 },
    { header: "Patient", key: "patient", width: 20 },
    { header: "Doctor", key: "doctor", width: 20 },
    { header: "Date", key: "date", width: 15 },
    { header: "Time", key: "time", width: 15 },
    { header: "Type", key: "type", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Location", key: "location", width: 20 },
    { header: "Reason", key: "reason", width: 30 },
    { header: "Notes", key: "notes", width: 30 },
  ]

  // Add rows
  appointments.forEach((appointment) => {
    worksheet.addRow({
      id: appointment._id.toString(),
      patient: appointment.user.name,
      doctor: appointment.doctor ? appointment.doctor.name : "Not Assigned",
      date: new Date(appointment.date).toLocaleDateString(),
      time: `${appointment.time.start} - ${appointment.time.end}`,
      type: appointment.type,
      status: appointment.status,
      location: appointment.location,
      reason: appointment.reason,
      notes: appointment.notes,
    })
  })

  // Set response headers
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  res.setHeader("Content-Disposition", "attachment; filename=appointments.xlsx")

  // Write to response
  await workbook.xlsx.write(res)
  res.end()
})
