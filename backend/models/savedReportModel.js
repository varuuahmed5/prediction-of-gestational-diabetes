import mongoose from "mongoose"

const savedReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Report must belong to a user"],
    },
    prediction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
      required: [true, "Report must be associated with a prediction"],
    },
    title: {
      type: String,
      required: [true, "Report title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for faster queries
savedReportSchema.index({ user: 1, createdAt: -1 })
savedReportSchema.index({ prediction: 1 })
savedReportSchema.index({ isPublic: 1 })

// Pre-save middleware to update the updatedAt field
savedReportSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.updatedAt = Date.now()
  }
  next()
})

const SavedReport = mongoose.model("SavedReport", savedReportSchema)

export default SavedReport
