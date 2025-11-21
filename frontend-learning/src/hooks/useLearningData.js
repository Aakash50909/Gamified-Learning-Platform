import { useState, useEffect } from "react";
import apiService from "../api/apiService";
import { skillsData, moduleData, quizData, userData } from "../api/mockData";

export const useLearningData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let learningData;

      // Try API first, fallback to mock data if it fails
      try {
        learningData = await apiService.fetchLearningData();
      } catch (apiError) {
        // API not available, use mock data
        learningData = {
          modules: skillsData.map((skill) => ({
            id: skill.id,
            title: skill.name,
            icon: skill.icon,
            color: skill.color,
            xp: skill.xp,
            maxXp: skill.maxXp,
            level: skill.level,
            streak: skill.streak,
            name: skill.name,
            progress: skill.xp / skill.maxXp,
          })),
          topics: moduleData,
          quizzes: quizData,
          userProgress: {
            totalXP: userData.xp,
            level: userData.level,
            streak: userData.streak,
            completedModules: 2,
            badges: userData.totalBadges,
          },
        };
      }

      if (mounted) {
        setData(learningData);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  return { data, loading, error, refresh };
};
