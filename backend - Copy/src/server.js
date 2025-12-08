// src/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import patientQueryRoutes from "./routes/patientQueryRoutes.js";
import medicalBlogRoutes from "./routes/MedicalBlogRoutes.js";
import outbreakRoutes from "./routes/outbreakRoutes.js";
import scraper from "./scrapers/maharashtraScraper.js";
import chatRoutes from "./routes/chatRoutes.js";


// -------------------- Fix __dirname in ES Modules --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Initialize Express --------------------
const app = express();

// -------------------- Connect to MongoDB --------------------
connectDB();

// -------------------- Security Middleware --------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// -------------------- CORS Configuration --------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------------------- Body Parsing Middleware --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// -------------------- Serve Static Files --------------------
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// -------------------- Health Check --------------------
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Unified Medical & Outbreak API Server is running",
    timestamp: new Date().toISOString(),
  });
});

// -------------------- Medical App Routes --------------------
app.use("/auth", authRoutes);
app.use("/api/patient-query", patientQueryRoutes);
app.use("/api/medical", medicalBlogRoutes);

// -------------------- Outbreak Alert Routes --------------------
app.use("/api/outbreaks", outbreakRoutes);


// -------------------- Chat Routes --------------------
app.use("/api/chat", chatRoutes);



// Run scraper manually
app.get("/run-scraper", async (req, res) => {
  try {
    const result = await scraper();
    res.json({ status: "done", records: result.length });
  } catch (err) {
    console.error("Scraper error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Debug date route
app.get("/debug-date", (req, res) => {
  res.json({
    systemDate: new Date(),
    iso: new Date().toISOString(),
  });
});

// -------------------- 404 Handler --------------------
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack || err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Unified Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

export default app;
