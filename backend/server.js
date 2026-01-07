import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./src/routes/auth.routes.js";
import jobsRoutes from "./src/routes/jobs.routes.js";
import connectDB from "./src/config/db.js";
import pipelineRoutes from "./src/routes/pipeline.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => res.send("Cigul Recruitment API running ✅"));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/pipeline", pipelineRoutes);
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

