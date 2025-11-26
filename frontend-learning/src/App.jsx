// ==================== UPDATED App.jsx ====================

import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Navbar from "./components/layout/Navbar";
// ❌ REMOVE THIS LINE:
// import SkillsPage from "./components/skills/SkillsPage";
import ModulePage from "./components/modules/ModulePage";
import QuizPage from "./components/quiz/QuizPage";
import LeaderboardPage from "./components/leaderboard/LeaderboardPage";
import ProfilePage from "./components/profile/ProfilePage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import RewardsPage from "./components/rewards/RewardsPage";
// ✅ ADD THIS LINE:
import DSAMainContainer from "./pages/DSAMainContainer";

const MainApp = () => {
  const [currentView, setCurrentView] = useState("skills");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [leaderboardType, setLeaderboardType] = useState("global");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { isAuthenticated } = useAuth();

  const bgClass = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-900";

  if (!isAuthenticated) {
    return <AuthRouter />;
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ✅ REPLACE THIS BLOCK: */}
        {currentView === "skills" && <DSAMainContainer darkMode={darkMode} />}
        {/* ❌ DELETE OLD CODE:
        {currentView === "skills" && (
          <SkillsPage
            darkMode={darkMode}
            setCurrentView={setCurrentView}
            setSelectedSkill={setSelectedSkill}
          />
        )}
        */}

        {/* Keep all other views unchanged */}
        {currentView === "module" && (
          <ModulePage
            darkMode={darkMode}
            skill={selectedSkill}
            setCurrentView={setCurrentView}
            setSelectedTopic={setSelectedTopic}
          />
        )}
        {currentView === "quiz" && (
          <QuizPage
            darkMode={darkMode}
            topic={selectedTopic}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "leaderboard" && (
          <LeaderboardPage
            darkMode={darkMode}
            leaderboardType={leaderboardType}
            setLeaderboardType={setLeaderboardType}
          />
        )}
        {currentView === "profile" && (
          <ProfilePage
            darkMode={darkMode}
            showEditProfile={showEditProfile}
            setShowEditProfile={setShowEditProfile}
          />
        )}
        {currentView === "analytics" && <AnalyticsPage darkMode={darkMode} />}
        {currentView === "rewards" && <RewardsPage darkMode={darkMode} />}
      </div>
    </div>
  );
};

const AuthRouter = () => {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return <SignupPage onSwitchToLogin={() => setShowSignup(false)} />;
  }

  return <LoginPage onSwitchToSignup={() => setShowSignup(true)} />;
};

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
