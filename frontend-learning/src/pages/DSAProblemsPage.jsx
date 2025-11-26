import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  Trophy,
  Clock,
  Play,
  Code,
  Terminal,
} from "lucide-react";
import { useAuth } from "./../contexts/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const DSAProblemsPage = ({
  darkMode,
  selectedTopic,
  selectedDifficulty,
  onBack,
}) => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Code editor states
  const [userCode, setUserCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  // Language configurations with templates
  const languages = [
    {
      id: "javascript",
      name: "JavaScript",
      icon: "🟨",
      template: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line);
});

rl.on('close', () => {
    // Your solution here
    const n = parseInt(input[0]);
    
    // Write your code
    
    console.log(result);
});`,
    },
    {
      id: "python",
      name: "Python",
      icon: "🐍",
      template: `# Read input from stdin
import sys

def solve():
    # Read input
    n = int(input())
    
    # Your solution here
    
    print(result)

if __name__ == "__main__":
    solve()`,
    },
    {
      id: "cpp",
      name: "C++",
      icon: "⚡",
      template: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Read input
    int n;
    cin >> n;
    
    // Your solution here
    
    cout << result << endl;
    return 0;
}`,
    },
    {
      id: "java",
      name: "Java",
      icon: "☕",
      template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        int n = sc.nextInt();
        
        // Your solution here
        
        System.out.println(result);
    }
}`,
    },
    {
      id: "c",
      name: "C",
      icon: "🔧",
      template: `#include <stdio.h>

