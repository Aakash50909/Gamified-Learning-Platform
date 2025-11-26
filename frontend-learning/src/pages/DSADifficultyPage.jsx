import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";

const DIFFICULTY_LEVELS = [
  {
    level: "Easy",
    points: 10,
    color: "from-green-500 to-emerald-500",
    icon: "🟢",
    description: "Perfect for beginners",
  },
  {
    level: "Medium",
    points: 20,
    color: "from-yellow-500 to-orange-500",
    icon: "🟡",
    description: "Intermediate challenges",
  },
  {
    level: "Hard",
    points: 30,
    color: "from-red-500 to-pink-500",
    icon: "🔴",
    description: "Advanced problems",
  },
];

const DSADifficultyPage = ({
  darkMode,
  selectedTopic,
  onDifficultySelect,
  onBack,
}) => {
  if (!selectedTopic) {
    onBack();
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`flex items-center space-x-2 ${
          darkMode
            ? "text-gray-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}>
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Topics</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-4">
        <div
          className={`inline-block p-6 rounded-2xl bg-gradient-to-br ${selectedTopic.color}`}>
          <span className="text-6xl">{selectedTopic.icon}</span>
        </div>
        <h1 className="text-4xl font-bold">{selectedTopic.name}</h1>
        <p
          className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {selectedTopic.description}
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Choose Difficulty Level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DIFFICULTY_LEVELS.map((difficulty) => (
            <DifficultyCard
              key={difficulty.level}
              difficulty={difficulty}
              darkMode={darkMode}
              onClick={() => onDifficultySelect(difficulty.level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DifficultyCard = ({ difficulty, darkMode, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-2xl"
      }
        rounded-2xl p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105
        border-2 border-transparent hover:border-purple-500 text-center`}>
      <div className="mb-4">
        <span className="text-6xl">{difficulty.icon}</span>
      </div>

      <h3 className="text-2xl font-bold mb-2">{difficulty.level}</h3>
      <p
        className={`text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        } mb-4`}>
        {difficulty.description}
      </p>

      <div
        className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${difficulty.color} text-white font-bold`}>
        +{difficulty.points} points
      </div>

      <div className="mt-6 flex items-center justify-center space-x-2 text-purple-500 font-medium">
        <span>Start Practicing</span>
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};

export default DSADifficultyPage;
