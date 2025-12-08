import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import MedicalBlog from "../models/MedicalBlog.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// ---------------- MULTER STORAGE CONFIG ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/medicalBlogs";
    fs.mkdirSync(dir, { recursive: true }); // Ensure folder exists
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ================= CREATE BLOG =================
router.post(
  "/add-blog",
  authenticateToken,
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { title, shortDescription, mainCategory, subCategory } = req.body;

      if (!title || !shortDescription || !mainCategory || !subCategory) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "Featured image is required" });
      }

      const newBlog = new MedicalBlog({
        title,
        shortDescription,
        mainCategory,
        subCategory,
        featuredImage: req.file.filename,
        createdBy: req.user.userId,
      });

      await newBlog.save();

      res.status(201).json({ success: true, message: "Blog uploaded successfully", blog: newBlog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

// ================= GET ALL BLOGS =================
router.get("/all", async (req, res) => {
  try {
    const blogs = await MedicalBlog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= UPDATE BLOG =================
router.put(
  "/edit/:id",
  authenticateToken,
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, shortDescription, mainCategory, subCategory } = req.body;

      const updateData = { title, shortDescription, mainCategory, subCategory };
      if (req.file) updateData.featuredImage = req.file.filename;

      const updatedBlog = await MedicalBlog.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedBlog)
        return res.status(404).json({ success: false, message: "Blog not found" });

      res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ================= DELETE BLOG =================
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await MedicalBlog.findByIdAndDelete(id);

    if (!deletedBlog)
      return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
