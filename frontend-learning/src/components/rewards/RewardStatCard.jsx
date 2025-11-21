import React from "react";

const RewardStatCard = ({
  icon,
  title,
  value,
  subtitle,
  darkMode,
  onClick,
  clickable,
}) => {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-4 sm:p-6 shadow-xl text-center ${
        clickable ? "cursor-pointer hover:scale-105" : ""
      } transition-all`}>
      <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{icon}</div>
      <div
        className={`text-xs sm:text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        } mb-1`}>
        {title}
      </div>
      <div className="text-xl sm:text-2xl font-bold capitalize">{value}</div>
      <div
        className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
        {subtitle}
      </div>
    </div>
  );
};

export default RewardStatCard;
