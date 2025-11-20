import React from "react";
import { Award, Lock } from "lucide-react";
import { BADGES, userData } from "../../api/mockData";

const BadgeCard = ({ badge, unlocked, darkMode }) => {
  return (
    <div
      className={`group relative p-4 rounded-xl text-center transition-all ${
        unlocked
          ? `bg-gradient-to-br ${badge.color} shadow-lg hover:scale-105 cursor-pointer`
          : darkMode
          ? "bg-gray-750 opacity-40"
          : "bg-gray-100 opacity-40"
      }`}>
      <div className={`text-4xl mb-2 ${!unlocked && "grayscale"}`}>
        {badge.icon}
      </div>
      <h4
        className={`font-bold text-sm ${
          unlocked ? "text-white" : darkMode ? "text-gray-500" : "text-gray-400"
        }`}>
        {badge.name}
      </h4>
      {!unlocked && (
        <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-500" />
      )}
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
        {badge.description}
      </div>
    </div>
  );
};

const AchievementGrid = ({ darkMode }) => {
  const allBadges = Object.values(BADGES);
  const unlockedBadges = allBadges.filter((b) =>
    userData.unlockedBadges.includes(b.id)
  );
  const lockedBadges = allBadges.filter(
    (b) => !userData.unlockedBadges.includes(b.id)
  );

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Achievements</span>
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
          {unlockedBadges.length}/{allBadges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {unlockedBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={true}
            darkMode={darkMode}
          />
        ))}
        {lockedBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={false}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementGrid;
