import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, MapPin, RefreshCw, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';
import { ALERT_LEVEL_COLORS } from '../utils/constants';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const [statsData, outbreaksData] = await Promise.all([
        apiService.getStats(),
        apiService.getAllOutbreaks()
      ]);

      setStats(statsData.data);
      setRecentAlerts(outbreaksData.data?.slice(0, 5) || []);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setError('Failed to load dashboard. Please ensure backend is running on port 8080.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="text-xl text-gray-600">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 text-center mb-3">Connection Error</h3>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
     
      <div className="min-h-screen bg-gray-100 p-6 mt-[10vh] md:mt-0 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-[#004d40] -800">Disease Outbreak Dashboard</h1>
            <p className="text-sm text-[#004d40] -500 mt-1">Real-time monitoring and analysis system</p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="px-6 py-3 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white rounded-xl hover:shadow-lg transition disabled:opacity-70 flex items-center gap-2 font-semibold"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 border-blue-500">
            <Activity className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Outbreaks</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalOutbreaks || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 border-red-500">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 border-green-500">
            <MapPin className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Diseases Tracked</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.byDisease?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
            <span className="text-sm text-gray-500">
              {recentAlerts.length > 0 ? `Showing ${recentAlerts.length} most recent` : 'No alerts'}
            </span>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No Alerts Found</p>
              <p className="text-sm mb-4">Generate mock data or add records to see alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert, idx) => {
                const colors = ALERT_LEVEL_COLORS[alert.alertLevel] || ALERT_LEVEL_COLORS.NORMAL;
                let formattedDate = 'N/A';
                try {
                  formattedDate = new Date(alert.reportDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                } catch (e) {}

                return (
                  <div
                    key={alert._id || idx}
                    className={`p-4 rounded-lg border-l-4 ${colors.light} ${colors.border} hover:shadow-lg transition cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{alert.district} - {alert.disease}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                            {alert.alertLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Cases:</span>
                            <span className="font-bold text-gray-800">{alert.casesCount ?? 'N/A'}</span>
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Diseases & Districts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Top Diseases */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Top Diseases
            </h3>
            <div className="space-y-2">
              {stats?.byDisease?.slice(0, 3).map((disease, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm">
                  <span className="font-medium text-gray-800">{disease._id}</span>
                  <span className="font-bold text-blue-600">{disease.totalcases}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Districts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Top Districts
            </h3>
            <div className="space-y-2">
              {stats?.byDistrict?.slice(0, 3).map((district, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm">
                  <span className="font-medium text-gray-800">{district._id}</span>
                  <span className="font-bold text-green-600">{district.totalCases}</span>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">No district data available</p>
              )}
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
