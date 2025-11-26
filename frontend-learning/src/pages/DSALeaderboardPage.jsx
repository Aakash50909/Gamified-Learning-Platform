import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, ArrowLeft } from "lucide-react";
import { useAuth } from "./../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const DSALeaderboardPage = ({ darkMode, onBack }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const url = user?.id
        ? `${API_BASE_URL}/dsa/leaderboard?userId=${user.id}&limit=100`
        : `${API_BASE_URL}/dsa/leaderboard?limit=100`;

      const response = await fetch(url);
      const data = await response.json();
      setLeaderboard(data);

      // Find current user's rank
      const currentUser = data.find((entry) => entry.isCurrentUser);
      if (currentUser) {
        setUserRank(currentUser.rank);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
          DSA Leaderboard
        </h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Top problem solvers in the community
        </p>
      </div>

      {/* User's Current Rank */}
      {userRank && (
        <div
          className={`${
            darkMode
              ? "bg-gradient-to-r from-purple-900 to-pink-900"
              : "bg-gradient-to-r from-purple-100 to-pink-100"
          } 
          rounded-2xl p-6 border-2 border-purple-500`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium mb-1">Your Current Rank</div>
              <div className="text-4xl font-bold text-purple-500">
                #{userRank}
              </div>
            </div>
            <Trophy className="w-16 h-16 text-purple-500" />
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl overflow-hidden`}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Rankings</span>
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? "bg-gray-750" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  User
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
              {leaderboard.map((entry, idx) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  darkMode={darkMode}
                  isEven={idx % 2 === 0}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden">
          {leaderboard.map((entry) => (
            <MobileLeaderboardCard
              key={entry.userId}
              entry={entry}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RankBadge = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
        <span className="text-2xl">🥇</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg">
        <span className="text-2xl">🥈</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
        <span className="text-2xl">🥉</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
      <span className="text-white font-bold">#{rank}</span>
    </div>
  );
};

const LeaderboardRow = ({ entry, darkMode, isEven }) => {
  return (
    <tr
      className={`${
        entry.isCurrentUser
          ? "bg-purple-500 bg-opacity-10 border-l-4 border-purple-500"
          : isEven
          ? darkMode
            ? "bg-gray-800"
            : "bg-white"
          : darkMode
          ? "bg-gray-750"
          : "bg-gray-50"
      } hover:bg-purple-500 hover:bg-opacity-10 transition-all`}>
      <td className="px-6 py-4">
        <RankBadge rank={entry.rank} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getAvatarEmoji(entry.avatar)}</div>
          <div>
            <div className="font-bold">{entry.username}</div>
            {entry.isCurrentUser && (
              <div className="text-xs text-purple-500 font-bold">You</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold text-yellow-500 text-lg">{entry.points}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-bold">{entry.stats?.totalCompleted || 0}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3 text-sm">
          <span className="text-green-500">
            🟢 {entry.stats?.easyCompleted || 0}
          </span>
          <span className="text-yellow-500">
            🟡 {entry.stats?.mediumCompleted || 0}
          </span>
          <span className="text-red-500">
            🔴 {entry.stats?.hardCompleted || 0}
          </span>
        </div>
      </td>
    </tr>
  );
};

const MobileLeaderboardCard = ({ entry, darkMode }) => {
  return (
    <div
      className={`p-4 border-b ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } ${
        entry.isCurrentUser
          ? "bg-purple-500 bg-opacity-10 border-l-4 border-purple-500"
          : ""
      }`}>
      <div className="flex items-start space-x-3">
        <RankBadge rank={entry.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{getAvatarEmoji(entry.avatar)}</span>
            <div>
              <div className="font-bold truncate">{entry.username}</div>
              {entry.isCurrentUser && (
                <div className="text-xs text-purple-500 font-bold">You</div>
              )}
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-bold text-yellow-500">
              {entry.points} points
            </div>
            <div>{entry.stats?.totalCompleted || 0} problems solved</div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">
                🟢 {entry.stats?.easyCompleted || 0}
              </span>
              <span className="text-yellow-500">
                🟡 {entry.stats?.mediumCompleted || 0}
              </span>
              <span className="text-red-500">
                🔴 {entry.stats?.hardCompleted || 0}
              </span>
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
  return avatarMap[avatar] || "👤";
};

export default DSALeaderboardPage;
