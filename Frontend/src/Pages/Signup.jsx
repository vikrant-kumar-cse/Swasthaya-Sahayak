import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8080/auth/start", {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
      });

      if (res.data.success) {
        setSuccess(res.data.message || "OTP sent to your email!");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!form.otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8080/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });

      if (res.data.success) {
        setSuccess(res.data.message || "OTP verified successfully!");
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Signup (Set Password)
  const handleCompleteSignup = async () => {
    const newErrors = {};
    if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8080/auth/complete", {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (res.data.success) {
        setSuccess(res.data.message || "Signup completed successfully!");
        setStep(4); // Show success screen
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row max-w-4xl w-full rounded-xl shadow-lg overflow-hidden bg-white">

          {/* LEFT PANEL */}
          <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white p-10">
            <div
              className="w-40 h-40 rounded-full border-4 border-white bg-cover bg-center mb-6"
              style={{ backgroundImage: "url('/MedPulse logo.jpg')" }}
            />
            <h2 className="text-3xl font-bold mb-3 text-center">
              Join <span className="text-yellow-400">MedPulse</span>
            </h2>
            <p className="text-lg text-center">
              Get AI-driven healthcare alerts & preventive tools.
            </p>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-teal-900 mb-6 text-center">
              Create your MedPulse account
            </h2>

            {error && <div className="mb-4 text-red-600 text-center font-medium">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-center font-medium">{success}</div>}

            {/* STEP 1: Send OTP */}
            {step === 1 && (
              <div className="space-y-4">
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00acc1]" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00acc1]" />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00acc1]" />
                <button onClick={handleSendOTP} disabled={loading} className="w-full py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {/* STEP 2: Verify OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <input type="text" name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00acc1]" />
                <button onClick={handleVerifyOTP} disabled={loading} className="w-full py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {/* STEP 3: Set Password */}
            {step === 3 && (
              <div className="space-y-4">
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00acc1]" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00acc1]" />
                <button onClick={handleCompleteSignup} disabled={loading} className="w-full py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                  {loading ? "Completing..." : "Complete Signup"}
                </button>
              </div>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <div className="text-center space-y-4">
                <div className="text-5xl text-green-500">✓</div>
                <h3 className="text-xl font-semibold">Account Created Successfully!</h3>
                <p>Your email has been verified. You can now continue.</p>
                <button onClick={() => navigate("/login")} className="w-full py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                  Continue to Login
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-sm space-y-1">
              <div>
                Already have an account?{" "}
                <Link to="/login" className="text-[#00acc1] font-semibold hover:underline">Login</Link>
              </div>
              <div>
                <Link to="/forgot-password" className="text-[#00acc1] font-semibold hover:underline">Forgot Password?</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
