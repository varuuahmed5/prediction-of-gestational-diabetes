import axios from "axios"
import Prediction from "../models/predictionModel.js"
import Notification from "../models/notificationModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"
import { config } from "../config/env.js"

// Create a new prediction
export const createPrediction = catchAsync(async (req, res, next) => {
  // Add user to request body
  req.body.user = req.user.id

  // Create prediction with pending status
  const prediction = await Prediction.create({
    user: req.user.id,
    patientData: req.body.patientData,
    status: "pending",
  })

  // Make prediction request to ML API
  // Make prediction request to ML API
try {
  console.log("📤 Sending data to ML API:", req.body.patientData);

  const mlResponse = await axios.post(`${config.ML_API_URL}/predict`, req.body.patientData, {
    timeout: 10000, // 10 seconds
  });

  console.log("✅ Response from ML API:", mlResponse.data);

  prediction.result = {
    prediction: mlResponse.data.prediction,
    probability: mlResponse.data.probability,
    riskLevel: mlResponse.data.riskLevel || "moderate",
    riskFactors: mlResponse.data.riskFactors || [],
    recommendations: mlResponse.data.recommendations || [],
  };
  prediction.status = "completed";
  await prediction.save();

  await Notification.createNotification(
    req.user.id,
    "prediction_result",
    "Prediction Result Ready",
    `Your diabetes prediction result is now available.`,
    {
      priority:
        prediction.result.riskLevel === "high" || prediction.result.riskLevel === "very high" ? "high" : "normal",
      link: `/prediction/${prediction._id}`,
      relatedModel: "Prediction",
      relatedId: prediction._id,
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      prediction,
    },
  });
} catch (error) {
  console.error("❌ Error contacting ML API:", error.message);
  prediction.status = "failed";
  await prediction.save();
  return next(new AppError("Failed to process prediction. ML server may be offline or slow.", 504));
}

})



// Get all predictions for current user
export const getUserPredictions = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const query = { user: req.user.id }

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

  // Execute query with pagination
  const predictions = await Prediction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

  // Get total count for pagination
  const total = await Prediction.countDocuments(query)

  res.status(200).json({
    status: "success",
    results: predictions.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: {
      predictions,
    },
  })
})

// Get a single prediction
export const getPrediction = catchAsync(async (req, res, next) => {
  const prediction = await Prediction.findById(req.params.id)

  if (!prediction) {
    return next(new AppError("No prediction found with that ID", 404))
  }

  // Check if user is authorized to view this prediction
  if (prediction.user.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "doctor") {
    return next(new AppError("You are not authorized to view this prediction", 403))
  }

  res.status(200).json({
    status: "success",
    data: {
      prediction,
    },
  })
})

// Update a prediction (admin or doctor only)
export const updatePrediction = catchAsync(async (req, res, next) => {
  // Only allow updating notes, reviewNotes, and status
  const allowedFields = {
    notes: req.body.notes,
    reviewNotes: req.body.reviewNotes,
    status: req.body.status,
  }

  // Remove undefined fields
  Object.keys(allowedFields).forEach((key) => allowedFields[key] === undefined && delete allowedFields[key])

  // Add reviewer info if status is being updated
  if (req.body.status) {
    allowedFields.reviewedBy = req.user.id
    allowedFields.reviewedAt = Date.now()
  }

  const prediction = await Prediction.findByIdAndUpdate(req.params.id, allowedFields, {
    new: true,
    runValidators: true,
  })

  if (!prediction) {
    return next(new AppError("No prediction found with that ID", 404))
  }

  // Create notification if prediction was reviewed
  if (req.body.status && req.body.status !== "pending") {
    await Notification.createNotification(
      prediction.user,
      "prediction_result",
      "Prediction Reviewed",
      `Your prediction has been reviewed by a healthcare professional.`,
      {
        priority: "normal",
        link: `/prediction/${prediction._id}`,
        relatedModel: "Prediction",
        relatedId: prediction._id,
      },
    )
  }

  res.status(200).json({
    status: "success",
    data: {
      prediction,
    },
  })
})

// Delete a prediction
export const deletePrediction = catchAsync(async (req, res, next) => {
  const prediction = await Prediction.findById(req.params.id)

  if (!prediction) {
    return next(new AppError("No prediction found with that ID", 404))
  }

  // Check if user is authorized to delete this prediction
  if (prediction.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("You are not authorized to delete this prediction", 403))
  }

  await Prediction.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Get prediction statistics (admin only)
export const getPredictionStats = catchAsync(async (req, res, next) => {
  const stats = await Prediction.aggregate([
    {
      $group: {
        _id: "$result.prediction",
        count: { $sum: 1 },
        avgAge: { $avg: "$patientData.age" },
        avgBMI: { $avg: "$patientData.bmi" },
        avgGlucose: { $avg: "$patientData.glucoseLevel" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  const riskStats = await Prediction.aggregate([
    {
      $group: {
        _id: "$result.riskLevel",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  const timeStats = await Prediction.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
        diabetic: {
          $sum: {
            $cond: [{ $eq: ["$result.prediction", "diabetic"] }, 1, 0],
          },
        },
        nonDiabetic: {
          $sum: {
            $cond: [{ $eq: ["$result.prediction", "non-diabetic"] }, 1, 0],
          },
        },
        preDiabetic: {
          $sum: {
            $cond: [{ $eq: ["$result.prediction", "pre-diabetic"] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  res.status(200).json({
    status: "success",
    data: {
      predictionStats: stats,
      riskStats,
      timeStats,
    },
  })
})

// Get all predictions (admin only)
export const getAllPredictions = catchAsync(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.user) query.user = req.query.user;
  if (req.query.status) query.status = req.query.status;
  if (req.query.result) query["result.prediction"] = req.query.result;
  if (req.query.riskLevel) query["result.riskLevel"] = req.query.riskLevel;

  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  } else if (req.query.startDate) {
    query.createdAt = { $gte: new Date(req.query.startDate) };
  } else if (req.query.endDate) {
    query.createdAt = { $lte: new Date(req.query.endDate) };
  }

  const predictions = await Prediction.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Prediction.countDocuments(query);

  res.status(200).json({
    status: "success",
    results: predictions.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: predictions,
  });
});

