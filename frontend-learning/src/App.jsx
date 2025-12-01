import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Navbar from "./components/layout/Navbar";

// ✅ FIXED IMPORT: Pointing to 'pages' folder instead of 'components'
import DSATopicsPage from "./pages/DSATopicsPage";

// Keep these as they were (Assuming they are still in components)
import LeaderboardPage from "./components/leaderboard/LeaderboardPage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import RewardsPage from "./components/rewards/RewardsPage";
import ProfilePage from "./components/profile/ProfilePage";
import ModulePage from "./components/modules/ModulePage";
import QuizPage from "./components/quiz/QuizPage";

const MainApp = () => {
  const [currentView, setCurrentView] = useState("skills");
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);

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

        {/* VIEW 1: HOME (DSA TOPICS) */}
        {currentView === "skills" && (
          <DSATopicsPage
            darkMode={darkMode}
            setCurrentView={setCurrentView}
          />
        )}

        {/* VIEW 2: LEADERBOARD */}
        {currentView === "leaderboard" && (
          <LeaderboardPage darkMode={darkMode} />
        )}

        {/* VIEW 3: REWARDS */}
        {currentView === "rewards" && (
          <RewardsPage darkMode={darkMode} />
        )}

        {/* VIEW 4: ANALYTICS */}
        {currentView === "analytics" && (
          <AnalyticsPage darkMode={darkMode} />
        )}

        {/* VIEW 5: PROFILE */}
        {currentView === "profile" && (
          <ProfilePage darkMode={darkMode} />
        )}

        {/* INTERNAL VIEWS */}
        {currentView === "module" && (
          <ModulePage
            darkMode={darkMode}
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
      </div>
    </div>
  );
};

const AuthRouter = () => {
  const [showSignup, setShowSignup] = useState(false);
  if (showSignup) return <SignupPage onSwitchToLogin={() => setShowSignup(false)} />;
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