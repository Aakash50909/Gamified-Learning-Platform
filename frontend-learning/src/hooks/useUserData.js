import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user progress (includes DSA stats)
      const progressResponse = await fetch(
        `${API_BASE_URL}/learning/progress?userId=${user.id}`
      );

      if (!progressResponse.ok) {
        throw new Error("Failed to fetch user progress");
      }

      const progressData = await progressResponse.json();

      // Fetch completed problems for analytics
      const completedResponse = await fetch(
        `${API_BASE_URL}/dsa/user-progress/${user.id}`
      );

      let completedProblems = [];
      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        completedProblems = completedData.completedProblems || [];
      }

      // Combine all data
      const combinedData = {
        // Basic info
        userId: user.id,
        username: progressData.username || user.username,
        avatar: progressData.avatar || user.avatar || "ninja",

        // DSA Performance
        dsaPoints: progressData.points || 0,
        dsaRank: progressData.rank || 0,
        totalProblems: progressData.stats?.totalCompleted || 0,
        easyCompleted: progressData.stats?.easyCompleted || 0,
        mediumCompleted: progressData.stats?.mediumCompleted || 0,
        hardCompleted: progressData.stats?.hardCompleted || 0,

        // Activity
        streak: progressData.streak || 0,
        completedProblems: completedProblems,

        // Derived metrics
        accuracy:
          progressData.stats?.totalCompleted > 0
            ? Math.round(
                (progressData.stats.totalCompleted /
                  (progressData.stats.totalCompleted + 5)) *
                  100
              )
            : 0,
        weeklyProgress: calculateWeeklyProgress(completedProblems),
        topicsProgress: calculateTopicsProgress(completedProblems),
        languagesUsed: getLanguagesUsed(completedProblems),
        recentActivity: getRecentActivity(completedProblems),
      };

      setUserData(combinedData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  return {
    userData,
    loading,
    error,
    refetch: fetchUserData,
  };
};

// Helper: Calculate weekly progress
function calculateWeeklyProgress(completedProblems) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklyProblems = completedProblems.filter((problem) => {
    const completedDate = new Date(problem.completedAt);
    return completedDate >= oneWeekAgo;
  });

  return weeklyProblems.length;
}

// Helper: Calculate progress by topic
function calculateTopicsProgress(completedProblems) {
  const topics = {};

  completedProblems.forEach((problem) => {
    const topic = problem.topic || "Other";
    if (!topics[topic]) {
      topics[topic] = {
        name: topic,
        count: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        points: 0,
      };
    }

    topics[topic].count += 1;
    topics[topic].points += problem.pointsEarned || 0;

    if (problem.difficulty === "Easy") topics[topic].easy += 1;
    else if (problem.difficulty === "Medium") topics[topic].medium += 1;
    else if (problem.difficulty === "Hard") topics[topic].hard += 1;
  });

  return Object.values(topics);
}

// Helper: Get languages used
function getLanguagesUsed(completedProblems) {
  const languages = {};

  completedProblems.forEach((problem) => {
    const lang = problem.language || "javascript";
    if (!languages[lang]) {
      languages[lang] = 0;
    }
    languages[lang] += 1;
  });

  return Object.entries(languages).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
  }));
}

// Helper: Get recent activity (last 10 problems)
function getRecentActivity(completedProblems) {
  return completedProblems
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 10)
    .map((problem) => ({
      title: problem.problemTitle,
      topic: problem.topic,
      difficulty: problem.difficulty,
      points: problem.pointsEarned,
      date: problem.completedAt,
      language: problem.language,
    }));
}

export default useUserData;
