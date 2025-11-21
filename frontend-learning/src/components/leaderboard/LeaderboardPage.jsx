import React, { useState, useEffect } from "react";
import { Trophy, Globe, Users, Activity } from "lucide-react";
import { useLeaderboardData } from "../../hooks/useLeaderboardData";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorDisplay } from "../common/ErrorDisplay";
import LeaderboardTable from "./LeaderboardTable";
import { leaderboardData } from "../../api/mockData";
import PlayerProfileModal from "./PlayerProfileModal";

const LeaderboardPage = ({ darkMode, leaderboardType, setLeaderboardType }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const {
    data: leaderboardPlayers,
    loading,
    error,
  } = useLeaderboardData(leaderboardType);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading rankings...
          </p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
        </div>
        <ErrorDisplay message={error} darkMode={darkMode} />
      </div>
    );
  }

  const currentLeaderboard =
    leaderboardPlayers || leaderboardData[leaderboardType];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Global Leaderboard
        </h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Compete with the best and climb to the top
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLeaderboardType("global")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              leaderboardType === "global"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            }`}>
            <Globe className="w-4 h-4" />
            <span>Global</span>
          </button>
          <button
            onClick={() => setLeaderboardType("friends")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              leaderboardType === "friends"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            }`}>
            <Users className="w-4 h-4" />
            <span>Friends</span>
          </button>
          <button
            onClick={() => setLeaderboardType("event")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              leaderboardType === "event"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            }`}>
            <Activity className="w-4 h-4" />
            <span>Event</span>
          </button>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
          <div
            className={`w-2 h-2 rounded-full ${
              refreshing ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="text-sm">Live</span>
        </div>
      </div>

      <LeaderboardTable
        players={currentLeaderboard}
        darkMode={darkMode}
        setSelectedPlayer={setSelectedPlayer}
      />

      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          darkMode={darkMode}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default LeaderboardPage;
