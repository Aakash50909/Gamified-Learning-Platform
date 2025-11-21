import React from "react";
import { Flame, Play } from "lucide-react";

const SkillCard = ({ skill, darkMode, onClick }) => {
  const Icon = skill.icon;
  const progress = (skill.xp / skill.maxXp) * 100;

  return (
    <div
      onClick={onClick}
      className={`${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-2xl"
      } rounded-2xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-500`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${skill.color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">{skill.streak}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
      <div className="flex items-center space-x-2 mb-3">
        <span
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Level {skill.level}
        </span>
        <span className="text-yellow-500">⭐</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
            XP Progress
          </span>
          <span className="font-bold">
            {skill.xp}/{skill.maxXp}
          </span>
        </div>
        <div
          className={`h-3 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded-full overflow-hidden`}>
          <div
            className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        className={`w-full mt-4 py-2 bg-gradient-to-r ${skill.color} text-white font-bold rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity`}>
        <Play className="w-4 h-4" />
        <span>Continue Learning</span>
      </button>
    </div>
  );
};

export default SkillCard;
