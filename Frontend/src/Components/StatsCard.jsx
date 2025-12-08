import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, borderColor }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor} hover:shadow-lg transition`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-800">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
        </div>
        <div className={`bg-opacity-10 ${color} bg-current rounded-full p-4`}>
          <Icon className={`w-10 h-10 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;