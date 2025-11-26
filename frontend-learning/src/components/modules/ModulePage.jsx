import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import TopicCard from "./TopicCard";

const API_BASE_URL = "http://localhost:5000/api";

const ModulePage = ({ darkMode, skill, setCurrentView, setSelectedTopic }) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      if (!skill) {
        setCurrentView("skills");
        return;
      }

      try {
        // Fetch module details from API
        const response = await fetch(
          `${API_BASE_URL}/learning/modules/${skill.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch module");
        }

        const data = await response.json();

        // Transform API data to match component expectations
        setModule({
          name: data.title,
          topics: data.topicsData || [],
        });
      } catch (error) {
        console.error("Error fetching module:", error);

        // Fallback to mock data
        const mockModule = {
          name: skill.name,
          topics: [
            {
              id: 1,
              name: "Topic 1",
              level: "Beginner",
              completion: 0,
              locked: false,
              xp: 150,
            },
            {
              id: 2,
              name: "Topic 2",
              level: "Beginner",
              completion: 0,
              locked: false,
              xp: 200,
            },
          ],
        };
        setModule(mockModule);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [skill, setCurrentView]);

  if (!skill) {
    setCurrentView("skills");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl">Loading module...</div>
      </div>
    );
  }

  if (!module) {
    setCurrentView("skills");
    return null;
  }

  const Icon = skill.icon;

  return (
    <div className="space-y-8 animate-fade-in">
      <button
        onClick={() => setCurrentView("skills")}
        className={`flex items-center space-x-2 ${
          darkMode
            ? "text-gray-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}>
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span>Back to Skills</span>
      </button>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-8 shadow-xl`}>
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-4 rounded-xl bg-gradient-to-br ${skill.color}`}>
            <Icon className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{module.name} Path</h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Master the fundamentals and beyond
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {module.topics && module.topics.length > 0 ? (
            module.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                darkMode={darkMode}
                onClick={() => {
                  if (!topic.locked) {
                    setSelectedTopic(topic);
                    setCurrentView("quiz");
                  }
                }}
              />
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">
              No topics available yet. Add topics in your database!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
