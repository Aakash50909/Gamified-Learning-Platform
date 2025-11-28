import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Navbar from "./components/layout/Navbar";

// ✅ IMPORT THE NEW DSA PAGE WE BUILT
// (Make sure the file exists at this path! If it's in a subfolder, adjust the path)
import DSATopicsPage from "./components/DSATopicsPage";

// Keep existing imports
import ModulePage from "./components/modules/ModulePage";
import QuizPage from "./components/quiz/QuizPage";
import LeaderboardPage from "./components/leaderboard/LeaderboardPage";
import ProfilePage from "./components/profile/ProfilePage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import RewardsPage from "./components/rewards/RewardsPage";

const MainApp = () => {
  // "skills" is the default view when the app opens
  const [currentView, setCurrentView] = useState("skills");
  const [darkMode, setDarkMode] = useState(false);

  // These states help pass data between views
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [leaderboardType, setLeaderboardType] = useState("global");
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { isAuthenticated } = useAuth();

  const bgClass = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-900";

  // 1. AUTH GUARD
  if (!isAuthenticated) {
    return <AuthRouter />;
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* 2. NAVBAR: Ensure this component uses onClick={() => setCurrentView('...')} */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* 3. THE VIEWS (Only ONE renders at a time) */}

        {/* ✅ VIEW 1: HOME / SKILLS -> Shows DSA Topics */}
        {currentView === "skills" && (
          <DSATopicsPage
            darkMode={darkMode}
            // If DSATopicsPage needs to switch views, pass setCurrentView here
            setCurrentView={setCurrentView}
          />
        )}

        {/* VIEW 2: MODULES */}
        {currentView === "module" && (
          <ModulePage
            darkMode={darkMode}
            skill={selectedSkill}
            setCurrentView={setCurrentView}
            setSelectedTopic={setSelectedTopic}
          />
        )}

        {/* VIEW 3: QUIZ */}
        {currentView === "quiz" && (
          <QuizPage
            darkMode={darkMode}
            topic={selectedTopic}
            setCurrentView={setCurrentView}
          />
        )}

        {/* VIEW 4: LEADERBOARD */}
        {currentView === "leaderboard" && (
          <LeaderboardPage
            darkMode={darkMode}
            leaderboardType={leaderboardType}
            setLeaderboardType={setLeaderboardType}
          />
        )}

        {/* VIEW 5: PROFILE */}
        {currentView === "profile" && (
          <ProfilePage
            darkMode={darkMode}
            showEditProfile={showEditProfile}
            setShowEditProfile={setShowEditProfile}
          />
        )}

        {/* VIEW 6: ANALYTICS */}
        {currentView === "analytics" && (
          <AnalyticsPage darkMode={darkMode} />
        )}

        {/* VIEW 7: REWARDS */}
        {currentView === "rewards" && (
          <RewardsPage darkMode={darkMode} />
        )}
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