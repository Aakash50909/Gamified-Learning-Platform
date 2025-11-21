import { useState, useEffect } from "react";
import { BADGES, userData, avatarEmojis } from "../api/mockData";

const getXPForLevel = (level) => {
  return level * 100;
};

const mockRewardsAPI = {
  async getRewards() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          coins: 1200,
          xp: userData.xp,
          level: userData.level,
          nextLevelXP: getXPForLevel(userData.level + 1),
          avatar: {
            current: "ninja",
            available: Object.keys(avatarEmojis),
          },
          badges: Object.values(BADGES).map((b) => ({
            ...b,
            earned: userData.unlockedBadges.includes(b.id),
            earnedDate: userData.unlockedBadges.includes(b.id)
              ? new Date().toISOString()
              : null,
          })),
          dailyRewards: {
            claimed: false,
            streak: userData.streak,
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
        });
      }, 500);
    });
  },

  async updateAvatar(avatarId) {
    console.log("Updating avatar to:", avatarId);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  },

  async claimDaily() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, coins: 50 }), 500);
    });
  },

  async purchaseItem(id, cost) {
    console.log("Purchasing item:", id, "for", cost);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },
};

export const useRewards = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const data = await mockRewardsAPI.getRewards();
        setRewards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const updateAvatar = async (avatarName) => {
    try {
      await mockRewardsAPI.updateAvatar(avatarName);
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
      const result = await mockRewardsAPI.claimDaily();
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
      await mockRewardsAPI.purchaseItem(itemId, itemPrice);
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
    try {
      const data = await mockRewardsAPI.getRewards();
      setRewards(data);
      setError(null);
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

export { getXPForLevel, mockRewardsAPI };
