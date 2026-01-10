// 1. Import dependencies
const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

// 2. Import blob service
const { uploadImage, listImages } = require("./blobService");

// 3. Create Express app
const app = express();

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// 6. Upload endpoint (POST)
app.post("/api/photos", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadImage(req.file);
    res.json({ message: "Upload successful", imageUrl, metadata: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// 7. Gallery endpoint (GET)
app.get("/api/photos", async (req, res) => {
  try {
    const images = await listImages();
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch images" });
  }
});

// 8. Health check
app.get("/api/health", (req, res) => res.json({ status: "API is running" }));

// 9. Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
