import { useState, useEffect } from "react";
import { BADGES, avatarEmojis } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const getXPForLevel = (level) => {
  return level * 200; // 200 XP per level
};

export const useRewards = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user progress from API
        const response = await fetch(
          `${API_BASE_URL}/learning/progress?userId=${user.id}`
        );

        if (!response.ok) throw new Error("Failed to fetch rewards");

        const data = await response.json();

        console.log("✅ Rewards API Response:", data);

        const rewardsData = {
          coins: 1200, // TODO: Add coins field to user model
          xp: data.totalXP || 0,
          level: data.level || 1,
          nextLevelXP: getXPForLevel((data.level || 1) + 1),
          avatar: {
            current: user.avatar || "ninja",
            available: Object.keys(avatarEmojis),
          },
          badges: Object.values(BADGES).map((b) => ({
            ...b,
            earned: false, // TODO: Check user.badges array
            earnedDate: null,
          })),
          dailyRewards: {
            claimed: false, // TODO: Check if claimed today
            streak: data.streak || 0,
            nextReward: 50,
          },
          shop: {
            avatars: [
              {
                id: "astronaut",
                name: "Astronaut",
                price: 500,
                unlocked: false,
              },
              {
                id: "detective",
                name: "Detective",
                price: 750,
                unlocked: false,
              },
              {
                id: "superhero",
                name: "Superhero",
                price: 1000,
                unlocked: false,
              },
            ],
            themes: [
              { id: "neon", name: "Neon Theme", price: 300, unlocked: false },
              {
                id: "forest",
                name: "Forest Theme",
                price: 400,
                unlocked: false,
              },
            ],
          },
        };

        setRewards(rewardsData);
      } catch (err) {
        console.error("❌ Rewards API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [user]);

  const updateAvatar = async (avatarName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, avatar: avatarName }),
      });

      if (!response.ok) throw new Error("Failed to update avatar");

      setRewards((prevRewards) => {
        if (!prevRewards) return prevRewards;
        return {
          ...prevRewards,
          avatar: { ...prevRewards.avatar, current: avatarName },
        };
      });
    } catch (err) {
      console.error("Failed to update avatar:", err);
      throw err;
    }
  };

  const claimDaily = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/daily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to claim daily reward");

      const result = await response.json();

      setRewards((prevRewards) => {
        if (!prevRewards) return prevRewards;
        return {
          ...prevRewards,
          coins: prevRewards.coins + result.coins,
          dailyRewards: { ...prevRewards.dailyRewards, claimed: true },
        };
      });
    } catch (err) {
      console.error("Failed to claim daily reward:", err);
      throw err;
    }
  };

  const purchaseItem = async (itemId, itemPrice) => {
    if (!rewards) {
      return { success: false, error: "Rewards not loaded" };
    }

    if (rewards.coins < itemPrice) {
      return { success: false, error: "Not enough coins" };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/rewards/shop/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          itemId,
          price: itemPrice,
        }),
      });

      if (!response.ok) throw new Error("Failed to purchase item");

      setRewards((prevRewards) => {
        if (!prevRewards) return prevRewards;
        return {
          ...prevRewards,
          coins: prevRewards.coins - itemPrice,
        };
      });
      return { success: true };
    } catch (err) {
      console.error("Failed to purchase item:", err);
      return { success: false, error: err.message };
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/learning/progress?userId=${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch rewards");

      const data = await response.json();

      const rewardsData = {
        coins: 1200,
        xp: data.totalXP || 0,
        level: data.level || 1,
        nextLevelXP: getXPForLevel((data.level || 1) + 1),
        avatar: {
          current: user.avatar || "ninja",
          available: Object.keys(avatarEmojis),
        },
        badges: Object.values(BADGES).map((b) => ({
          ...b,
          earned: false,
          earnedDate: null,
        })),
        dailyRewards: {
          claimed: false,
          streak: data.streak || 0,
          nextReward: 50,
        },
        shop: {
          avatars: [
            { id: "astronaut", name: "Astronaut", price: 500, unlocked: false },
            { id: "detective", name: "Detective", price: 750, unlocked: false },
            {
              id: "superhero",
              name: "Superhero",
              price: 1000,
              unlocked: false,
            },
          ],
          themes: [
            { id: "neon", name: "Neon Theme", price: 300, unlocked: false },
            { id: "forest", name: "Forest Theme", price: 400, unlocked: false },
          ],
        },
      };

      setRewards(rewardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    rewards,
    loading,
    error,
    updateAvatar,
    claimDaily,
    purchaseItem,
    refresh,
  };
};

export { getXPForLevel };
