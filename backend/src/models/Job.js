import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    department: { type: String, required: true, trim: true, maxlength: 80 },

    workModel: {
      type: String,
      required: true,
      enum: ["In-house (Karachi)", "Remote (Global)"],
    },

    salaryMinPKR: { type: Number, default: null, min: 0 },
    salaryMaxPKR: { type: Number, default: null, min: 0 },

    requirements: [{ type: String, trim: true }],
    responsibilities: [{ type: String, trim: true }],
    perks: [{ type: String, trim: true }],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" }, // optional
  },
  { timestamps: true }
);

// ✅ Helpful validation: max salary should be >= min salary
jobSchema.pre("validate", function () {
  if (
    this.salaryMinPKR != null &&
    this.salaryMaxPKR != null &&
    this.salaryMaxPKR < this.salaryMinPKR
  ) {
    throw new Error("Max salary must be greater than or equal to min salary.");
  }
});

export default mongoose.model("Job", jobSchema);
