import React from "react";
import {
  TrendingUp,
  Zap,
  Crown,
  Flame,
  Trophy,
  Award,
  Book,
} from "lucide-react";
import { userData } from "../../api/mockData";

const StatItem = ({ icon: Icon, label, value, color, darkMode }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {label}
        </span>
      </div>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
};

const QuickStats = ({ darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl space-y-6`}>
      <h3 className="text-xl font-bold flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <span>Quick Stats</span>
      </h3>

      <div className="space-y-4">
        <StatItem
          icon={Zap}
          label="Total XP"
          value={userData.xp.toLocaleString()}
          color="text-purple-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Crown}
          label="Level"
          value={userData.level}
          color="text-yellow-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Flame}
          label="Current Streak"
          value={`${userData.streak} days`}
          color="text-orange-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Trophy}
          label="Global Rank"
          value={`#${userData.rank}`}
          color="text-blue-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Award}
          label="Badges Earned"
          value={userData.totalBadges}
          color="text-pink-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Book}
          label="Quizzes Done"
          value={userData.quizzesCompleted}
          color="text-green-500"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default QuickStats;
