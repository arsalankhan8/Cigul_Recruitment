import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import AdminUser from "../models/AdminUser.js";

dotenv.config();

const ADMIN_USERNAME = "CigulRecruitment";
const ADMIN_PASSWORD = "cigulR!e@c#r$u%i^tment(!#^)";

async function seed() {
  await connectDB();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const existing = await AdminUser.findOne({ username: ADMIN_USERNAME });

  if (existing) {
    existing.passwordHash = passwordHash; // keep updated
    await existing.save();
    console.log("✅ Admin updated");
  } else {
    await AdminUser.create({
      username: ADMIN_USERNAME,
      passwordHash,
      role: "admin",
    });
    console.log("✅ Admin created");
  }

  process.exit(0);
}

seed();
