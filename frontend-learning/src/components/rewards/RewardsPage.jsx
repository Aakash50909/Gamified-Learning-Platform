import React from "react";
import { Trophy, Target, Zap, Award, Star, Crown } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";

const RewardsPage = ({ darkMode }) => {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl">Loading rewards...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <div>Please login to view rewards</div>
      </div>
    );
  }

  // Generate achievements based on actual user data
  const achievements = generateAchievements(userData);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Rewards & Achievements
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Unlock achievements by solving problems
        </p>
      </div>

      {/* Points Summary */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-r from-yellow-600 to-orange-700"
            : "bg-gradient-to-r from-yellow-100 to-orange-100"
        } rounded-2xl p-8 text-center`}>
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <div className="text-5xl font-bold text-yellow-500 mb-2">
          {userData.dsaPoints.toLocaleString()}
        </div>
        <div className="text-xl font-medium">Total DSA Points</div>
        <div className="text-sm text-gray-500 mt-2">
          Rank #{userData.dsaRank || "-"} • {userData.totalProblems} Problems
          Solved
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Next Milestones</h2>
        <div className="space-y-4">
          <MilestoneProgress
            title="Reach 100 Points"
            current={userData.dsaPoints}
            target={100}
            darkMode={darkMode}
          />
          <MilestoneProgress
            title="Solve 20 Problems"
            current={userData.totalProblems}
            target={20}
            darkMode={darkMode}
          />
          <MilestoneProgress
            title="7 Day Streak"
            current={userData.streak}
            target={7}
            darkMode={darkMode}
          />
          <MilestoneProgress
            title="Master 3 Topics"
            current={userData.topicsProgress.length}
            target={3}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement, darkMode }) => {
  const Icon = achievement.icon;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl p-6 shadow-lg ${
        achievement.unlocked ? "" : "opacity-50"
      } transition-all hover:scale-105`}>
      <div
        className={`w-16 h-16 rounded-full ${
          achievement.unlocked
            ? `bg-gradient-to-br ${achievement.color}`
            : darkMode
            ? "bg-gray-700"
            : "bg-gray-200"
        } flex items-center justify-center mx-auto mb-4`}>
        <Icon
          className={`w-8 h-8 ${
            achievement.unlocked ? "text-white" : "text-gray-500"
          }`}
        />
      </div>
      <h3 className="text-lg font-bold text-center mb-2">
        {achievement.title}
      </h3>
      <p
        className={`text-sm text-center ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
        {achievement.description}
      </p>
      {achievement.unlocked && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            ✓ Unlocked
          </span>
        </div>
      )}
      {!achievement.unlocked && achievement.progress && (
        <div className="mt-4">
          <div className="text-xs text-center text-gray-500 mb-1">
            {achievement.progress.current} / {achievement.progress.target}
          </div>
          <div
            className={`w-full h-2 ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                width: `${Math.min(
                  (achievement.progress.current / achievement.progress.target) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MilestoneProgress = ({ title, current, target, darkMode }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const completed = current >= target;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-gray-500">
          {current} / {target}
        </span>
      </div>
      <div
        className={`w-full h-3 ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full overflow-hidden`}>
        <div
          className={`h-full ${
            completed
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-purple-500 to-pink-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {completed && (
        <div className="text-xs text-green-500 mt-1">✓ Completed!</div>
      )}
    </div>
  );
};

// Generate achievements based on user data
function generateAchievements(userData) {
  return [
    {
      id: "first-problem",
      title: "First Steps",
      description: "Solve your first problem",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      unlocked: userData.totalProblems >= 1,
      progress: { current: Math.min(userData.totalProblems, 1), target: 1 },
    },
    {
      id: "problem-solver",
      title: "Problem Solver",
      description: "Solve 10 problems",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      unlocked: userData.totalProblems >= 10,
      progress: { current: Math.min(userData.totalProblems, 10), target: 10 },
    },
    {
      id: "coding-master",
      title: "Coding Master",
      description: "Solve 50 problems",
      icon: Crown,
      color: "from-yellow-500 to-orange-500",
      unlocked: userData.totalProblems >= 50,
      progress: { current: Math.min(userData.totalProblems, 50), target: 50 },
    },
    {
      id: "point-collector",
      title: "Point Collector",
      description: "Earn 100 DSA points",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      unlocked: userData.dsaPoints >= 100,
      progress: { current: Math.min(userData.dsaPoints, 100), target: 100 },
    },
    {
      id: "dedicated-learner",
      title: "Dedicated Learner",
      description: "Maintain a 7-day streak",
      icon: Award,
      color: "from-orange-500 to-red-500",
      unlocked: userData.streak >= 7,
      progress: { current: Math.min(userData.streak, 7), target: 7 },
    },
    {
      id: "easy-champion",
      title: "Easy Champion",
      description: "Solve 20 easy problems",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      unlocked: userData.easyCompleted >= 20,
      progress: { current: Math.min(userData.easyCompleted, 20), target: 20 },
    },
    {
      id: "medium-master",
      title: "Medium Master",
      description: "Solve 15 medium problems",
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      unlocked: userData.mediumCompleted >= 15,
      progress: {
        current: Math.min(userData.mediumCompleted, 15),
        target: 15,
      },
    },
    {
      id: "hard-hero",
      title: "Hard Hero",
      description: "Solve 10 hard problems",
      icon: Star,
      color: "from-red-500 to-pink-500",
      unlocked: userData.hardCompleted >= 10,
      progress: { current: Math.min(userData.hardCompleted, 10), target: 10 },
    },
    {
      id: "polyglot",
      title: "Polyglot",
      description: "Use 3 different languages",
      icon: Award,
      color: "from-indigo-500 to-purple-500",
      unlocked: userData.languagesUsed.length >= 3,
      progress: {
        current: Math.min(userData.languagesUsed.length, 3),
        target: 3,
      },
    },
  ];
}

export default RewardsPage;
