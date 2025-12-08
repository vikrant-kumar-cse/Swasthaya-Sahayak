import React from 'react';
import { Activity, Search, BarChart3, FileText } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'check', name: 'Check Outbreak', icon: Search },
    { id: 'statistics', name: 'Statistics', icon: BarChart3 },
    { id: 'outbreaks', name: 'All Records', icon: FileText },
    { id: 'dailycheck', name: 'Daily Check', icon: Activity }
];


  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          🏥 Outbreak Monitor
        </h1>
        <p className="text-xs text-gray-500 mt-1">Disease Tracking System</p>
      </div>
      
      <nav className="mt-6">
        {navigation.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Backend Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-800">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
