import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { DISTRICTS, DISEASES } from '../utils/constants';

const CheckOutbreak = () => {
  const [district, setDistrict] = useState('');
  const [disease, setDisease] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkOutbreak = async () => {
    if (!district || !disease) {
      alert('Please select both district and disease');
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.checkOutbreak(district, disease);
      setResult(data);
    } catch (error) {
      console.error('Error checking outbreak:', error);
    }
    setLoading(false);
  };

  // THEME-BASED ALERT COLORS
  const getAlertHeaderStyle = (level) => {
    switch (level) {
      case "NORMAL":
        return "bg-green-600";
      case "CRITICAL":
        return "bg-red-600";
      case "MODERATE":
        return "bg-orange-500";
      default:
        return "bg-gradient-to-r from-[#00796b] to-[#00acc1]";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-[10vh] px-4">

      <h1 className="text-3xl font-bold text-[#004d40] text-center">
        Check Outbreak Status
      </h1>

      {/* Input Card */}
      <div className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-6 border border-[#00acc1]/20">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* District */}
          <div>
            <label className="block text-sm font-medium text-[#004d40] mb-2">
              Select District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2 border border-[#00acc1]/30 rounded-lg 
              focus:ring-2 focus:ring-[#00acc1] focus:border-transparent"
            >
              <option value="">Choose District</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Disease */}
          <div>
            <label className="block text-sm font-medium text-[#004d40] mb-2">
              Select Disease
            </label>
            <select
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full px-4 py-2 border border-[#00acc1]/30 rounded-lg 
              focus:ring-2 focus:ring-[#00acc1] focus:border-transparent"
            >
              <option value="">Choose Disease</option>
              {DISEASES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={checkOutbreak}
          disabled={loading}
          className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-all
          bg-gradient-to-r from-[#00796b] to-[#00acc1] hover:opacity-90
          disabled:from-gray-400 disabled:to-gray-400"
        >
          {loading ? 'Checking...' : 'Check Outbreak Status'}
        </button>
      </div>

      {/* Result */}
      {result && result.status === 'success' && result.data && (
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-xl p-6 border border-[#00acc1]/20">

          {/* Alert Header */}
          <div
            className={`${getAlertHeaderStyle(result.data.alertLevel)} text-white rounded-lg p-6 mb-6 shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {result.data.alertLevel} ALERT
                </h3>
                <p className="text-lg">{district} - {disease}</p>
              </div>
              <AlertTriangle className="w-16 h-16" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Current Cases", value: result.data.currentCases },
              { label: "Average Cases", value: result.data.averageCases },
              { label: "Outbreak Status", value: result.data.isOutbreak ? "YES" : "NO" }
            ].map((item, i) => (
              <div key={i} className="bg-[#e0f7fa] rounded-lg p-4 shadow-sm">
                <p className="text-sm text-[#004d40]">{item.label}</p>
                <p className="text-2xl font-bold text-[#00796b]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="bg-[#00acc1]/15 border border-[#00acc1]/30 rounded-lg p-4">
            <p className="whitespace-pre-line text-[#004d40]">{result.data.alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutbreak;
