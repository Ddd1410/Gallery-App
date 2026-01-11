require("dotenv").config(); // load .env
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { uploadFile, deleteImage: deleteBlob } = require("./blobService");
const {
  addImage,
  listImages,
  deleteImage: deleteCosmos,
  getImageById,
  updateImage,
} = require("./cosmosServis");

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to check creator API key
const requireCreator = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  console.log("Received API key:", apiKey); // debug
  if (apiKey !== process.env.CREATOR_API_KEY) {
    return res.status(403).json({ error: "Creator access required" });
  }
  next();
};

/**
 * CREATOR: Upload image or video
 */
app.post(
  "/api/photos",
  requireCreator,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";

      const fileUrl = await uploadFile(req.file);

      const metadata = {
        id: Date.now().toString(),
        name: req.file.originalname,
        url: fileUrl,
        title: req.body.title || "",
        caption: req.body.caption || "",
        type: fileType,
        uploadedAt: new Date().toISOString(),
        comments: [],
        ratings: [],
      };

      await addImage(metadata);

      res.json({ message: "Upload successful", ...metadata });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/**
 * PUBLIC / CONSUMER: List all media
 */
app.get("/api/photos", async (req, res) => {
  try {
    const images = await listImages();
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch images" });
  }
});

/**
 * PUBLIC / CONSUMER: Search media by title or caption
 * GET /api/search?q=...
 */
app.get("/api/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase();

    const images = await listImages();

    const results = images.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const caption = (item.caption || "").toLowerCase();
      return title.includes(q) || caption.includes(q);
    });

    res.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

/**
 * PUBLIC / CONSUMER: Add a comment to an image/video
 * POST /api/photos/:id/comment
 * body: { user, text }
 */
app.post("/api/photos/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { user, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const item = await getImageById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    item.comments = item.comments || [];
    item.comments.push({
      user: user || "Anonymous",
      text,
      date: new Date().toISOString(),
    });

    const updated = await updateImage(item);
    res.json({ message: "Comment added", item: updated });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ error: "Could not add comment" });
  }
});

/**
 * PUBLIC / CONSUMER: Rate an image/video (1–5)
 * POST /api/photos/:id/rate
 * body: { rating }
 */
app.post("/api/photos/:id/rate", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const value = Number(rating);
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: "Rating must be 1–5" });
    }

    const item = await getImageById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    item.ratings = item.ratings || [];
    item.ratings.push(value);

    const updated = await updateImage(item);
    res.json({ message: "Rating added", item: updated });
  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ error: "Could not add rating" });
  }
});

/**
 * CREATOR: Delete image/video
 */
app.delete("/api/photos/:name", requireCreator, async (req, res) => {
  try {
    const name = req.params.name;

    await deleteBlob(name);
    await deleteCosmos(name);

    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/**
 * Health check
 */
app.get("/api/health", (req, res) =>
  res.json({ status: "API is running" })
);

/**
 * Simple Cosmos test using listImages (no direct container)
 */
app.get("/api/test-cosmos", async (req, res) => {
  try {
    const images = await listImages();
    res.json({ count: images.length });
  } catch (err) {
    console.error("Cosmos test error:", err);
    res.status(500).json({ error: "Cosmos DB not reachable" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
