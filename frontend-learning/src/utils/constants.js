export const CONFIG = {
  API_BASE_URL: "http://localhost:5000/api", // ✅ Changed to backend URL
  USE_MOCK_DATA: false, // ✅ Changed to false - use real API
  ENABLE_OFFLINE_MODE: true, // Keep this - fallback if API fails
};

export const avatarEmojis = {
  ninja: "🥷",
  robot: "🤖",
  wizard: "🧙",
  scientist: "👨‍🔬",
  astronaut: "👨‍🚀",
  artist: "👨‍🎨",
  detective: "🕵️",
  superhero: "🦸",
  pirate: "🏴‍☠️",
  knight: "⚔️",
  cat: "🐱",
  dog: "🐶",
  panda: "🐼",
  unicorn: "🦄",
  dragon: "🐉",
  alien: "👽",
};

export const BADGES = {
  streakStarter: {
    id: "streakStarter",
    name: "Streak Starter",
    description: "Practice for 3 days in a row",
    icon: "🔥",
    requirement: (stats) => stats.currentStreak >= 3,
    color: "from-orange-500 to-red-500",
  },
  quizMaster: {
    id: "quizMaster",
    name: "Quiz Master",
    description: "Complete 10 quizzes",
    icon: "🎓",
    requirement: (stats) => stats.quizzesCompleted >= 10,
    color: "from-blue-500 to-cyan-500",
  },
  fastThinker: {
    id: "fastThinker",
    name: "Fast Thinker",
    description: "Average under 30s per question",
    icon: "⚡",
    requirement: (stats) => stats.avgTimePerQuestion <= 30,
    color: "from-yellow-500 to-orange-500",
  },
  allRounder: {
    id: "allRounder",
    name: "All-Rounder",
    description: "Practice all skill categories",
    icon: "🌟",
    requirement: (stats) => stats.skillsCompleted >= 4,
    color: "from-purple-500 to-pink-500",
  },
  perfectScore: {
    id: "perfectScore",
    name: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "💯",
    requirement: (stats) => stats.perfectScores >= 1,
    color: "from-green-500 to-emerald-500",
  },
  nightOwl: {
    id: "nightOwl",
    name: "Night Owl",
    description: "Practice after midnight",
    icon: "🦉",
    requirement: (stats) => stats.nightSessions >= 1,
    color: "from-indigo-500 to-purple-500",
  },
  earlyBird: {
    id: "earlyBird",
    name: "Early Bird",
    description: "Practice before 6 AM",
    icon: "🌅",
    requirement: (stats) => stats.earlySessions >= 1,
    color: "from-pink-500 to-rose-500",
  },
  master: {
    id: "master",
    name: "Master",
    description: "Reach level 20",
    icon: "👑",
    requirement: (stats) => stats.level >= 20,
    color: "from-yellow-600 to-orange-600",
  },
};