int main() {
    // Read input
    int n;
    scanf("%d", &n);
    
    // Your solution here
    
    printf("%d\\n", result);
    return 0;
}`,
    },
  ];

  useEffect(() => {
    fetchProblems();
  }, [selectedTopic, selectedDifficulty]);

  useEffect(() => {
    // Reset code editor when problem changes
    const currentLang = languages.find((l) => l.id === selectedLanguage);
    setUserCode(currentLang?.template || "");
    setUserInput("");
    setOutput("");
    setTestResults([]);
    setAllTestsPassed(false);
  }, [currentIndex, selectedLanguage]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/dsa/problems?topic=${selectedTopic.id}&difficulty=${selectedDifficulty}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch problems");
      }

      const data = await response.json();

      if (!data.problems || data.problems.length === 0) {
        throw new Error("No problems available for this topic and difficulty");
      }

      setProblems(data.problems || []);
      console.log(
        `✅ Loaded ${data.problems.length} problems from ${data.source}`
      );
    } catch (err) {
      console.error("Error fetching problems:", err);
      setProblems([]);
      alert(
        err.message ||
          "Failed to load problems. Please try a different topic or difficulty."
      );
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    if (!userCode.trim()) {
      setOutput("Error: Please write some code first!");
      return;
    }

    setIsRunning(true);
    setOutput("Running code...");

    try {
      const response = await fetch(`${API_BASE_URL}/dsa/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode,
          language: selectedLanguage,
          input: userInput,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(
          `✅ Execution successful!\n\nOutput:\n${
            result.output || "(no output)"
          }`
        );
      } else {
        setOutput(`❌ ${result.error}\n\n${result.message}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    const currentProblem = problems[currentIndex];
    if (!currentProblem?.sampleTestCases) return;

    if (!userCode.trim()) {
      setOutput("Error: Please write some code first!");
      return;
    }

    setIsRunning(true);
    setOutput("Running all test cases...");
    setTestResults([]);

    try {
      const response = await fetch(`${API_BASE_URL}/dsa/run-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode,
          language: selectedLanguage,
          testCases: currentProblem.sampleTestCases,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTestResults(result.results);
        setAllTestsPassed(result.allPassed);

        if (result.allPassed) {
          setOutput(
            `✅ All ${result.totalTests} test cases passed! You can now submit your solution.`
          );
        } else {
          setOutput(
            `❌ ${result.passedTests}/${result.totalTests} test cases passed. Please review and try again.`
          );
        }
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!allTestsPassed) {
      alert("Please pass all test cases before submitting!");
      return;
    }

    if (!user?.id) {
      alert("Please login to submit solutions");
      return;
    }

    setCompleting(true);
    try {
      const currentProblem = problems[currentIndex];

      const response = await fetch(`${API_BASE_URL}/dsa/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          problemSlug: currentProblem.slug,
          problemTitle: currentProblem.title,
          topic: selectedTopic.name,
          difficulty: selectedDifficulty,
          language: selectedLanguage,
          code: userCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEarnedPoints(result.pointsEarned);
        setShowSuccess(true);

        // Update user context with new points and stats
        if (user.updateStats) {
          user.updateStats({
            dsaPoints: result.totalPoints,
            dsaRank: result.rank,
            dsaStats: result.stats,
          });
        }

        // Show success for 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
          // Auto-move to next problem
          if (currentIndex < problems.length - 1) {
            handleNext();
          }
        }, 5000);
      } else if (result.alreadyCompleted) {
        alert("You have already completed this problem!");
      } else {
        alert(result.error || "Failed to submit solution");
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      alert("Failed to submit solution. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSuccess(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl">Loading problems...</div>
      </div>
    );
  }

  if (!problems.length) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold mb-4">No Problems Available</h2>
        <p
          className={`${
            darkMode ? "text-gray-400" : "text-gray-600"
          } mb-6 max-w-md mx-auto`}>
          The GFG API doesn't have problems for{" "}
          <span className="font-bold">{selectedTopic.name}</span> at{" "}
          <span className="font-bold">{selectedDifficulty}</span> difficulty
          level.
        </p>
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-6 max-w-md mx-auto`}>
          <h3 className="font-bold mb-3">Try these combinations:</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Arrays - Easy, Medium, Hard</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Strings - Easy, Medium, Hard</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Linked List - Easy, Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Dynamic Programming - Medium, Hard</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:opacity-90">
            Choose Different Difficulty
          </button>
          <button
            onClick={() => {
              onBack();
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90">
            Choose Different Topic
          </button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              selectedDifficulty === "Easy"
                ? "bg-green-500"
                : selectedDifficulty === "Medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            } text-white`}>
            {selectedDifficulty}
          </span>
          <span className="text-sm font-medium">
            Problem {currentIndex + 1} of {problems.length}
          </span>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold mb-2">🎉 Problem Solved!</div>
              <div className="space-y-1">
                <div className="text-lg">
                  You earned{" "}
                  <span className="font-bold text-yellow-300">
                    +{earnedPoints} points
                  </span>
                </div>
                <div className="text-sm opacity-90">
                  Total Points: {user?.dsaPoints || 0} | Rank: #
                  {user?.dsaRank || "-"}
                </div>
                <div className="text-sm opacity-90">
                  Language:{" "}
                  {languages.find((l) => l.id === selectedLanguage)?.name}
                </div>
              </div>
              <div className="mt-3 text-sm opacity-75">
                Moving to next problem in 5 seconds...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split View: Problem Description + Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Problem Description */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl p-6 shadow-xl overflow-y-auto max-h-[calc(100vh-200px)]`}>
          <h1 className="text-2xl font-bold mb-2">{currentProblem.title}</h1>
          <div className="flex items-center space-x-4 text-sm mb-6">
            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
              {selectedTopic.name}
            </span>
            <span className="text-yellow-500 font-bold">
              +{currentProblem.points} points
            </span>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Problem Description</h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {currentProblem.description}
              </p>
            </div>

            {currentProblem.inputFormat && (
              <div>
                <h3 className="text-lg font-bold mb-2">Input Format</h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {currentProblem.inputFormat}
                </p>
              </div>
            )}

            {currentProblem.outputFormat && (
              <div>
                <h3 className="text-lg font-bold mb-2">Output Format</h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {currentProblem.outputFormat}
                </p>
              </div>
            )}

            {currentProblem.constraints && (
              <div>
                <h3 className="text-lg font-bold mb-2">Constraints</h3>
                <pre
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } text-sm`}>
                  {currentProblem.constraints}
                </pre>
              </div>
            )}

            {/* Sample Test Cases */}
            {currentProblem.sampleTestCases?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Sample Test Cases</h3>
                {currentProblem.sampleTestCases.map((testCase, idx) => (
                  <div
                    key={idx}
                    className={`${
                      darkMode ? "bg-gray-750" : "bg-gray-50"
                    } rounded-lg p-4 mb-3`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-bold text-sm mb-1">Input:</div>
                        <pre className="text-sm">{testCase.input}</pre>
                      </div>
                      <div>
                        <div className="font-bold text-sm mb-1">Output:</div>
                        <pre className="text-sm">{testCase.output}</pre>
                      </div>
                    </div>
                    {testCase.explanation && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-bold">Explanation:</span>{" "}
                        {testCase.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="space-y-4">
          {/* Language Selector */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-4`}>
            <div className="flex items-center space-x-4">
              <label className="font-bold text-sm">Programming Language:</label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLanguage === lang.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
                    <span className="mr-1">{lang.icon}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl overflow-hidden`}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Code Editor</span>
              </div>
              <span className="text-white text-sm">
                {languages.find((l) => l.id === selectedLanguage)?.icon}{" "}
                {languages.find((l) => l.id === selectedLanguage)?.name}
              </span>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="// Write your solution here
function solve(input) {
  // input is an array of lines
  // Return your answer
  
  return 'Your answer';
}"
              className={`w-full h-64 p-4 font-mono text-sm ${
                darkMode
                  ? "bg-gray-900 text-gray-100"
                  : "bg-gray-50 text-gray-900"
              } focus:outline-none resize-none`}
            />
          </div>

          {/* Custom Input */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl overflow-hidden`}>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Custom Input</span>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter custom input here (one value per line)"
              className={`w-full h-24 p-4 font-mono text-sm ${
                darkMode
                  ? "bg-gray-900 text-gray-100"
                  : "bg-gray-50 text-gray-900"
              } focus:outline-none resize-none`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={runCode}
              disabled={isRunning || !userCode}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg
                hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Run Code</span>
            </button>

            <button
              onClick={runAllTests}
              disabled={isRunning || !userCode}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg
                hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Run Tests</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={completing || !allTestsPassed}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg
              hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2">
            {completing ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Submit Solution</span>
              </>
            )}
          </button>

          {/* Output */}
          {output && (
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-4`}>
              <h3 className="font-bold mb-2">Output:</h3>
              <pre className="text-sm whitespace-pre-wrap">{output}</pre>
            </div>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-xl p-4`}>
              <h3 className="font-bold mb-3">Test Results:</h3>
              <div className="space-y-3">
                {testResults.map((result) => (
                  <div
                    key={result.testNumber}
                    className={`p-3 rounded-lg ${
                      result.passed
                        ? "bg-green-500 bg-opacity-20 border-l-4 border-green-500"
                        : "bg-red-500 bg-opacity-20 border-l-4 border-red-500"
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">
                        Test Case {result.testNumber}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          result.passed ? "text-green-500" : "text-red-500"
                        }`}>
                        {result.passed ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </div>
                    {!result.passed && (
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-semibold">Expected:</span>{" "}
                          {result.expectedOutput}
                        </div>
                        <div>
                          <span className="font-semibold">Got:</span>{" "}
                          {result.userOutput}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:opacity-90 
            disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2">
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === problems.length - 1}
          className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg
            hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2">
          <span>Next Problem</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DSAProblemsPage;
