import { useState, useEffect } from "react";
import apiService from "../api/apiService";
import { useAuth } from "../contexts/AuthContext"; // Import auth context

export const useLearningData = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch modules from API
        const modules = await apiService.fetchLearningData();

        console.log("✅ API Response:", modules); // Debug log

        // Fetch user progress if logged in
        let userProgress = {
          totalXP: 0,
          level: 1,
          streak: 0,
          completedModules: 0,
          badges: 0,
        };

        if (user?.id) {
          try {
            const progressResponse = await fetch(
              `http://localhost:5000/api/learning/progress?userId=${user.id}`
            );
            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              userProgress = {
                totalXP: progressData.totalXP || 0,
                level: progressData.level || 1,
                streak: progressData.streak || 0,
                completedModules: progressData.modulesCompleted || 0,
                badges: 0,
              };
            }
          } catch (progressError) {
            console.warn("Could not fetch user progress:", progressError);
          }
        }

        const learningData = {
          modules: Array.isArray(modules)
            ? modules.map((module) => ({
                id: module._id || module.id,
                _id: module._id || module.id,
                title: module.title,
                name: module.name || module.title,
                icon: module.icon || "Code",
                color: module.color || "from-blue-500 to-cyan-500",
                xp: module.xp || 0,
                maxXp: module.maxXp || 1000,
                level: module.level || 1,
                streak: module.streak || 0,
                difficulty: module.difficulty,
                xpReward: module.xpReward,
                description: module.description,
                progress: ((module.xp || 0) / (module.maxXp || 1000)) * 100,
              }))
            : [],
          userProgress,
        };

        if (mounted) {
          console.log("✅ Setting data:", learningData);
          setData(learningData);
        }
      } catch (apiError) {
        console.error("❌ API Error:", apiError);
        if (mounted) {
          setError(apiError.message);
          // Set empty data instead of fallback
          setData({
            modules: [],
            userProgress: {
              totalXP: 0,
              level: 1,
              streak: 0,
              completedModules: 0,
              badges: 0,
            },
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [refreshKey, user]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  return { data, loading, error, refresh };
};
