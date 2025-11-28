import React, { useState, useEffect } from "react";
import { ChevronRight, Trophy, Target, ArrowLeft } from "lucide-react";
import { useAuth } from "./../contexts/AuthContext";
import DSAPractice from "../components/DSAPractice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const DSATopicsPage = ({ darkMode }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null); // State to handle navigation

  useEffect(() => {
    fetchTopics();
  }, [user]);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dsa/topics`);
      const data = await response.json();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching topics:", err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW 2: PROBLEM LIST (When a topic is selected) ---
  if (selectedTopic) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Topics</span>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {selectedTopic.name} Problems
          </h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Solve these to earn points!</p>
        </div>

        {/* Pass the topic name to filter problems if you want, or just show all */}
        <DSAPractice selectedTopic={selectedTopic.name} />
      </div>
    );
  }

  // --- VIEW 1: TOPIC GRID (Default) ---
  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Arena...</div>;
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
            title="Global Rank"
            value={`#${user.dsaRank || 42}`}
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
            onClick={() => setSelectedTopic(topic)} // Click triggers View 2
          />
        ))}
      </div>
    </div>
  );
};

// ... Keep your StatCard and TopicCard components exactly as they were ...
const StatCard = ({ icon: Icon, title, value, color, darkMode }) => {
  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg text-center`}>
      <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
      <div className="text-3xl font-bold">{value}</div>
      <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{title}</div>
    </div>
  );
};

const TopicCard = ({ topic, darkMode, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-2xl"} 
        rounded-2xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 
        border-2 border-transparent hover:border-purple-500`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${topic.color}`}>
          <span className="text-4xl">{topic.icon}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
        {topic.description}
      </p>
    </div>
  );
};

export default DSATopicsPage;