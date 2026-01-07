import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "resumes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9-_]/gi, "_")
      .slice(0, 40);

    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, or DOCX files are allowed."), false);
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 }, // 500KB
});
