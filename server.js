import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 📁 Ensure upload folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ⚙️ Multer setup — store with random names
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(3).toString("hex"); // e.g., sop69y
    cb(null, `${randomName}${ext}`);
  }
});
const upload = multer({ storage });

// 🚀 Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

  const fileUrl = `${req.protocol}://${req.get("host")}/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// 🌍 Serve uploaded files from root (like Catbox)
app.use(express.static("uploads"));

app.listen(PORT, () => console.log(`✅ Catbox-style server running on port ${PORT}`));
