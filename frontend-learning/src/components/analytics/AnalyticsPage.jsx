import React from "react";
import { TrendingUp, Target, Award, Calendar, Code } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";

const AnalyticsPage = ({ darkMode }) => {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl">Loading analytics...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <div>Please login to view analytics</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Track your DSA learning progress
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          icon={Award}
          title="Total Points"
          value={userData.dsaPoints}
          subtitle="DSA Points Earned"
          color="from-yellow-500 to-orange-500"
          darkMode={darkMode}
        />
        <MetricCard
          icon={Target}
          title="Problems Solved"
          value={userData.totalProblems}
          subtitle="Total Completed"
          color="from-green-500 to-emerald-500"
          darkMode={darkMode}
        />
        <MetricCard
          icon={TrendingUp}
          title="Weekly Progress"
          value={userData.weeklyProgress}
          subtitle="This Week"
          color="from-purple-500 to-pink-500"
          darkMode={darkMode}
        />
        <MetricCard
          icon={Calendar}
          title="Streak"
          value={`${userData.streak} days`}
          subtitle="Current Streak"
          color="from-orange-500 to-red-500"
          darkMode={darkMode}
        />
      </div>

      {/* Difficulty Distribution */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Difficulty Distribution</h2>
        <div className="space-y-6">
          <DifficultyBar
            label="Easy"
            count={userData.easyCompleted}
            total={userData.totalProblems}
            color="bg-green-500"
            darkMode={darkMode}
          />
          <DifficultyBar
            label="Medium"
            count={userData.mediumCompleted}
            total={userData.totalProblems}
            color="bg-yellow-500"
            darkMode={darkMode}
          />
          <DifficultyBar
            label="Hard"
            count={userData.hardCompleted}
            total={userData.totalProblems}
            color="bg-red-500"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Topics Performance */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Topics Performance</h2>
        {userData.topicsProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userData.topicsProgress.map((topic) => (
              <TopicCard key={topic.name} topic={topic} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No topic data yet. Start solving problems!
          </p>
        )}
      </div>

      {/* Language Distribution */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Code className="w-6 h-6" />
          <span>Language Distribution</span>
        </h2>
        {userData.languagesUsed.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {userData.languagesUsed.map((lang) => (
              <LanguageCard
                key={lang.name}
                language={lang}
                total={userData.totalProblems}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No language data yet</p>
        )}
      </div>

      {/* Performance Summary */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Average Points per Problem"
            value={
              userData.totalProblems > 0
                ? Math.round(userData.dsaPoints / userData.totalProblems)
                : 0
            }
            suffix="points"
            darkMode={darkMode}
          />
          <SummaryCard
            title="Most Practiced Topic"
            value={userData.topicsProgress[0]?.name || "None"}
            suffix={
              userData.topicsProgress[0]
                ? `(${userData.topicsProgress[0].count} problems)`
                : ""
            }
            darkMode={darkMode}
          />
          <SummaryCard
            title="Preferred Language"
            value={userData.languagesUsed[0]?.name || "None"}
            suffix={
              userData.languagesUsed[0]
                ? `(${userData.languagesUsed[0].count} problems)`
                : ""
            }
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  darkMode,
}) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl p-6 shadow-lg`}>
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium mb-1">{title}</div>
      <div
        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {subtitle}
      </div>
    </div>
  );
};

const DifficultyBar = ({ label, count, total, color, darkMode }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-gray-500">
          {count} / {total} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div
        className={`w-full h-4 ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full overflow-hidden`}>
        <div
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const TopicCard = ({ topic, darkMode }) => {
  return (
    <div
      className={`${darkMode ? "bg-gray-750" : "bg-gray-50"} rounded-xl p-6`}>
      <h3 className="text-lg font-bold mb-4">{topic.name}</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Total Solved</span>
          <span className="font-bold">{topic.count}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Points Earned</span>
          <span className="font-bold text-yellow-500">{topic.points}</span>
        </div>
        <div className="pt-3 border-t border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-green-500">🟢 Easy: {topic.easy}</span>
            <span className="text-yellow-500">🟡 Medium: {topic.medium}</span>
            <span className="text-red-500">🔴 Hard: {topic.hard}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LanguageCard = ({ language, total, darkMode }) => {
  const percentage = total > 0 ? (language.count / total) * 100 : 0;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-750" : "bg-gray-50"
      } rounded-xl p-4 text-center`}>
      <div className="text-3xl mb-2">{getLanguageIcon(language.name)}</div>
      <div className="font-bold">{language.name}</div>
      <div className="text-2xl font-bold text-purple-500 mt-2">
        {language.count}
      </div>
      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
    </div>
  );
};

const SummaryCard = ({ title, value, suffix, darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-750" : "bg-gray-50"
      } rounded-xl p-6 text-center`}>
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {suffix && <div className="text-xs text-gray-500">{suffix}</div>}
    </div>
  );
};

const getLanguageIcon = (language) => {
  const icons = {
    javascript: "🟨",
    python: "🐍",
    cpp: "⚡",
    java: "☕",
    c: "🔧",
  };
  return icons[language?.toLowerCase()] || "💻";
};

export default AnalyticsPage;
