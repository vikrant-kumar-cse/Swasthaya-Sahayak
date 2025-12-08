import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // Step 1: Send OTP to email
  const sendOTP = async () => {
    if (!form.email.trim()) return setError("Please enter your email");
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await axios.post("http://localhost:8080/auth/forgot-password", { email: form.email });
      if (res.data.success) {
        setSuccess("OTP sent to your email.");
        setStep(2);
      } else setError(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  // Step 2: Verify OTP (simply go to next step)
  const verifyOTP = async () => {
    if (!form.otp.trim()) return setError("Please enter OTP");
    setStep(3);
  };

  // Step 3: Reset password
  const resetPassword = async () => {
    if (!form.newPassword.trim() || !form.confirmPassword.trim())
      return setError("Please enter and confirm your password");
    if (form.newPassword !== form.confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    setError(""); setSuccess("");

    try {
      const res = await axios.post("http://localhost:8080/auth/reset-password", {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      if (res.data.success) {
        setSuccess(res.data.message || "Password reset successfully! You can now login.");
        setStep(1);
        setForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
      } else setError(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row max-w-4xl w-full rounded-xl shadow-lg overflow-hidden bg-white">

          {/* Left Panel */}
          <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white p-10">
            <img
              src="/MedPulse logo.jpg"
              alt="Forgot Password"
              className="w-48 h-48 mb-6 rounded-full border-4 border-white object-cover"
            />
            <h2 className="text-3xl font-bold mb-3 text-center">
              Recover <span className="text-yellow-400">Password</span>
            </h2>
            <p className="text-lg text-center">
              Get back access to your MedPulse account quickly and securely.
            </p>
          </div>

          {/* Right Form Panel */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-teal-900 mb-6 text-center">Forgot Password</h2>

            {error && <div className="mb-4 text-red-600 text-center font-medium">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-center font-medium">{success}</div>}

            <form className="space-y-4">

              {/* Step 1: Enter Email */}
              {step === 1 && (
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                  />
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              )}

              {/* Step 2: Enter OTP */}
              {step === 2 && (
                <div>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={form.otp}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}

              {/* Step 3: Enter New Password & Confirm Password */}
              {step === 3 && (
                <div className="space-y-4">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                  />
                  <button
                    type="button"
                    onClick={resetPassword}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-[#00acc1] font-semibold hover:underline">Back to Login</Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
