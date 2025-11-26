import React, { useState, useEffect } from "react";
import { Award, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Make sure you have this

const API_BASE_URL = "http://localhost:5000/api";

// Badge definitions (keep these as they define the badge types)
const BADGES = {
  streakStarter: {
    id: "streakStarter",
    name: "Streak Starter",
    icon: "🔥",
    description: "Practice for 3 days in a row",
    color: "from-orange-500 to-red-500",
  },
  quizMaster: {
    id: "quizMaster",
    name: "Quiz Master",
    icon: "🎓",
    description: "Complete 10 quizzes",
    color: "from-blue-500 to-cyan-500",
  },
  fastThinker: {
    id: "fastThinker",
    name: "Fast Thinker",
    icon: "⚡",
    description: "Average under 30s per question",
    color: "from-yellow-500 to-orange-500",
  },
  allRounder: {
    id: "allRounder",
    name: "All-Rounder",
    icon: "🌟",
    description: "Practice all skill categories",
    color: "from-purple-500 to-pink-500",
  },
  perfectScore: {
    id: "perfectScore",
    name: "Perfect Score",
    icon: "💯",
    description: "Get 100% on any quiz",
    color: "from-green-500 to-emerald-500",
  },
  nightOwl: {
    id: "nightOwl",
    name: "Night Owl",
    icon: "🦉",
    description: "Practice after midnight",
    color: "from-indigo-500 to-purple-500",
  },
  earlyBird: {
    id: "earlyBird",
    name: "Early Bird",
    icon: "🌅",
    description: "Practice before 6 AM",
    color: "from-pink-500 to-rose-500",
  },
  master: {
    id: "master",
    name: "Master",
    icon: "👑",
    description: "Reach level 20",
    color: "from-yellow-600 to-orange-600",
  },
};

const BadgeCard = ({ badge, unlocked, darkMode }) => {
  return (
    <div
      className={`group relative p-4 rounded-xl text-center transition-all ${
        unlocked
          ? `bg-gradient-to-br ${badge.color} shadow-lg hover:scale-105 cursor-pointer`
          : darkMode
          ? "bg-gray-750 opacity-40"
          : "bg-gray-100 opacity-40"
      }`}>
      <div className={`text-4xl mb-2 ${!unlocked && "grayscale"}`}>
        {badge.icon}
      </div>
      <h4
        className={`font-bold text-sm ${
          unlocked ? "text-white" : darkMode ? "text-gray-500" : "text-gray-400"
        }`}>
        {badge.name}
      </h4>
      {!unlocked && (
        <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-500" />
      )}
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10`}>
        {badge.description}
      </div>
    </div>
  );
};

const AchievementGrid = ({ darkMode }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/profile/${user.id}`);

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // Use mock data as fallback
          setUserData({
            badges: [
              "streakStarter",
              "quizMaster",
              "perfectScore",
              "fastThinker",
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to mock data
        setUserData({
          badges: [
            "streakStarter",
            "quizMaster",
            "perfectScore",
            "fastThinker",
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl`}>
        <div className="text-center py-8">Loading badges...</div>
      </div>
    );
  }

  const allBadges = Object.values(BADGES);
  const unlockedBadges = allBadges.filter((b) =>
    userData?.badges?.includes(b.id)
  );
  const lockedBadges = allBadges.filter(
    (b) => !userData?.badges?.includes(b.id)
  );

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Achievements</span>
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
          {unlockedBadges.length}/{allBadges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {unlockedBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={true}
            darkMode={darkMode}
          />
        ))}
        {lockedBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={false}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementGrid;
