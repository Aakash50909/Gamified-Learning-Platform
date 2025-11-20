import React from "react";
import { Crown, Flame, Award, ArrowUp, ArrowDown, Minus } from "lucide-react";
import RankBadge from "./RankBadge";

const MobilePlayerCard = ({ player, darkMode, onClick }) => {
  const getRankChangeIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-500" />;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b ${
        darkMode
          ? "border-gray-700 hover:bg-gray-750"
          : "border-gray-200 hover:bg-gray-50"
      } cursor-pointer transition-all`}>
      <div className="flex items-start space-x-3">
        <RankBadge rank={player.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{player.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{player.username}</div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span>{player.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-3 h-3 text-purple-500" />
                  <span>{player.badges}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getRankChangeIcon(player.rankChange)}
                  <span>{Math.abs(player.rankChange)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                XP
              </span>
              <span className="font-bold text-purple-500">
                {player.xp.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>{player.streak} day streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerCard;
