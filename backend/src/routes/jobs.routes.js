// backend/src/routes/jobs.routes.js

import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import auth from "../middleware/auth.middleware.js";
import { linesToArray } from "../utils/linesToArray.js";
import { uploadResume } from "../middleware/uploadResume.js";

const router = express.Router();
const requireAuth = auth;

// Multer error handler so we can return a nice 400 instead of crashing
const handleResume = (req, res, next) =>
  uploadResume.single("resume")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });

/**
 * CREATE Job (Draft by default)
 * POST /api/jobs
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      department: req.body.department,
      workModel: req.body.workModel,

      salaryMinPKR: req.body.salaryMinPKR ?? null,
      salaryMaxPKR: req.body.salaryMaxPKR ?? null,

      requirements: linesToArray(req.body.requirements),
      responsibilities: linesToArray(req.body.responsibilities),
      perks: linesToArray(req.body.perks),

      status: req.body.status || "draft",
    };

    // Only set createdBy if user.id exists and is valid
    if (req.user?.id) {
      payload.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    const job = await Job.create(payload);
    return res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to create job" });
  }
});

/**
 * LIST Jobs
 * GET /api/jobs?status=published&search=designer&page=1&limit=20
 */

router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const q = {};
    if (status) q.status = status;

    if (search) {
      q.$or = [
        { title: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { workModel: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [items, total] = await Promise.all([
      Job.find(q)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Job.countDocuments(q),
    ]);

    return res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/**
 * APPLY to a job (public)
 * POST /api/jobs/:id/apply
 */

router.post("/:id/apply", handleResume, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== "published") {
      return res
        .status(404)
        .json({ message: "Job not found or not accepting applications." });
    }

    const isRemote = job.workModel === "Remote (Global)";

    const baseRequired = ["fullName", "email", "portfolioUrl", "expYears", "pkrExpectation"];
    const remoteRequired = ["country"];
    const onsiteRequired = ["liveInKarachi"]; // (area optional)

    const requiredFields = isRemote
      ? [...baseRequired, ...remoteRequired]
      : [...baseRequired, ...onsiteRequired];

    const missing = requiredFields.filter(
      (f) => !req.body[f] || `${req.body[f]}`.trim() === ""
    );

    if (missing.length) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    if (isRemote) {
      if (!["Pakistan", "Bangladesh", "Others"].includes(req.body.country)) {
        return res.status(400).json({ message: "country must be Pakistan, Bangladesh, or Others." });
      }
    } else {
      if (!["Yes", "No"].includes(req.body.liveInKarachi)) {
        return res.status(400).json({ message: "liveInKarachi must be Yes or No." });
      }
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    const expYears = Number(req.body.expYears);
    const pkrExpectation = Number(req.body.pkrExpectation);
    if (Number.isNaN(expYears) || Number.isNaN(pkrExpectation)) {
      return res.status(400).json({
        message: "Experience years and PKR expectation must be numbers.",
      });
    }

    const application = await JobApplication.create({
      job: job._id,
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim().toLowerCase(),
      portfolioUrl: req.body.portfolioUrl.trim(),

      // ✅ store the right field based on job type
      country: isRemote ? req.body.country : undefined,
      liveInKarachi: !isRemote ? req.body.liveInKarachi : undefined,
      area: !isRemote ? (req.body.area?.trim() || "") : "",

      expYears,
      pkrExpectation,

      resume: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/resumes/${req.file.filename}`,
      },
      meta: {
        ip: req.ip,
        userAgent: req.get("user-agent") || "",
      },
    });

    return res.status(201).json({ message: "Application received.", application });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        message: "You have already applied to this job with this email.",
      });
    }
    console.error("Error applying to job:", err);
    return res.status(400).json({ message: err.message || "Failed to submit application." });
  }
});

/**
 * GET Single Job
 * GET /api/jobs/:id
 */

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    return res.status(400).json({ message: "Invalid job id" });
  }
});

/**
 * UPDATE Job
 * PUT /api/jobs/:id
 */

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updates = {
      title: req.body.title,
      department: req.body.department,
      workModel: req.body.workModel,

      salaryMinPKR: req.body.salaryMinPKR ?? null,
      salaryMaxPKR: req.body.salaryMaxPKR ?? null,

      requirements:
        req.body.requirements !== undefined
          ? linesToArray(req.body.requirements)
          : undefined,
      responsibilities:
        req.body.responsibilities !== undefined
          ? linesToArray(req.body.responsibilities)
          : undefined,
      perks:
        req.body.perks !== undefined ? linesToArray(req.body.perks) : undefined,

      status: req.body.status,
    };

    // remove undefined keys so they don't overwrite existing values
    Object.keys(updates).forEach(
      (k) => updates[k] === undefined && delete updates[k]
    );

    const job = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.message || "Failed to update job" });
  }
});

/**
 * PUBLISH Job (for your "Publish Listing" button)
 * PATCH /api/jobs/:id/publish
 */
router.patch("/:id/publish", requireAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    return res.status(400).json({ message: "Failed to publish job" });
  }
});

/**
 * ARCHIVE Job
 * PATCH /api/jobs/:id/archive
 */

router.patch("/:id/archive", requireAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    return res.status(400).json({ message: "Failed to archive job" });
  }
});

/**
 * DELETE Job
 * DELETE /api/jobs/:id
 */

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return res.status(400).json({ message: "Failed to delete job" });
  }
});

export default router;
