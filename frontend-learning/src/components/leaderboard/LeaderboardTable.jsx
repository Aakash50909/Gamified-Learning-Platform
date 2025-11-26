import React from "react";
import { Trophy } from "lucide-react";
import MobilePlayerCard from "./MobilePlayerCard";
import LeaderboardRow from "./LeaderboardRow";

const LeaderboardTable = ({ players, darkMode, setSelectedPlayer }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl overflow-hidden`}>
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          <span>DSA Rankings</span>
        </h2>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {players.map((player) => (
          <MobilePlayerCard
            key={player.userId || player.id}
            player={player}
            darkMode={darkMode}
            onClick={() => setSelectedPlayer && setSelectedPlayer(player)}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? "bg-gray-750" : "bg-gray-50"}`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Player
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Points
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Problems Solved
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Breakdown
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <LeaderboardRow
                key={player.userId || player.id}
                player={player}
                darkMode={darkMode}
                isEven={idx % 2 === 0}
                onClick={() => setSelectedPlayer && setSelectedPlayer(player)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
