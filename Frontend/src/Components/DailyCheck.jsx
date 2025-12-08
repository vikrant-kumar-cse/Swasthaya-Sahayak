import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';

const DailyCheck = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDailyCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiService.runDailyCheck();
      setResult(response);
      console.log('Daily Check SUCCESS:', response);
    } catch (err) {
      console.error('Daily Check ERROR:', err);
      setError('Failed to run daily check. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 mt-[10vh] md:mt-0">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-[#004d40]  text-center">Run Daily Outbreak Check</h1>
        <p className="text-gray-600 text-center">
          This will analyze all outbreak records and update alerts based on latest data.
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={handleDailyCheck}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white rounded-lg hover:shadow-lg transition flex items-center gap-2 font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running...' : 'Run Daily Check'}
          </button>
        </div>

        {/* Success Result */}
        {result && (
          <div className="bg-green-50 border border-green-300 p-5 rounded-lg flex items-start gap-3 mt-4">
            <CheckCircle className="text-green-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-bold text-green-700 text-lg">Daily Check Completed</h3>
              <p className="text-green-700 mt-1">
                {result.message || 'Outbreak records successfully updated.'}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 p-5 rounded-lg flex items-start gap-3 mt-4">
            <AlertTriangle className="text-red-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-bold text-red-700 text-lg">Error Running Check</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCheck;
