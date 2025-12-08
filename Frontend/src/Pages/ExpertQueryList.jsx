import React, { useEffect, useState } from "react";
import axios from "axios";

const ExpertQueryList = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:8080";

  // Fetch all patient queries
  const fetchQueries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/patient-query/all`);
      if (res.data.success) {
        setQueries(res.data.queries);
      } else {
        setError("Failed to fetch queries.");
      }
    } catch (err) {
      console.error("Error fetching queries:", err);
      setError("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="p-6 mt-[10vh]">
      <h2 className="text-2xl font-bold text-center text-[#00796b] mb-6">
        Patient Health Queries
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Loading */}
        {loading && (
          <p className="text-center col-span-2 text-gray-500">Loading queries...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center col-span-2 text-red-500">{error}</p>
        )}

        {/* No queries */}
        {!loading && !error && queries.length === 0 && (
          <p className="text-center col-span-2 text-gray-500">No queries found.</p>
        )}

        {/* Display queries */}
        {!loading &&
          !error &&
          queries.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 shadow-md rounded-xl border-l-4 border-[#00796b]"
            >
              <h3 className="text-lg font-semibold text-gray-800">{item.fullName}</h3>
              <p className="text-sm text-gray-500">
                Age: {item.age} | Gender: {item.gender}
              </p>
              <p className="text-sm text-gray-500">Email: {item.email}</p>
              <p className="text-sm text-gray-500 mb-2">Mobile: {item.mobile}</p>

              <p className="text-gray-700">
                <strong>Symptoms Duration:</strong> {item.symptomsDuration} days
              </p>
              <p className="text-gray-700">
                <strong>Symptoms:</strong> {item.symptoms}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Medical History:</strong> {item.medicalHistory}
              </p>

              {item.medicalReport && (
                <a
                  href={`${BASE_URL}/${item.medicalReport}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold mt-3 inline-block"
                >
                  View / Download Report
                </a>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ExpertQueryList;
