import React, { useState, useEffect } from "react";
import {
  Trophy,
  Book,
  Gift,
  User,
  BarChart3,
  Settings,
  Flame,
  LogOut,
} from "lucide-react";
import { mockRewardsAPI } from "../../hooks/useRewards";
import { userData } from "../../api/mockData";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ darkMode, setDarkMode, currentView, setCurrentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coins, setCoins] = useState(1200);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const rewardsData = await mockRewardsAPI.getRewards();
        setCoins(rewardsData.coins);
      } catch (err) {
        console.log("Using default coins");
      }
    };
    fetchCoins();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-b sticky top-0 z-50 shadow-lg`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LearnQuest
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setCurrentView("skills")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                currentView === "skills"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}>
              <Book className="w-4 h-4" />
              <span className="font-medium">Skills</span>
            </button>

            <button
              onClick={() => setCurrentView("leaderboard")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                currentView === "leaderboard"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}>
              <Trophy className="w-4 h-4" />
              <span className="font-medium">Leaderboard</span>
            </button>

            <button
              onClick={() => setCurrentView("rewards")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                currentView === "rewards"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}>
              <Gift className="w-4 h-4" />
              <span className="font-medium">Rewards</span>
            </button>

            <button
              onClick={() => setCurrentView("profile")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                currentView === "profile"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}>
              <User className="w-4 h-4" />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => setCurrentView("analytics")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                currentView === "analytics"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}>
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Analytics</span>
            </button>

            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <span className="text-2xl">🪙</span>
              <span className="font-bold text-white">{coins}</span>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Flame className="w-4 h-4 text-white" />
              <span className="font-bold text-white">{userData.streak}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}>
                {darkMode ? "☀️" : "🌙"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                title="Logout">
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-white text-sm">{coins}</span>
            </div>

            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Flame className="w-3 h-3 text-white" />
              <span className="font-bold text-white text-sm">
                {userData.streak}
              </span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                setCurrentView("skills");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                currentView === "skills"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
              }`}>
              <Book className="w-4 h-4" />
              <span className="font-medium">Skills</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("leaderboard");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                currentView === "leaderboard"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
              }`}>
              <Trophy className="w-4 h-4" />
              <span className="font-medium">Leaderboard</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("rewards");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                currentView === "rewards"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
              }`}>
              <Gift className="w-4 h-4" />
              <span className="font-medium">Rewards</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("profile");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                currentView === "profile"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
              }`}>
              <User className="w-4 h-4" />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("analytics");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                currentView === "analytics"
                  ? "bg-purple-500 text-white"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-gray-100"
              }`}>
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
