import React from "react";

const PerformanceCard = ({ title, value, icon: Icon, color, darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-sm font-medium ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
          {title}
        </h3>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default PerformanceCard;
