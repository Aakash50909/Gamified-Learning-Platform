import React from "react";
import { Trophy, Target, Code } from "lucide-react";
import RankBadge from "./RankBadge";

const MobilePlayerCard = ({ player, darkMode, onClick }) => {
  // Extract DSA stats safely
  const points = player?.points || 0;
  const problemsSolved = player?.stats?.totalCompleted || 0;
  const easyCompleted = player?.stats?.easyCompleted || 0;
  const mediumCompleted = player?.stats?.mediumCompleted || 0;
  const hardCompleted = player?.stats?.hardCompleted || 0;
  const rank = player?.rank || 0;
  const username = player?.username || "Anonymous";
  const avatar = player?.avatar || "👤";

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b ${
        darkMode
          ? "border-gray-700 hover:bg-gray-750"
          : "border-gray-200 hover:bg-gray-50"
      } cursor-pointer transition-all ${
        player?.isCurrentUser
          ? "bg-purple-500 bg-opacity-10 border-l-4 border-purple-500"
          : ""
      }`}>
      <div className="flex items-start space-x-3">
        <RankBadge rank={rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{getAvatarEmoji(avatar)}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{username}</div>
              {player?.isCurrentUser && (
                <div className="text-xs text-purple-500 font-bold">You</div>
              )}
              <div className="flex items-center space-x-3 text-sm mt-1">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  <span className="font-bold">{points.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-green-500" />
                  <span>{problemsSolved}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Total Points
              </span>
              <span className="font-bold text-yellow-500">
                {points.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-green-500">🟢 {easyCompleted}</span>
              <span className="text-yellow-500">🟡 {mediumCompleted}</span>
              <span className="text-red-500">🔴 {hardCompleted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAvatarEmoji = (avatar) => {
  const avatarMap = {
    ninja: "🥷",
    robot: "🤖",
    wizard: "🧙",
    scientist: "👨‍🔬",
    astronaut: "👨‍🚀",
    artist: "👨‍🎨",
  };
  return avatarMap[avatar] || avatar || "👤";
};

export default MobilePlayerCard;
