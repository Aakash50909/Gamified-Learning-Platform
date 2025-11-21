import React from "react";

const InsightCard = ({ title, value, icon: Icon, darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl text-center`}>
      <Icon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
      <h4
        className={`text-sm font-medium mb-2 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
        {title}
      </h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default InsightCard;
