import { useState, useEffect } from "react";
import apiService from "../api/apiService";

export const useLeaderboardData = (type) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const leaderboardResult = await apiService.fetchLeaderboard(type);

        console.log("✅ Leaderboard API Response:", leaderboardResult);

        if (mounted) {
          setData(leaderboardResult);
        }
      } catch (apiError) {
        console.error("❌ Leaderboard API Error:", apiError);
        if (mounted) {
          setError(apiError.message);
          // Set empty array instead of fallback
          setData([]);
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
  }, [type]);

  return { data, loading, error };
};
