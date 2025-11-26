import React from "react";
import { TrendingUp, Zap, Crown, Flame, Check, Activity } from "lucide-react";
import { useLearningData } from "../../hooks/useLearningData";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorDisplay } from "../common/ErrorDisplay";
import { SkeletonCard } from "../common/SkeletonCard";
// ❌ REMOVE THIS LINE:
// import { skillsData } from "../../api/mockData";
import SkillCard from "./SkillCard";
import StatCard from "./StatCard";

const SkillsPage = ({ darkMode, setCurrentView, setSelectedSkill }) => {
  const { data: learningData, loading, error, refresh } = useLearningData();

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Learning Journey
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading your skills...
          </p>
        </div>
        <LoadingSpinner />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} darkMode={darkMode} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Learning Journey
          </h1>
        </div>
        <ErrorDisplay message={error} onRetry={refresh} darkMode={darkMode} />
      </div>
    );
  }

  // ✅ CHANGED: Only use data from API, show message if no data
  const modules = learningData?.modules || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Learning Journey
        </h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Choose a skill to continue your adventure
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={refresh}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-50"
          } shadow-lg transition-all`}>
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((skill) => (
            <SkillCard
              key={skill.id || skill._id}
              skill={skill}
              darkMode={darkMode}
              onClick={() => {
                setSelectedSkill(skill);
                setCurrentView("module");
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl p-12 shadow-xl text-center`}>
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold mb-2">No Modules Yet</h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
            Your learning modules will appear here once they're added to the
            database.
          </p>
          <button
            onClick={refresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            Refresh
          </button>
        </div>
      )}

      {learningData?.userProgress && (
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl p-6 shadow-xl`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span>Your Progress</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total XP"
              value={learningData.userProgress.totalXP.toLocaleString()}
              icon={Zap}
              color="text-purple-500"
              darkMode={darkMode}
            />
            <StatCard
              title="Level"
              value={learningData.userProgress.level}
              icon={Crown}
              color="text-yellow-500"
              darkMode={darkMode}
            />
            <StatCard
              title="Streak"
              value={`${learningData.userProgress.streak} days`}
              icon={Flame}
              color="text-orange-500"
              darkMode={darkMode}
            />
            <StatCard
              title="Completed"
              value={learningData.userProgress.completedModules}
              icon={Check}
              color="text-green-500"
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
