import React from "react";
import { ChevronRight } from "lucide-react";
import { moduleData } from "../../api/mockData";
import TopicCard from "./TopicCard";

const ModulePage = ({ darkMode, skill, setCurrentView, setSelectedTopic }) => {
  if (!skill) {
    setCurrentView("skills");
    return null;
  }

  const module = moduleData[skill.id];
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
          {module.topics.map((topic) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
