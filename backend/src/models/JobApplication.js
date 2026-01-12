import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    portfolioUrl: { type: String, required: true, trim: true, maxlength: 500 },

    // from form
    country: { type: String, enum: ["Pakistan", "Bangladesh", "Others"] },
liveInKarachi: { type: String, enum: ["Yes", "No"] },
    area: { type: String, trim: true, maxlength: 120 },
    expYears: { type: Number, min: 0, max: 60, required: true },
    pkrExpectation: { type: Number, min: 0, required: true },

    // resume file
    resume: {
      originalName: String,
      fileName: String,
      mimeType: String,
      size: Number,
      path: String, // local path OR cloud URL
    },

    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "hired"],
      default: "applied",
    },

    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

// optional: prevent duplicate application from same email per job
jobApplicationSchema.index({ job: 1, email: 1 }, { unique: true });

export default mongoose.model("JobApplication", jobApplicationSchema);