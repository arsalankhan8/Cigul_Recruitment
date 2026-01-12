import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit"; // ✅ ADD THIS
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import jobsRoutes from "./src/routes/jobs.routes.js";
import pipelineRoutes from "./src/routes/pipeline.routes.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ If behind nginx/render/vercel/etc (recommended in production)
// app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS
const allowedOrigins = [
  "https://career.cigul.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Rate limiters
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authPostLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, try again later." },
});

// ✅ Apply general limiter ONLY for POST under /api (ONCE)
app.use("/api", (req, res, next) => {
  if (req.method === "POST") return postLimiter(req, res, next);
  next();
});

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/api/health", (req, res) => res.send("Cigul Recruitment API running "));

// ✅ Auth route with stricter POST limiter (mount ONLY ONCE)
app.use(
  "/api/auth",
  (req, res, next) => {
    if (req.method === "POST") return authPostLimiter(req, res, next);
    next();
  },
  authRoutes
);

// Other API routes
app.use("/api/jobs", jobsRoutes);
app.use("/api/pipeline", pipelineRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});



app.use(express.static(path.join(__dirname, "dist")));
app.get(/.*/, (req, res) => { res.sendFile(path.join(__dirname, "dist", "index.html")); });

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log("Server running on", PORT));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
