import React from "react";
import RankBadge from "./RankBadge";

const LeaderboardRow = ({ player, darkMode, isEven, onClick }) => {
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
    <tr
      onClick={onClick}
      className={`${
        player?.isCurrentUser
          ? "bg-purple-500 bg-opacity-10 border-l-4 border-purple-500"
          : isEven
          ? darkMode
            ? "bg-gray-800"
            : "bg-white"
          : darkMode
          ? "bg-gray-750"
          : "bg-gray-50"
      } hover:bg-purple-500 hover:bg-opacity-10 transition-all cursor-pointer`}>
      <td className="px-6 py-4">
        <RankBadge rank={rank} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getAvatarEmoji(avatar)}</div>
          <div>
            <div className="font-bold">{username}</div>
            {player?.isCurrentUser && (
              <div className="text-xs text-purple-500 font-bold">You</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold text-yellow-500 text-lg">
          {points.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold">{problemsSolved}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-green-500">🟢 {easyCompleted}</span>
          <span className="text-yellow-500">🟡 {mediumCompleted}</span>
          <span className="text-red-500">🔴 {hardCompleted}</span>
        </div>
      </td>
    </tr>
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

export default LeaderboardRow;
