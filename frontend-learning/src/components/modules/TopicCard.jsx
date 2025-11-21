import React from "react";
import { Lock, Check } from "lucide-react";

const TopicCard = ({ topic, darkMode, onClick }) => {
  const getLevelColor = (level) => {
    if (level === "Beginner") return "from-green-500 to-emerald-500";
    if (level === "Intermediate") return "from-blue-500 to-cyan-500";
    return "from-purple-500 to-pink-500";
  };

  return (
    <div
      onClick={onClick}
      className={`${darkMode ? "bg-gray-750" : "bg-gray-50"} rounded-xl p-6 ${
        topic.locked
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-lg"
      } transition-all border-2 ${
        topic.completion === 100 ? "border-green-500" : "border-transparent"
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold">{topic.name}</h3>
            {topic.badge && <span className="text-2xl">{topic.badge}</span>}
            {topic.locked && <Lock className="w-5 h-5 text-gray-400" />}
          </div>

          <div className="flex items-center space-x-4 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getLevelColor(
                topic.level
              )}`}>
              {topic.level}
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
              {topic.xp} XP
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Progress
              </span>
              <span className="font-bold">{topic.completion}%</span>
            </div>
            <div
              className={`h-2 ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded-full overflow-hidden`}>
              <div
                className={`h-full bg-gradient-to-r ${getLevelColor(
                  topic.level
                )} transition-all duration-500`}
                style={{ width: `${topic.completion}%` }}
              />
            </div>
          </div>
        </div>

        {topic.completion === 100 && (
          <div className="ml-4 bg-green-500 rounded-full p-2">
            <Check className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;
