import React from "react";

const RankBadge = ({ rank }) => {
  const getBadgeStyle = (rank) => {
    if (rank === 1)
      return {
        emoji: "🥇",
        color: "from-yellow-400 to-yellow-600",
        glow: "shadow-yellow-500/50",
      };
    if (rank === 2)
      return {
        emoji: "🥈",
        color: "from-gray-300 to-gray-500",
        glow: "shadow-gray-400/50",
      };
    if (rank === 3)
      return {
        emoji: "🥉",
        color: "from-orange-400 to-orange-600",
        glow: "shadow-orange-500/50",
      };
    return {
      emoji: null,
      color: "from-blue-400 to-blue-600",
      glow: "shadow-blue-500/30",
    };
  };

  const style = getBadgeStyle(rank);

  return (
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${style.color} shadow-lg ${style.glow} transform hover:scale-110 transition-all`}>
      {style.emoji ? (
        <span className="text-2xl">{style.emoji}</span>
      ) : (
        <span className="text-white font-bold text-lg">#{rank}</span>
      )}
    </div>
  );
};

export default RankBadge;
