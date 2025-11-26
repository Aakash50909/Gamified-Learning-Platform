import React, { useState } from "react";
import DSATopicsPage from "./DSATopicsPage";
import DSADifficultyPage from "./DSADifficultyPage";
import DSAProblemsPage from "./DSAProblemsPage";
import DSALeaderboardPage from "./DSALeaderboardPage";
import { Trophy } from "lucide-react";

const DSAMainContainer = ({ darkMode }) => {
  const [currentPage, setCurrentPage] = useState("topics"); // topics | difficulty | problems | leaderboard
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCurrentPage("difficulty");
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage("problems");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setCurrentPage("topics");
  };

  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
    setCurrentPage("difficulty");
  };

  return (
    <div className="min-h-screen">
      {/* Floating Leaderboard Button */}
      {currentPage !== "leaderboard" && (
        <button
          onClick={() => setCurrentPage("leaderboard")}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-yellow-500 to-orange-500 
            text-white rounded-full shadow-2xl hover:scale-110 transition-transform">
          <Trophy className="w-6 h-6" />
        </button>
      )}

      {/* Page Rendering */}
      {currentPage === "topics" && (
        <DSATopicsPage darkMode={darkMode} onTopicSelect={handleTopicSelect} />
      )}

      {currentPage === "difficulty" && (
        <DSADifficultyPage
          darkMode={darkMode}
          selectedTopic={selectedTopic}
          onDifficultySelect={handleDifficultySelect}
          onBack={handleBackToTopics}
        />
      )}

      {currentPage === "problems" && (
        <DSAProblemsPage
          darkMode={darkMode}
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          onBack={handleBackToDifficulty}
        />
      )}

      {currentPage === "leaderboard" && (
        <DSALeaderboardPage darkMode={darkMode} onBack={handleBackToTopics} />
      )}
    </div>
  );
};

export default DSAMainContainer;
