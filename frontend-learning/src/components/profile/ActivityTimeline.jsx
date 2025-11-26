import React, { useState, useEffect } from "react";
import { Activity, Zap } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const ActivityCard = ({ activity, darkMode }) => {
  // Format timestamp to relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-xl ${
        darkMode
          ? "bg-gray-750 hover:bg-gray-700"
          : "bg-gray-50 hover:bg-gray-100"
      } transition-all cursor-pointer`}>
      <div className="text-3xl">{activity.icon || "📝"}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold">{activity.title}</h4>
          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            {activity.timestamp
              ? getRelativeTime(activity.timestamp)
              : activity.time}
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
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile which includes recent activities
        const response = await fetch(
          `${API_BASE_URL}/learning/progress?userId=${user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          setActivities(data.recentActivity || []);
        } else {
          // Fallback to mock data
          setActivities([
            {
              id: 1,
              type: "quiz",
              title: "JavaScript Fundamentals",
              result: "9/10",
              xp: 180,
              time: "2 hours ago",
              icon: "📝",
            },
            {
              id: 2,
              type: "lesson",
              title: "Variables Completed",
              result: "Completed",
              xp: 50,
              time: "5 hours ago",
              icon: "📚",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        // Fallback to mock data
        setActivities([
          {
            id: 1,
            type: "quiz",
            title: "JavaScript Fundamentals",
            result: "9/10",
            xp: 180,
            time: "2 hours ago",
            icon: "📝",
          },
          {
            id: 2,
            type: "lesson",
            title: "Variables Completed",
            result: "Completed",
            xp: 50,
            time: "5 hours ago",
            icon: "📚",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (loading) {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 shadow-xl`}>
        <h3 className="text-xl font-bold flex items-center space-x-2 mb-6">
          <Activity className="w-5 h-5 text-blue-500" />
          <span>Recent Activity</span>
        </h3>
        <div className="text-center py-8 text-gray-500">
          Loading activities...
        </div>
      </div>
    );
  }

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
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityCard
              key={activity.id || index}
              activity={activity}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activity. Start learning to see your progress here!
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
