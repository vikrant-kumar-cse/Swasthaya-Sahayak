import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { apiService } from '../services/api';
import { ALERT_LEVEL_COLORS } from '../utils/constants';

const AllOutbreaks = () => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutbreaks();
  }, []);

  useEffect(() => {
    const filtered = outbreaks.filter(item =>
      item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disease.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, outbreaks]);

  const fetchOutbreaks = async () => {
    try {
      const data = await apiService.getAllOutbreaks();
      setOutbreaks(data.data);
      setFilteredData(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching outbreaks:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading Outbreaks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 mt-[10vh] md:mt-0">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#004d40] ">All Outbreak Records</h1>
          <div className="text-sm text-gray-600">
            Total Records: <span className="font-bold">{filteredData.length}</span>
          </div>
        </div>

        {/* Search */}
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by district or disease..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1] focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disease</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, idx) => {
                const colors = ALERT_LEVEL_COLORS[item.alertLevel] || ALERT_LEVEL_COLORS.NORMAL;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.district}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.disease}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.cases}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(item.reportDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                        {item.alertLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AllOutbreaks;
