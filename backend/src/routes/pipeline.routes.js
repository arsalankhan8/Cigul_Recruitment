import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import auth from "../middleware/auth.middleware.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const requireAuth = auth;

/**
 * PIPELINE OVERVIEW (cards screen)
 * GET /api/pipeline
 * returns jobs + counts + "new applicants" (last 24h)
 */

router.get("/", requireAuth, async (req, res) => {
  try {
    const jobs = await Job.find({ status: { $ne: "archived" } })
      .sort({ createdAt: -1 })
      .lean();

    const jobIds = jobs.map((j) => j._id);

    const counts = await JobApplication.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$job",
          total: { $sum: 1 },
          applied: {
            $sum: { $cond: [{ $eq: ["$status", "applied"] }, 1, 0] },
          },
          interview: {
            $sum: { $cond: [{ $eq: ["$status", "interview"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          hired: {
            $sum: { $cond: [{ $eq: ["$status", "hired"] }, 1, 0] },
          },
          newLast24h: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", new Date(Date.now() - 24 * 60 * 60 * 1000)] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const map = new Map(counts.map((c) => [String(c._id), c]));

    const items = jobs.map((j) => {
      const c = map.get(String(j._id)) || {};
      return {
        ...j,
        pipeline: {
          total: c.total || 0,
          applied: c.applied || 0,
          interview: c.interview || 0,
          rejected: c.rejected || 0,
          hired: c.hired || 0,
          newLast24h: c.newLast24h || 0,
        },
      };
    });

    res.json({ items });
  } catch (e) {
    res.status(500).json({ message: "Failed to load pipeline overview" });
  }
});

/**
 * JOB PIPELINE BOARD
 * GET /api/pipeline/jobs/:jobId
 * returns job + applications grouped by status
 */
router.get("/jobs/:jobId", requireAuth, async (req, res) => {
  try {
    const jobId = new mongoose.Types.ObjectId(req.params.jobId);

    const job = await Job.findById(jobId).lean();
    if (!job) return res.status(404).json({ message: "Job not found" });

    const apps = await JobApplication.find({ job: jobId })
      .sort({ createdAt: -1 })
      .lean();

      const grouped = { applied: [], interview: [], rejected: [], hired: [] };

      for (const a of apps) {
        // ✅ normalize old statuses into new pipeline statuses
        const s = ["applied", "interview", "rejected", "hired"].includes(a.status)
          ? a.status
          : a.status === "shortlisted"
          ? "interview"
          : a.status === "received"
          ? "applied"
          : a.status === "reviewed"
          ? "applied"
          : "applied";
      
        grouped[s].push(a);
      }
      

    res.json({
      job,
      totalCandidates: apps.length,
      columns: grouped,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load job pipeline" });
  }
});

/**
 * CANDIDATE DETAIL
 * GET /api/pipeline/applications/:appId
 */
router.get("/applications/:appId", requireAuth, async (req, res) => {
  try {
    const appId = new mongoose.Types.ObjectId(req.params.appId);

    const application = await JobApplication.findById(appId)
      .populate("job")
      .lean();

    if (!application) return res.status(404).json({ message: "Not found" });

    res.json({ application });
  } catch (e) {
    res.status(500).json({ message: "Failed to load candidate" });
  }
});

/**
 * UPDATE STATUS (Move to Interview / Hire / Reject)
 * PATCH /api/pipeline/applications/:appId/status
 * body: { status: "interview" | "hired" | "rejected" | "applied" }
 */

router.patch("/applications/:appId/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["applied", "interview", "rejected", "hired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.appId,
      { status },
      { new: true }
    ).lean();

    if (!application) return res.status(404).json({ message: "Not found" });

    res.json({ application });
  } catch (e) {
    res.status(500).json({ message: "Failed to update status" });
  }
});


router.delete("/applications/:appId", requireAuth, async (req, res) => {
  try {
    const app = await JobApplication.findById(req.params.appId).lean();
    if (!app) return res.status(404).json({ message: "Not found" });

    // ✅ delete resume file from disk (if exists)
    if (app.resume?.path) {
      // app.resume.path example: "/uploads/resumes/xyz.pdf"
      // Convert to absolute path safely
      const absolutePath = path.join(process.cwd(), app.resume.path.replace(/^\//, ""));

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await JobApplication.findByIdAndDelete(req.params.appId);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete candidate" });
  }
});

export default router;
