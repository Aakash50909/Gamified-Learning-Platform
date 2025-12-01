import React, { useState, useEffect } from "react";
import { Gift, Lock, Check } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const RewardsPage = ({ darkMode }) => {
  const { user } = useAuth(); // We just use the User object directly

  // Hardcoded Rewards List (Easiest for Demo)
  const rewards = [
    { id: 1, name: "Early Bird Badge", cost: 0, icon: "🌅", unlocked: true },
    { id: 2, name: "Dark Mode Theme", cost: 100, icon: "🌙", unlocked: (user?.dsaPoints || 0) >= 100 },
    { id: 3, name: "Premium Avatar", cost: 500, icon: "😎", unlocked: (user?.dsaPoints || 0) >= 500 },
    { id: 4, name: "Grand Master Title", cost: 1000, icon: "👑", unlocked: (user?.dsaPoints || 0) >= 1000 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Rewards Shop
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Spend your hard-earned XP!
        </p>
        <div className="mt-4 inline-block px-6 py-2 bg-yellow-100 text-yellow-800 rounded-full font-bold">
          Your Balance: {user?.dsaPoints || 0} XP
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className={`relative p-6 rounded-2xl shadow-xl border-2 transition-all ${reward.unlocked
              ? darkMode ? "bg-gray-800 border-green-500" : "bg-white border-green-500"
              : darkMode ? "bg-gray-800 border-gray-700 opacity-70" : "bg-white border-gray-200 opacity-70"
            }`}>
            <div className="text-6xl text-center mb-4">{reward.icon}</div>
            <h3 className={`text-xl font-bold text-center mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {reward.name}
            </h3>

            <div className="flex justify-center items-center space-x-2">
              {reward.unlocked ? (
                <span className="flex items-center text-green-500 font-bold">
                  <Check className="w-5 h-5 mr-1" /> Unlocked
                </span>
              ) : (
                <span className="flex items-center text-gray-500 font-bold">
                  <Lock className="w-4 h-4 mr-1" /> {reward.cost} XP
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;