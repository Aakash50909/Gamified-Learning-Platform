import React from "react";

export const ErrorDisplay = ({ message, onRetry, darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-8 shadow-xl text-center`}>
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
        {message || "Unable to load content. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
          Try Again
        </button>
      )}
    </div>
  );
};
