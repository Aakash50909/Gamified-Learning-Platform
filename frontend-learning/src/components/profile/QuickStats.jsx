import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Zap,
  Crown,
  Flame,
  Trophy,
  Award,
  Book,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const StatItem = ({ icon: Icon, label, value, color, darkMode }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {label}
        </span>
      </div>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
};

const QuickStats = ({ darkMode }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/learning/progress?userId=${user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          setStats({
            xp: data.totalXP || 0,
            level: data.level || 1,
            streak: data.streak || 0,
            rank: 47, // This would come from leaderboard API
            totalBadges: 0, // Would need separate badges endpoint
            quizzesCompleted: data.quizzesCompleted || 0,
          });
        } else {
          // Fallback to default stats
          setStats({
            xp: user.xp || 0,
            level: user.level || 1,
            streak: user.streak || 0,
            rank: 0,
            totalBadges: 0,
            quizzesCompleted: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to user data from auth
        setStats({
          xp: user.xp || 0,
          level: user.level || 1,
          streak: user.streak || 0,
          rank: 0,
          totalBadges: 0,
          quizzesCompleted: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl space-y-6`}>
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Quick Stats</span>
        </h3>
        <div className="text-center py-8 text-gray-500">Loading stats...</div>
      </div>
    );
  }

  const currentStats = stats || {
    xp: 0,
    level: 1,
    streak: 0,
    rank: 0,
    totalBadges: 0,
    quizzesCompleted: 0,
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl space-y-6`}>
      <h3 className="text-xl font-bold flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <span>Quick Stats</span>
      </h3>

      <div className="space-y-4">
        <StatItem
          icon={Zap}
          label="Total XP"
          value={currentStats.xp.toLocaleString()}
          color="text-purple-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Crown}
          label="Level"
          value={currentStats.level}
          color="text-yellow-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Flame}
          label="Current Streak"
          value={`${currentStats.streak} days`}
          color="text-orange-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Trophy}
          label="Global Rank"
          value={currentStats.rank > 0 ? `#${currentStats.rank}` : "Unranked"}
          color="text-blue-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Award}
          label="Badges Earned"
          value={currentStats.totalBadges}
          color="text-pink-500"
          darkMode={darkMode}
        />
        <StatItem
          icon={Book}
          label="Quizzes Done"
          value={currentStats.quizzesCompleted}
          color="text-green-500"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default QuickStats;
