import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

const PatientQueryForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    symptomsDuration: "",
    symptoms: "",
    medicalHistory: "",
  });
  const [medicalReport, setMedicalReport] = useState(null);
  const [queries, setQueries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMedicalReport(e.target.files[0]);
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (medicalReport) data.append("medicalReport", medicalReport);

    try {
      const res = await axios.post(`${BASE_URL}/api/patient-query/submit`, data);
      if (res.data.success) {
        alert(res.data.message);
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          age: "",
          gender: "",
          symptomsDuration: "",
          symptoms: "",
          medicalHistory: "",
        });
        setMedicalReport(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error! Please try again.");
    }
  };

  // ---------------- TOGGLE HISTORY ----------------
  const toggleHistory = async () => {
    if (!showHistory) {
      try {
        const res = await axios.get(`${BASE_URL}/api/patient-query/all`);
        if (res.data.success) {
          setQueries(res.data.queries.slice(0, 10)); // show only last 10
        }
      } catch (err) {
        console.error("Failed to fetch queries", err);
      }
    }
    setShowHistory(!showHistory); // toggle visibility
  };

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex flex-col items-center py-10">

      {/* ---------------- FORM ---------------- */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 mb-6 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-blue-700 uppercase text-center mb-6">
          Patient Health Query Form
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text" name="fullName" placeholder="Full Name" required
            value={formData.fullName} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email" name="email" placeholder="Email" required
            value={formData.email} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text" name="mobile" placeholder="Mobile" required
            value={formData.mobile} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number" name="age" placeholder="Age" required
            value={formData.age} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          <select
            name="gender" required value={formData.gender} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            type="number" name="symptomsDuration" placeholder="Symptoms Duration (Days)" required
            value={formData.symptomsDuration} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          <textarea
            name="symptoms" placeholder="Symptoms" required
            value={formData.symptoms} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 md:col-span-2 h-24"
          />
          <textarea
            name="medicalHistory" placeholder="Medical History" required
            value={formData.medicalHistory} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 md:col-span-2 h-24"
          />
          <input
            type="file" onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 md:col-span-2"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white px-10 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-md md:col-span-2"
          >
            Submit Query
          </button>
        </form>
      </div>

      {/* ---------------- TOGGLE HISTORY BUTTON ---------------- */}
      <button
        onClick={toggleHistory}
        className="bg-gradient-to-r from-[#0288d1] to-[#26c6da] text-white px-8 py-3 rounded-2xl text-lg shadow-lg hover:opacity-90 transition-all font-semibold mb-6"
      >
        {showHistory ? "Hide Previous Health Queries" : "Show Previous Health Queries"}
      </button>

      {/* ---------------- DISPLAY LAST 10 QUERIES ---------------- */}
      {showHistory && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {queries.map((item) => (
            <div key={item._id} className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg">{item.fullName}</h3>
              <p className="text-gray-600">Email: {item.email}</p>
              <p className="text-gray-600">Mobile: {item.mobile}</p>
              <p className="text-gray-600">Age: {item.age}</p>
              <p className="text-gray-600">Gender: {item.gender}</p>
              <p className="text-gray-600">Duration: {item.symptomsDuration} days</p>
              <p className="text-gray-700">Symptoms: {item.symptoms}</p>
              <p className="text-gray-700">History: {item.medicalHistory}</p>
              {item.medicalReport && (
                <a
                  href={`${BASE_URL}/${item.medicalReport}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold mt-2 inline-block"
                >
                  View / Download Report
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientQueryForm;