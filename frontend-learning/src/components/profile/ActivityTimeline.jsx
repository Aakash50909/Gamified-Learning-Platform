import React from "react";
import { Activity, Zap } from "lucide-react";
import { recentActivities } from "../../api/mockData";

const ActivityCard = ({ activity, darkMode }) => {
  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-xl ${
        darkMode
          ? "bg-gray-750 hover:bg-gray-700"
          : "bg-gray-50 hover:bg-gray-100"
      } transition-all cursor-pointer`}>
      <div className="text-3xl">{activity.icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold">{activity.title}</h4>
          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            {activity.time}
          </span>
        </div>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {activity.result}
        </p>
        <div className="flex items-center space-x-1 mt-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">
            +{activity.xp} XP
          </span>
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline = ({ darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl`}>
      <h3 className="text-xl font-bold flex items-center space-x-2 mb-6">
        <Activity className="w-5 h-5 text-blue-500" />
        <span>Recent Activity</span>
      </h3>

      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
