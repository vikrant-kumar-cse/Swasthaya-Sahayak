import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  startSignup,
  verifySignupOTP,
  completeSignup,
  loginUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  updateUserRole,   // ✅ new
  deleteUser
   // multer export from controller
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { getAllUsers } from "../controllers/authController.js";

const router = express.Router();

// ------------------- Multer Setup (for profile pictures) -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image uploads allowed"));
    }
    cb(null, true);
  },
});

// ---------------- Signup ----------------
router.post("/start", startSignup);
router.post("/verify-otp", verifySignupOTP);
router.post("/complete", completeSignup);

// ---------------- Login ----------------
router.post("/login", loginUser);

// ---------------- Refresh Token ----------------
router.get("/refresh-token", refreshToken);

// ---------------- Logout ----------------
router.post("/logout", logout);

// ---------------- Password Reset ----------------
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ---------------- User Profile ----------------
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, upload.single("profilePicture"), updateProfile);


router.get("/all-users", getAllUsers);
router.put("/update-role/:id", updateUserRole);  // ✅ update role
router.delete("/delete-user/:id", deleteUser);   // ✅ delete user



export default router;


