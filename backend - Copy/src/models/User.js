import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    uniqueUserId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: /^[0-9]{10}$/,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format"],
    },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    emailVerified: { type: Boolean, default: false },

    // Optional / fill later
    profilePicture: { type: String, default: "" },
    address: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    allergies: { type: String, default: "" },
    chronicDiseases: { type: String, default: "" },

    // Optional location details
    state: { type: String, default: "" },
    district: { type: String, default: "", index: true },
    pincode: { type: String, match: /^[0-9]{6}$/, default: "" },

    // Communication
    language: {
      type: String,
      enum: ["en", "hi", "ta", "te", "bn", "mr"],
      default: "hi",
    },

    notificationPreference: {
      whatsapp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      
    },

    // Health Risk Category
    riskCategory: {
      type: String,
      enum: ["normal", "elderly", "pregnant", "child", "chronic_disease"],
      default: "normal",
    },

    isActive: { type: Boolean, default: true },

    // OTP
    otpCode: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

// ---------------- Password hashing ----------------
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// ---------------- Check password ----------------
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// ---------------- Generate OTP ----------------
userSchema.methods.generateOTP = function () {
  const otp = crypto.randomInt(100000, 999999).toString();
  this.otpCode = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// ---------------- Verify OTP ----------------
userSchema.methods.verifyOTP = function (otp) {
  if (!this.otpCode || !this.otpExpiry) throw new Error("OTP not generated");
  if (this.otpExpiry < new Date()) throw new Error("OTP expired");
  if (this.otpCode !== otp) throw new Error("Invalid OTP");

  this.emailVerified = true;
  this.otpCode = undefined;
  this.otpExpiry = undefined;
};

// Allow resend OTP only after expiry
userSchema.methods.canResendOTP = function () {
  if (!this.otpExpiry) return true;
  return (this.otpExpiry - new Date()) / 1000 < 0;
};

const User = mongoose.model("User", userSchema);
export default User;
