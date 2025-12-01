import React, { useState } from "react";
import {
  BookOpen,
  Trophy,
  Gift,
  User,
  BarChart2,
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ darkMode, setDarkMode, currentView, setCurrentView }) => {
  const { logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to check if a button is active
  const isActive = (view) => currentView === view;

  // The style for navigation buttons
  const navBtnClass = (view) => `
    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
    ${isActive(view)
      ? "bg-purple-600 text-white shadow-lg transform scale-105"
      : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-purple-50"}
  `;

  return (
    <nav className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100"} border-b shadow-sm sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo - Clicks go to Home (skills) */}
          <div
            onClick={() => setCurrentView("skills")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600`}>
              LearnQuest
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">

            <button onClick={() => setCurrentView("skills")} className={navBtnClass("skills")}>
              <BookOpen className="w-4 h-4" />
              <span>Practice</span>
            </button>

            <button onClick={() => setCurrentView("leaderboard")} className={navBtnClass("leaderboard")}>
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button onClick={() => setCurrentView("rewards")} className={navBtnClass("rewards")}>
              <Gift className="w-4 h-4" />
              <span>Rewards</span>
            </button>

            <button onClick={() => setCurrentView("profile")} className={navBtnClass("profile")}>
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button onClick={() => setCurrentView("analytics")} className={navBtnClass("analytics")}>
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-100 text-gray-600"}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className={darkMode ? "text-white" : "text-gray-800"} /> : <Menu className={darkMode ? "text-white" : "text-gray-800"} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100"} border-t`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            <button onClick={() => { setCurrentView("skills"); setIsMenuOpen(false); }} className={`w-full text-left ${navBtnClass("skills")}`}>Skills</button>
            <button onClick={() => { setCurrentView("leaderboard"); setIsMenuOpen(false); }} className={`w-full text-left ${navBtnClass("leaderboard")}`}>Leaderboard</button>
            <button onClick={() => { setCurrentView("rewards"); setIsMenuOpen(false); }} className={`w-full text-left ${navBtnClass("rewards")}`}>Rewards</button>
            <button onClick={() => { setCurrentView("profile"); setIsMenuOpen(false); }} className={`w-full text-left ${navBtnClass("profile")}`}>Profile</button>
            <button onClick={() => { setCurrentView("analytics"); setIsMenuOpen(false); }} className={`w-full text-left ${navBtnClass("analytics")}`}>Analytics</button>
            <button onClick={logout} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;