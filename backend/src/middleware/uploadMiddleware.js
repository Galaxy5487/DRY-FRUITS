import fs from "fs";
import path from "path";
import multer from "multer";

const isFirebase = process.env.FUNCTION_NAME || process.env.FUNCTIONS_EMULATOR || process.env.FUNCTION_TARGET;
const uploadDir = isFirebase ? path.join("/tmp", "uploads") : path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});
