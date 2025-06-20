import SavedReport from "../models/savedReportModel.js"
import Prediction from "../models/predictionModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"
import mongoose from "mongoose";

// Save a prediction as a report
export const saveReport = catchAsync(async (req, res, next) => {
  const { predictionId, title, description, tags, isPublic } = req.body

  // Check if prediction exists
  const prediction = await Prediction.findById(predictionId)
  if (!prediction) {
    return next(new AppError("No prediction found with that ID", 404))
  }

  // Check if user is authorized to save this prediction
  if (prediction.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not authorized to save this prediction", 403))
  }

  // Check if report already exists for this prediction and user
  const existingReport = await SavedReport.findOne({
    user: req.user.id,
    prediction: predictionId,
  })

  if (existingReport) {
    // Update existing report
    existingReport.title = title || existingReport.title
    existingReport.description = description || existingReport.description
    existingReport.tags = tags || existingReport.tags
    existingReport.isPublic = isPublic !== undefined ? isPublic : existingReport.isPublic
    existingReport.updatedAt = Date.now()

    await existingReport.save()

    res.status(200).json({
      status: "success",
      data: {
        report: existingReport,
      },
    })
  } else {
    // Create new report
    const newReport = await SavedReport.create({
      user: req.user.id,
      prediction: predictionId,
      title,
      description,
      tags,
      isPublic: isPublic || false,
    })

    res.status(201).json({
      status: "success",
      data: {
        report: newReport,
      },
    })
  }
})

export const getRecentReports = catchAsync(async (req, res, next) => {
  const recent = await SavedReport.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(3);

  res.status(200).json({
    status: "success",
    data: {
      reports: recent,
    },
  });
});
export const getReportById = async (req, res) => {
  const report = await Report.findById(req.params.id)
  if (!report) {
    return res.status(404).json({ status: "fail", message: "Report not found" })
  }
  res.status(200).json({ status: "success", data: report })
}
// Get all saved reports for a user
export const getUserReports = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { user: req.user.id }

  // Add filters if provided
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, "i")] } },
    ]
  }

  
  // Execute query with pagination
  const reports = await SavedReport.find(query)
    .populate({
      path: "prediction",
      select: "result patientData createdAt",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await SavedReport.countDocuments(query)

  res.status(200).json({
    status: "success",
    results: reports.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: {
      reports,
    },
  })
})

// Get a single saved report
export const getReport = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "fail", message: "Invalid report ID" });
    }

    const report = await SavedReport.findById(req.params.id).populate("prediction");

    if (!report) {
      return res.status(404).json({ status: "fail", message: "Report not found" });
    }

    res.status(200).json({
      status: "success",
      data: { report },
    });

  } catch (err) {
    console.error("🔥 Error in getReport:", err.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update a saved report
export const updateReport = catchAsync(async (req, res, next) => {
  const { title, description, tags, isPublic } = req.body

  const report = await SavedReport.findById(req.params.id)

  if (!report) {
    return next(new AppError("No report found with that ID", 404))
  }

  // Check if user is authorized to update this report
  if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not authorized to update this report", 403))
  }

  // Update fields
  if (title) report.title = title
  if (description !== undefined) report.description = description
  if (tags) report.tags = tags
  if (isPublic !== undefined) report.isPublic = isPublic
  report.updatedAt = Date.now()

  await report.save()

  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  })
})

// Delete a saved report
export const deleteReport = catchAsync(async (req, res, next) => {
  const report = await SavedReport.findById(req.params.id)

  if (!report) {
    return next(new AppError("No report found with that ID", 404))
  }

  // Check if user is authorized to delete this report
  if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not authorized to delete this report", 403))
  }

  await SavedReport.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Get public reports
export const getPublicReports = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query for public reports
  const query = { isPublic: true }

  // Add filters if provided
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, "i")] } },
    ]
  }

  // Execute query with pagination
  const reports = await SavedReport.find(query)
    .populate({
      path: "prediction",
      select: "result patientData createdAt",
    })
    .populate({
      path: "user",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await SavedReport.countDocuments(query)

  res.status(200).json({
    status: "success",
    results: reports.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: {
      reports,
    },
  })
})