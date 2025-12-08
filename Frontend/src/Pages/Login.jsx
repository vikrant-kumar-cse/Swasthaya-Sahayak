import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if user already logged in
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (token && user?.role) redirectByRole(user.role);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "patient":
        navigate("/dashboard");
        break;
      case "doctor":
        navigate("/medical-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:8080/auth/login",
        form,
        {
          withCredentials: true, // important for refresh token cookies
        }
      );

      if (res.data.success) {
        const { accessToken, userId, user } = res.data;

        // ✅ Store accessToken (both keys for compatibility)
        localStorage.setItem("token", accessToken);
        localStorage.setItem("accessToken", accessToken);
        
        // ✅ Store userId
        localStorage.setItem("userId", userId);
        
        // ✅ Store user details
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Generate or retrieve session ID for chatbot
        let sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          sessionId = `session_${userId}_${Date.now()}`;
          localStorage.setItem("sessionId", sessionId);
        }

        console.log("✅ Login successful");
        console.log("👤 User ID:", userId);
        console.log("🔑 Access Token:", accessToken.substring(0, 20) + "...");
        console.log("🎫 Session ID:", sessionId);

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => redirectByRole(user.role), 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Invalid email or password"
      );
      if (err.response?.status === 401) {
        setForm((prev) => ({ ...prev, password: "" }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl w-full">
          {/* LEFT PANEL */}
          <div className="md:flex-1 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white flex flex-col items-center justify-center p-10">
            <img
              src="/MedPulse logo.jpg"
              alt="MedPulse Logo"
              className="w-36 h-36 mb-6 rounded-full border-4 border-white object-cover"
            />
            <h2 className="text-3xl font-bold mb-2 text-center">
              Welcome to <span className="text-yellow-400">MedPulse</span>
            </h2>
            <p className="text-center text-lg">
              AI-driven healthcare alerts & preventive tools at your fingertips.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:flex-1 p-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-teal-900">
              Login to your account
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                {errors.email && <p className="text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                {errors.password && (
                  <p className="text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#00796b] to-[#00acc1] hover:shadow-lg transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading || !form.email || !form.password}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="mt-4 text-center space-y-1">
                <div>
                  <Link
                    to="/forgot-password"
                    className="text-cyan-600 font-semibold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-cyan-600 font-semibold hover:underline"
                  >
                    Sign up here
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;