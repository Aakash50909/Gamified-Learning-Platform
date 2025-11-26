import React, { useState, useEffect } from "react";
import { ChevronRight, Trophy, Target } from "lucide-react";
import { useAuth } from "./../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const DSATopicsPage = ({ darkMode, setCurrentView, onTopicSelect }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [user]);

  const fetchTopics = async () => {
    try {
      const url = user?.id
        ? `${API_BASE_URL}/dsa/topics?userId=${user.id}`
        : `${API_BASE_URL}/dsa/topics`;

      const response = await fetch(url);
      const data = await response.json();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching topics:", err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl">Loading topics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          DSA Practice Arena
        </h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Master Data Structures & Algorithms
        </p>
      </div>

      {/* Stats Overview */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Trophy}
            title="Total Points"
            value={user.dsaPoints || 0}
            color="text-yellow-500"
            darkMode={darkMode}
          />
          <StatCard
            icon={Target}
            title="Problems Solved"
            value={user.dsaStats?.totalCompleted || 0}
            color="text-green-500"
            darkMode={darkMode}
          />
          <StatCard
            icon={Trophy}
            title="Current Rank"
            value={`#${user.dsaRank || "-"}`}
            color="text-purple-500"
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            darkMode={darkMode}
            onClick={() => onTopicSelect(topic)}
          />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color, darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl p-6 shadow-lg text-center`}>
      <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
      <div className="text-3xl font-bold">{value}</div>
      <div
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {title}
      </div>
    </div>
  );
};

const TopicCard = ({ topic, darkMode, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-2xl"
      } 
        rounded-2xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 
        border-2 border-transparent hover:border-purple-500`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${topic.color}`}>
          <span className="text-4xl">{topic.icon}</span>
        </div>
        {topic.completed > 0 && (
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {topic.completed} ✓
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
      <p
        className={`text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        } mb-4`}>
        {topic.description}
      </p>

      {topic.points > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-yellow-500 font-bold">
            {topic.points} points
          </span>
          <ChevronRight className="w-5 h-5 text-purple-500" />
        </div>
      )}
    </div>
  );
};

export default DSATopicsPage;
