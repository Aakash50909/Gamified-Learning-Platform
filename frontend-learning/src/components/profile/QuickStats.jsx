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

// 1. REMOVED: import { userData } from "../../api/mockData"; 
// We don't need fake data anymore!

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
  // 2. ADDED: State to hold the real data
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. PASTE YOUR MONGODB ID HERE!
  const DEMO_USER_ID = "691fb49e1dd8ef0e9a27b3c8";

  // 4. ADDED: The Logic to fetch from your Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Uses Vercel URL if online, or Localhost if on your laptop
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

        const response = await fetch(`${API_BASE}/auth/profile/${DEMO_USER_ID}`);
        const data = await response.json();

        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 5. Loading State
  if (loading) {
    return <div className={`${darkMode ? "text-white" : "text-black"} p-4`}>Connecting to Database...</div>;
  }

  // Guard clause if fetch failed
  if (!stats) {
    return <div className="text-red-500 p-4">User not found in DB</div>;
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl space-y-6`}
    >
      <h3 className="text-xl font-bold flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <span>Quick Stats</span>
      </h3>

      <div className="space-y-4">
        {/* REAL DATA: stats.xp */}
        <StatItem
          icon={Zap}
          label="Total XP"
          value={stats.xp ? stats.xp.toLocaleString() : "0"}
          color="text-purple-500"
          darkMode={darkMode}
        />

        {/* REAL DATA: stats.level */}
        <StatItem
          icon={Crown}
          label="Level"
          value={stats.level || 1}
          color="text-yellow-500"
          darkMode={darkMode}
        />

        {/* Fallback Data: Your DB doesn't have 'streak' yet, so we default to 0 */}
        <StatItem
          icon={Flame}
          label="Current Streak"
          value={`${stats.streak || 0} days`}
          color="text-orange-500"
          darkMode={darkMode}
        />

        {/* Fallback Data: Your DB doesn't have 'rank' yet */}
        <StatItem
          icon={Trophy}
          label="Global Rank"
          value={`#${stats.rank || "N/A"}`}
          color="text-blue-500"
          darkMode={darkMode}
        />

        <StatItem
          icon={Award}
          label="Badges Earned"
          value={stats.achievements ? stats.achievements.length : 0}
          color="text-pink-500"
          darkMode={darkMode}
        />

        <StatItem
          icon={Book}
          label="Quizzes Done"
          value={stats.quizzesCompleted || 0}
          color="text-green-500"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default QuickStats;