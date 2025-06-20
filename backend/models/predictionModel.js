import mongoose from "mongoose"

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Prediction must belong to a user"],
    },
    patientData: {
      age: {
        type: Number,
        required: [true, "Age is required"],
        min: [0, "Age must be a positive number"],
        max: [120, "Age must be less than 120"],
      },
      gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["male", "female", "other"],
      },
      bmi: {
        type: Number,
        required: [true, "BMI is required"],
        min: [10, "BMI must be at least 10"],
        max: [50, "BMI must be less than 50"],
      },
      bloodPressure: {
        systolic: {
          type: Number,
          required: [true, "Systolic blood pressure is required"],
          min: [70, "Systolic blood pressure must be at least 70"],
          max: [250, "Systolic blood pressure must be less than 250"],
        },
        diastolic: {
          type: Number,
          required: [true, "Diastolic blood pressure is required"],
          min: [40, "Diastolic blood pressure must be at least 40"],
          max: [150, "Diastolic blood pressure must be less than 150"],
        },
      },
      glucoseLevel: {
        type: Number,
        required: [true, "Glucose level is required"],
        min: [50, "Glucose level must be at least 50"],
        max: [500, "Glucose level must be less than 500"],
      },
      insulinLevel: {
        type: Number,
        required: [true, "Insulin level is required"],
        min: [0, "Insulin level must be a positive number"],
        max: [1000, "Insulin level must be less than 1000"],
      },
      skinThickness: {
        type: Number,
        required: [true, "Skin thickness is required"],
        min: [0, "Skin thickness must be a positive number"],
        max: [100, "Skin thickness must be less than 100"],
      },
      diabetesPedigreeFunction: {
        type: Number,
        required: [true, "Diabetes pedigree function is required"],
        min: [0, "Diabetes pedigree function must be a positive number"],
        max: [2.5, "Diabetes pedigree function must be less than 2.5"],
      },
      pregnancies: {
        type: Number,
        min: [0, "Pregnancies must be a positive number"],
        max: [20, "Pregnancies must be less than 20"],
        default: 0,
      },
      physicalActivity: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very active"],
        default: "moderate",
      },
      smokingStatus: {
        type: String,
        enum: ["never", "former", "current"],
        default: "never",
      },
      alcoholConsumption: {
        type: String,
        enum: ["none", "light", "moderate", "heavy"],
        default: "none",
      },
      familyHistory: {
        type: Boolean,
        default: false,
      },
    },
    result: {
      prediction: {
        type: String,
        enum: ["diabetic", "non-diabetic", "pre-diabetic"],
      },
      probability: {
        type: Number,
        min: [0, "Probability must be between 0 and 1"],
        max: [1, "Probability must be between 0 and 1"],
      },
      riskLevel: {
        type: String,
        enum: ["low", "moderate", "high", "very high"],
      },
      riskFactors: [String],
      recommendations: [String],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    reviewNotes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for faster queries
predictionSchema.index({ user: 1, createdAt: -1 })
predictionSchema.index({ "result.prediction": 1 })
predictionSchema.index({ "result.riskLevel": 1 })
predictionSchema.index({ status: 1 })

// Virtual populate for saved reports
predictionSchema.virtual("savedReports", {
  ref: "SavedReport",
  foreignField: "prediction",
  localField: "_id",
})

const Prediction = mongoose.model("Prediction", predictionSchema)

export default Prediction
