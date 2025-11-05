import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 📁 Ensure upload folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ⚙️ Multer setup — store with random names
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(3).toString("hex"); // e.g., sop69y
    cb(null, `${randomName}${ext}`);
  },
});
const upload = multer({ storage });

// 🚀 Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, error: "No file uploaded" });

  const fileUrl = `${req.protocol}://${req.get("host")}/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// 🌍 Serve uploaded files from root (like Catbox)
app.use(express.static(uploadDir));

// 🌐 Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Optional: handle any other unknown routes
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () =>
  console.log(`✅ TrashUploader server running on port ${PORT}`)
);
