import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./src/routes/auth.routes.js";
import jobsRoutes from "./src/routes/jobs.routes.js";
import connectDB from "./src/config/db.js";
import pipelineRoutes from "./src/routes/pipeline.routes.js";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*", // dev only
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => res.send("Cigul Recruitment API running ✅"));


app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/pipeline", pipelineRoutes);

app.use(express.static(path.join(__dirname, "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});



async function start() {
  await connectDB();
  app.listen(PORT, () => console.log("Server running on", PORT));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
