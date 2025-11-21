import React, { useState } from "react";
import { Crown, Award, Gift, ChevronRight, Sparkles } from "lucide-react";
import { useRewards, getXPForLevel } from "../../hooks/useRewards";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorDisplay } from "../common/ErrorDisplay";
import { ConfettiEffect } from "../common/ConfettiEffect";
import { avatarEmojis } from "../../api/mockData";
import RewardStatCard from "./RewardStatCard";
import RewardBadgeCard from "./RewardBadgeCard";
import AvatarPickerModal from "./AvatarPickerModal";
import ShopModal from "./ShopModal";

const RewardsPage = ({ darkMode }) => {
  const {
    rewards,
    loading,
    error,
    updateAvatar,
    claimDaily,
    purchaseItem,
    refresh,
  } = useRewards();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [claimingDaily, setClaimingDaily] = useState(false);

  const handleClaimDaily = async () => {
    setClaimingDaily(true);
    try {
      await claimDaily();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error("Failed to claim reward:", err);
    } finally {
      setClaimingDaily(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-purple-500 bg-clip-text text-transparent">
            Rewards & Achievements
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading your rewards...
          </p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-purple-500 bg-clip-text text-transparent">
            Rewards & Achievements
          </h1>
        </div>
        <ErrorDisplay message={error} onRetry={refresh} darkMode={darkMode} />
      </div>
    );
  }

  const xpProgress =
    ((rewards.xp - getXPForLevel(rewards.level)) /
      (rewards.nextLevelXP - getXPForLevel(rewards.level))) *
    100;
  const earnedBadges = rewards.badges.filter((b) => b.earned);
  const lockedBadges = rewards.badges.filter((b) => !b.earned);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-purple-500 bg-clip-text text-transparent">
          Rewards & Achievements
        </h1>
        <p
          className={`text-sm sm:text-base ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
          Your coins, avatars, and badges
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RewardStatCard
          icon="🪙"
          title="Coins"
          value={rewards.coins.toLocaleString()}
          subtitle="Spend in shop"
          darkMode={darkMode}
        />
        <RewardStatCard
          icon={avatarEmojis[rewards.avatar.current]}
          title="Current Avatar"
          value={rewards.avatar.current}
          subtitle="Click to change"
          darkMode={darkMode}
          onClick={() => setShowAvatarPicker(true)}
          clickable
        />
        <RewardStatCard
          icon="⚡"
          title="Total XP"
          value={rewards.xp.toLocaleString()}
          subtitle={`Level ${rewards.level}`}
          darkMode={darkMode}
        />
        <RewardStatCard
          icon="🏆"
          title="Badges"
          value={`${earnedBadges.length}/${rewards.badges.length}`}
          subtitle="Unlocked"
          darkMode={darkMode}
        />
      </div>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            <span>Level Progress</span>
          </h2>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold text-purple-500">
              Level {rewards.level}
            </div>
            <div
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
              {rewards.xp} / {rewards.nextLevelXP} XP
            </div>
          </div>
        </div>
        <div
          className={`h-4 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded-full overflow-hidden relative`}>
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-1000"
            style={{ width: `${xpProgress}%` }}>
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
          </div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500">
          {rewards.nextLevelXP - rewards.xp} XP to Level {rewards.level + 1}
        </div>
      </div>

      {!rewards.dailyRewards.claimed && (
        <div
          className={`${
            darkMode
              ? "bg-gradient-to-r from-yellow-900 to-orange-900"
              : "bg-gradient-to-r from-yellow-100 to-orange-100"
          } rounded-2xl p-6 shadow-xl border-2 border-yellow-500`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Gift className="w-6 h-6 text-yellow-500" />
                <span>Daily Reward Available!</span>
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                Claim {rewards.dailyRewards.nextReward} coins for your{" "}
                {rewards.dailyRewards.streak}-day streak
              </p>
            </div>
            <button
              onClick={handleClaimDaily}
              disabled={claimingDaily}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2">
              {claimingDaily ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <span>Claim Now</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <span>Badge Collection</span>
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}>
            {earnedBadges.length} / {rewards.badges.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {earnedBadges.map((badge) => (
            <RewardBadgeCard
              key={badge.id}
              badge={badge}
              earned={true}
              darkMode={darkMode}
            />
          ))}
          {lockedBadges.map((badge) => (
            <RewardBadgeCard
              key={badge.id}
              badge={badge}
              earned={false}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <span>Rewards Shop</span>
          </h2>
          <button
            onClick={() => setShowShop(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            Browse Shop
          </button>
        </div>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Unlock exclusive avatars, themes, and power-ups with your coins!
        </p>
      </div>

      {showAvatarPicker && (
        <AvatarPickerModal
          currentAvatar={rewards.avatar.current}
          availableAvatars={rewards.avatar.available}
          onSelect={updateAvatar}
          onClose={() => setShowAvatarPicker(false)}
          darkMode={darkMode}
        />
      )}

      {showShop && (
        <ShopModal
          coins={rewards.coins}
          shop={rewards.shop}
          onPurchase={purchaseItem}
          onClose={() => setShowShop(false)}
          darkMode={darkMode}
        />
      )}

      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default RewardsPage;
