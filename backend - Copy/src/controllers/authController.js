import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";

dotenv.config();

// ---------------- Nodemailer transporter ----------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// In-memory refresh token store (replace with DB/Redis in production)
const refreshTokensStore = new Map();

// ---------------- Multer setup for profile picture ----------------
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

export const uploadProfilePicture = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// ---------------- Helper: send OTP email ----------------
const sendOTPEmail = async (email, otp, name) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📨 DEV MODE OTP EMAIL", `To: ${email} | OTP: ${otp}`);
    return { success: true, message: "OTP logged to console (DEV MODE)" };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || "Medical App <noreply@medicalapp.com>",
    to: email,
    subject: "Verify Your Email - Medical App",
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hello ${name},</h2>
      <p>Use the following OTP to verify your email:</p>
      <h1 style="color: #007bff;">${otp}</h1>
      <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
  return { success: true, message: "OTP sent via email" };
};

// ---------------- Helper: send Welcome email ----------------
const sendWelcomeEmail = async (email, name) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📨 DEV MODE WELCOME EMAIL", `To: ${email} | Welcome ${name}`);
    return { success: true };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || "Medical App <noreply@medicalapp.com>",
    to: email,
    subject: "Welcome to Medical App!",
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Welcome ${name}!</h2>
      <p>Your email is verified and your account is ready to use.</p>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

// ---------------- STEP 1: Start Signup ----------------
export const startSignup = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber)
      return res.status(400).json({ success: false, message: "All fields required" });

    let user = await User.findOne({ email });

    if (user && user.emailVerified)
      return res.status(400).json({ success: false, message: "User already registered" });

    if (!user) {
      user = new User({
        uniqueUserId: "USR" + Date.now(),
        name,
        email,
        phoneNumber,
        passwordHash: "temp",
      });
    }

    const otp = user.generateOTP();
    await user.save();

    await sendOTPEmail(email, otp, name);

    res.json({ success: true, message: "OTP sent successfully", email });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- STEP 2: Verify OTP ----------------
export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.verifyOTP(otp);
    await user.save();

    res.json({ success: true, message: "OTP verified. You can set your password now." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- STEP 3: Complete Signup ----------------
export const completeSignup = async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    if (!password || !confirmPassword)
      return res.status(400).json({ success: false, message: "Password required" });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.emailVerified)
      return res.status(400).json({ success: false, message: "Email not verified yet" });

    const hash = await User.hashPassword(password);
    user.passwordHash = hash;
    user.role = role || "patient";

    await user.save();
    await sendWelcomeEmail(email, user.name);

    res.json({
      success: true,
      message: "Signup completed successfully",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.emailVerified) return res.status(400).json({ success: false, message: "Email not verified" });

    const isMatch = await user.checkPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    refreshTokensStore.set(refreshToken, user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ UPDATED: Added userId in response
    res.json({ 
      success: true, 
      message: "Login successful", 
      accessToken,
      userId: user._id.toString(),  // ✅ Added
      user: { 
        id: user._id.toString(),    // ✅ Added
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Refresh Token ----------------
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Refresh token required" });

    if (!refreshTokensStore.has(token)) return res.status(403).json({ success: false, message: "Invalid refresh token" });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// ---------------- Logout ----------------
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) refreshTokensStore.delete(token);

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during logout" });
  }
};

// ---------------- Forgot Password ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = user.generateOTP();
    await user.save();

    await sendOTPEmail(email, otp, user.name);

    res.json({ success: true, message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Reset Password ----------------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.verifyOTP(otp);

    const hash = await User.hashPassword(newPassword);
    user.passwordHash = hash;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- GET Profile ----------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-passwordHash -otpCode -otpExpiry -__v"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPDATE Profile ----------------
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {};

    const allowedFields = [
      "name",
      "phoneNumber",
      "address",
      "bloodGroup",
      "allergies",
      "chronicDiseases",
      "state",
      "district",
      "pincode",
      "language",
      "notificationPreference",
      "riskCategory",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-passwordHash -otpCode -otpExpiry -__v");

    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ---------------- GET All Users (name + email + role) ----------------
export const getAllUsers = async (req, res) => {
  try {
    // Include role field this time
    const users = await User.find({}, "name email role"); // fetch name, email, role
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ---------------- UPDATE User Role ----------------
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["patient", "medical expert"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user, message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE USER ----------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};