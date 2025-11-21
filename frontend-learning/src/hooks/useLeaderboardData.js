import { useState, useEffect } from "react";
import apiService from "../api/apiService";
import { leaderboardData } from "../api/mockData";

export const useLeaderboardData = (type) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let leaderboardResult;

      // Try API first, fallback to mock data if it fails
      try {
        leaderboardResult = await apiService.fetchLeaderboard(type);
      } catch (apiError) {
        // API not available, use mock data
        leaderboardResult = leaderboardData[type];
      }

      if (mounted) {
        setData(leaderboardResult);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [type]);

  return { data, loading, error };
};
