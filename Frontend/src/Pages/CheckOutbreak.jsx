import { useState } from "react";
import axios from "axios";

export default function CheckOutbreak() {
  const [district, setDistrict] = useState("");
  const [disease, setDisease] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!district || !disease) {
      setError("Please select district and disease.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:8080/api/outbreaks/check?district=${district}&disease=${disease}`
      );

      setResult(res.data);
    } catch (err) {
      setError("Unable to fetch data.");
    }

    setLoading(false);
  };

  const districts = [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad",
    "Solapur", "Amravati", "Kolhapur", "Parbhani", "Jalgaon",
    "Latur", "Dhule", "Ahmednagar", "Satara", "Ratnagiri",
    "Sangli", "Yavatmal", "Nanded"
  ];

  const diseases = [
    "Dengue", "Malaria", "COVID-19", "Food Poisoning",
    "Gastroenteritis", "Typhoid", "Viral Fever"
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-xl">
        
        <h1 className="text-2xl font-bold text-center mb-4">
           Check Disease Outbreak
        </h1>

        {/* DISTRICT */}
        <label className="block font-medium mb-1">Select District</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3"
        >
          <option value="">-- Choose District --</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* DISEASE */}
        <label className="block font-medium mb-1">Select Disease</label>
        <select
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3"
        >
          <option value="">-- Choose Disease --</option>
          {diseases.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* CHECK BTN */}
        <button
          onClick={handleCheck}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Checking..." : "Check Outbreak"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="mt-3 text-red-600 font-medium">{error}</p>
        )}

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>

            {/* NO OUTBREAK */}
            {result.message === "Insufficient data for analysis" && (
              <p className="text-gray-700">
                ⚪ <b>No outbreak detected.</b><br />
                Reason: {result.debug.reason}
              </p>
            )}

            {/* OUTBREAK DETECTED */}
            {result.data && result.data.isOutbreak && (
              <div className="text-red-600 font-semibold">
                🔴 OUTBREAK DETECTED!
                <p className="text-black mt-2">
                  <b>Disease:</b> {result.data.disease} <br />
                  <b>District:</b> {district} <br />
                  <b>Alert Level:</b> {result.data.alertLevel} <br />
                  <b>Cases Spike:</b> {result.data.currentWeekCount} (This Week)
                </p>

                <p className="mt-3 p-2 bg-red-100 rounded-md">
                  {result.data.alertMessage}
                </p>
              </div>
            )}

            {/* SAFE CASE */}
            {result.data && !result.data.isOutbreak && (
              <p className="text-green-600 font-semibold">
                🟢 No outbreak. Situation normal.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
