import React from "react";

const StatCard = ({ title, value, icon, color, darkMode }) => {
  const Icon = icon;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-750" : "bg-gray-50"
      } rounded-xl p-4 text-center`}>
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <div className="text-2xl font-bold">{value}</div>
      <div
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {title}
      </div>
    </div>
  );
};

export default StatCard;
