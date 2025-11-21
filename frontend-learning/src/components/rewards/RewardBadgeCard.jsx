import React from "react";
import { Lock } from "lucide-react";

const RewardBadgeCard = ({ badge, earned, darkMode }) => {
  return (
    <div
      className={`group relative p-4 sm:p-6 rounded-xl text-center transition-all ${
        earned
          ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:scale-105 cursor-pointer"
          : darkMode
          ? "bg-gray-750 opacity-40"
          : "bg-gray-100 opacity-40"
      }`}>
      <div className={`text-3xl sm:text-4xl mb-2 ${!earned && "grayscale"}`}>
        {badge.icon}
      </div>
      <h4
        className={`font-bold text-xs sm:text-sm ${
          earned ? "text-white" : darkMode ? "text-gray-500" : "text-gray-400"
        }`}>
        {badge.name}
      </h4>
      {earned && badge.earnedDate && (
        <div className="text-xs text-white text-opacity-75 mt-1">
          {new Date(badge.earnedDate).toLocaleDateString()}
        </div>
      )}
      {!earned && (
        <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-500" />
      )}
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10`}>
        {badge.description}
      </div>
    </div>
  );
};

export default RewardBadgeCard;
