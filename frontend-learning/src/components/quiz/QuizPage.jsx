import React, { useState, useEffect } from "react";
import { ChevronRight, Clock, Zap } from "lucide-react";
import { quizData } from "../../api/mockData";
import apiService from "../../api/apiService";
import { LoadingSpinner } from "../common/LoadingSpinner";

const QuizPage = ({ darkMode, topic, setCurrentView }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [quizComplete, setQuizComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && !quizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quizComplete]);

  if (!topic) {
    setCurrentView("skills");
    return null;
  }

  const quiz = quizData[1];
  if (!quiz) {
    setCurrentView("skills");
    return null;
  }

  const question = quiz.questions[currentQuestion];

  const handleAnswer = async () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
      setSubmitting(true);

      try {
        const submissionResult = await apiService.submitQuiz(
          topic.id,
          newAnswers
        );
        setResult(submissionResult);
      } catch (error) {
        setSubmitError(error.message);
        const score = newAnswers.filter(
          (ans, idx) => ans === quiz.questions[idx].correct
        ).length;
        setResult({
          score,
          totalQuestions: quiz.questions.length,
          xpEarned: quiz.xpReward,
          correct: score,
          percentage: (score / quiz.questions.length) * 100,
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const score = answers.filter(
    (ans, idx) => ans === quiz.questions[idx].correct
  ).length;
  const timeProgress = (timeLeft / quiz.timeLimit) * 100;

  if (quizComplete) {
    if (submitting) {
      return (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-8 shadow-xl text-center space-y-6`}>
            <LoadingSpinner />
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Submitting your quiz...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl p-8 shadow-xl text-center space-y-6`}>
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>

          {submitError && (
            <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-3 text-sm text-yellow-500">
              Note: Could not sync with server, showing local results
            </div>
          )}

          <div className="space-y-4">
            <div
              className={`${
                darkMode ? "bg-gray-750" : "bg-gray-50"
              } rounded-xl p-6`}>
              <div className="text-4xl font-bold text-purple-500">
                {result?.correct || score}/
                {result?.totalQuestions || quiz.questions.length}
              </div>
              <div
                className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Correct Answers
              </div>
              {result?.percentage && (
                <div className="text-sm text-green-500 mt-2">
                  {result.percentage.toFixed(0)}% Accuracy
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-yellow-500">
              <Zap className="w-8 h-8" />
              <span>+{result?.xpEarned || quiz.xpReward} XP</span>
            </div>
          </div>
          <button
            onClick={() => setCurrentView("skills")}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
            Back to Skills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView("module")}
          className={`flex items-center space-x-2 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Exit Quiz</span>
        </button>
        <div className="flex items-center space-x-2">
          <Clock
            className={`w-5 h-5 ${
              timeLeft < 30 ? "text-red-500" : "text-blue-500"
            }`}
          />
          <span className={`font-bold ${timeLeft < 30 ? "text-red-500" : ""}`}>
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        className={`h-2 ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full overflow-hidden`}>
        <div
          className={`h-full ${
            timeLeft < 30 ? "bg-red-500" : "bg-blue-500"
          } transition-all duration-1000`}
          style={{ width: `${timeProgress}%` }}
        />
      </div>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-8 shadow-xl`}>
        <div className="mb-6">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mb-2`}>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <h2 className="text-2xl font-bold">{question.q}</h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(idx)}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 ${
                selectedAnswer === idx
                  ? "border-purple-500 bg-purple-500 text-white"
                  : darkMode
                  ? "border-gray-700 bg-gray-750 hover:border-gray-600"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}>
              <span className="font-bold mr-3">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleAnswer}
          disabled={selectedAnswer === null}
          className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
          {currentQuestion < quiz.questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
