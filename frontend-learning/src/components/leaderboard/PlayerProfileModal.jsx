import React from "react";
import { Flame, Award } from "lucide-react";
import RankBadge from "./RankBadge";

const PlayerProfileModal = ({ player, darkMode, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-in`}>
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="text-5xl sm:text-6xl">{player.avatar}</div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold break-words">
              {player.username}
            </h2>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <RankBadge rank={player.rank} />
              <span
                className={`text-base sm:text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Rank #{player.rank}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className={`p-3 sm:p-4 rounded-xl ${
                darkMode ? "bg-gray-750" : "bg-gray-50"
              }`}>
              <div className="text-xl sm:text-2xl font-bold text-purple-500">
                {player.xp.toLocaleString()}
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Total XP
              </div>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-xl ${
                darkMode ? "bg-gray-750" : "bg-gray-50"
              }`}>
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                Level {player.level}
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Current Level
              </div>
            </div>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-xl ${
              darkMode ? "bg-gray-750" : "bg-gray-50"
            }`}>
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span className="font-bold text-sm sm:text-base">
                  {player.streak} Days
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="font-bold text-sm sm:text-base">
                  {player.badges} Badges
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;
