export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiService = {
  async fetchLearningData() {
    const response = await fetch(`${API_BASE_URL}/learning/modules`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch learning data");
    return await response.json();
  },

  async fetchLeaderboard(type = "global") {
    const response = await fetch(`${API_BASE_URL}/leaderboard?type=${type}`);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    return await response.json();
  },

  async fetchUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  },

  async fetchAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return await response.json();
  },

  async submitQuiz(quizId, answers) {
    const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error("Failed to submit quiz");
    return await response.json();
  },
};

export default apiService;
