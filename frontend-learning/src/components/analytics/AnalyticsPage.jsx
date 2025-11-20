import React from "react";
import { TrendingUp, Target, Crown, Clock, Star } from "lucide-react";
import { performanceInsights } from "../../api/mockData";
import PerformanceCard from "./PerformanceCard";
import InsightCard from "./InsightCard";
import XPGrowthChart from "./XPGrowthChart";
import SkillDistributionChart from "./SkillDistributionChart";
import EventParticipationChart from "./EventParticipationChart";

const AnalyticsPage = ({ darkMode }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p
          className={`text-sm sm:text-base ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
          Track your performance and insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <PerformanceCard
          title="Predicted Rank"
          value={performanceInsights.predictedRank}
          icon={TrendingUp}
          color="text-green-500"
          darkMode={darkMode}
        />
        <PerformanceCard
          title="Consistency Score"
          value={`${performanceInsights.consistencyScore}%`}
          icon={Target}
          color="text-blue-500"
          darkMode={darkMode}
        />
        <PerformanceCard
          title="Next Level"
          value={`${performanceInsights.nextLevelXP} XP`}
          icon={Crown}
          color="text-yellow-500"
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <XPGrowthChart darkMode={darkMode} />
        <SkillDistributionChart darkMode={darkMode} />
      </div>

      <EventParticipationChart darkMode={darkMode} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <InsightCard
          title="Average Session"
          value={performanceInsights.averageSessionTime}
          icon={Clock}
          darkMode={darkMode}
        />
        <InsightCard
          title="Strongest Skill"
          value={performanceInsights.strongestSkill}
          icon={Star}
          darkMode={darkMode}
        />
        <InsightCard
          title="Improvement Area"
          value={performanceInsights.improvementArea}
          icon={Target}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
