import React from "react";
import { Crown, Flame, Award, ArrowUp, ArrowDown, Minus } from "lucide-react";
import RankBadge from "./RankBadge";

const LeaderboardRow = ({ player, darkMode, isEven, onClick }) => {
  const getRankChangeIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <tr
      onClick={onClick}
      className={`${
        isEven
          ? darkMode
            ? "bg-gray-800"
            : "bg-white"
          : darkMode
          ? "bg-gray-750"
          : "bg-gray-50"
      } hover:bg-purple-500 hover:bg-opacity-10 cursor-pointer transition-all`}>
      <td className="px-6 py-4">
        <RankBadge rank={player.rank} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{player.avatar}</div>
          <div>
            <div className="font-bold">{player.username}</div>
            <div className="flex items-center space-x-1 text-sm text-orange-500">
              <Flame className="w-3 h-3" />
              <span>{player.streak} day streak</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="font-bold">{player.level}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold text-purple-500">
          {player.xp.toLocaleString()}
        </div>
        <div
          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          +{player.weeklyXP} this week
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <Award className="w-4 h-4 text-yellow-500" />
          <span className="font-bold">{player.badges}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          {getRankChangeIcon(player.rankChange)}
          <span className="text-sm font-medium">
            {Math.abs(player.rankChange)}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default LeaderboardRow;
