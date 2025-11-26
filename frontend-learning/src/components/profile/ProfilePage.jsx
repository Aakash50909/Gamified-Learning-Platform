import React, { useState } from "react";
import {
  Trophy,
  Target,
  Code,
  TrendingUp,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useUserData } from "../../hooks/useUserData";
import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = ({ darkMode }) => {
  const { userData, loading, error, refetch } = useUserData();
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    avatar: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  const handleEditClick = () => {
    setEditData({
      username: userData?.username || "",
      avatar: userData?.avatar || "ninja",
      bio: userData?.bio || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ username: "", avatar: "", bio: "" });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await updateProfile(editData);
      if (result.success) {
        await refetch();
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <div>Please login to view your profile</div>
      </div>
    );
  }

  const avatarOptions = [
    { id: "ninja", emoji: "🥷", name: "Ninja" },
    { id: "robot", emoji: "🤖", name: "Robot" },
    { id: "wizard", emoji: "🧙", name: "Wizard" },
    { id: "scientist", emoji: "👨‍🔬", name: "Scientist" },
    { id: "astronaut", emoji: "👨‍🚀", name: "Astronaut" },
    { id: "artist", emoji: "👨‍🎨", name: "Artist" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Card with Edit */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-8`}>
        {!isEditing ? (
          <>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="text-6xl">{getAvatarEmoji(userData.avatar)}</div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-4`}>
                  {userData.bio || "No bio yet"}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>Rank #{userData.dsaRank || "-"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>{userData.totalProblems} Problems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span>{userData.dsaPoints} Points</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Edit Profile</h2>

            {/* Avatar Selection */}
            <div>
              <label className="block font-medium mb-3">Choose Avatar</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() =>
                      setEditData({ ...editData, avatar: avatar.id })
                    }
                    className={`p-4 rounded-xl text-center transition-all ${
                      editData.avatar === avatar.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110"
                        : darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}>
                    <div className="text-4xl mb-2">{avatar.emoji}</div>
                    <div className="text-xs font-medium">{avatar.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block font-medium mb-2">Username</label>
              <input
                type="text"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-900 border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter your username"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block font-medium mb-2">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) =>
                  setEditData({ ...editData, bio: e.target.value })
                }
                rows={3}
                className={`w-full px-4 py-3 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-50 text-gray-900 border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center space-x-2">
                <Save className="w-5 h-5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center space-x-2">
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Trophy}
          title="Total Points"
          value={userData.dsaPoints.toLocaleString()}
          color="text-yellow-500"
          darkMode={darkMode}
        />
        <StatCard
          icon={Target}
          title="Problems Solved"
          value={userData.totalProblems}
          color="text-green-500"
          darkMode={darkMode}
        />
        <StatCard
          icon={Calendar}
          title="Current Streak"
          value={`${userData.streak} days`}
          color="text-orange-500"
          darkMode={darkMode}
        />
        <StatCard
          icon={TrendingUp}
          title="This Week"
          value={`${userData.weeklyProgress} solved`}
          color="text-purple-500"
          darkMode={darkMode}
        />
      </div>

      {/* Problems Breakdown */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Problems Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DifficultyCard
            difficulty="Easy"
            count={userData.easyCompleted}
            color="bg-green-500"
            darkMode={darkMode}
          />
          <DifficultyCard
            difficulty="Medium"
            count={userData.mediumCompleted}
            color="bg-yellow-500"
            darkMode={darkMode}
          />
          <DifficultyCard
            difficulty="Hard"
            count={userData.hardCompleted}
            color="bg-red-500"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Topics Progress */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Topics Progress</h2>
        {userData.topicsProgress.length > 0 ? (
          <div className="space-y-4">
            {userData.topicsProgress.map((topic) => (
              <TopicProgress
                key={topic.name}
                topic={topic}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No problems solved yet. Start practicing!
          </p>
        )}
      </div>

      {/* Languages Used */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Languages Used</h2>
        {userData.languagesUsed.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userData.languagesUsed.map((lang) => (
              <div
                key={lang.name}
                className={`${
                  darkMode ? "bg-gray-750" : "bg-gray-50"
                } rounded-xl p-4 text-center`}>
                <div className="text-2xl mb-2">
                  {getLanguageIcon(lang.name)}
                </div>
                <div className="font-bold">{lang.name}</div>
                <div className="text-sm text-gray-500">
                  {lang.count} problems
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No languages tracked yet
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-6`}>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        {userData.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {userData.recentActivity.map((activity, idx) => (
              <ActivityItem key={idx} activity={activity} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
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

const DifficultyCard = ({ difficulty, count, color, darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-750" : "bg-gray-50"
      } rounded-xl p-6 text-center`}>
      <div
        className={`text-4xl font-bold ${color} bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
        {count}
      </div>
      <div className="font-bold text-lg">{difficulty}</div>
      <div className="text-sm text-gray-500">problems solved</div>
    </div>
  );
};

const TopicProgress = ({ topic, darkMode }) => {
  const total = topic.count;
  const percentage = Math.min((total / 20) * 100, 100);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{topic.name}</span>
        <span className="text-sm text-gray-500">
          {topic.count} solved • {topic.points} points
        </span>
      </div>
      <div
        className={`w-full h-2 ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full overflow-hidden`}>
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          🟢 {topic.easy} 🟡 {topic.medium} 🔴 {topic.hard}
        </span>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, darkMode }) => {
  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "text-green-500";
    if (difficulty === "Medium") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-750" : "bg-gray-50"
      } rounded-lg p-4 flex items-center justify-between`}>
      <div className="flex-1">
        <div className="font-medium">{activity.title}</div>
        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
          <span>{activity.topic}</span>
          <span className={getDifficultyColor(activity.difficulty)}>
            {activity.difficulty}
          </span>
          <span>
            {getLanguageIcon(activity.language)} {activity.language}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-yellow-500">+{activity.points}</div>
        <div className="text-xs text-gray-500">
          {new Date(activity.date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const getAvatarEmoji = (avatar) => {
  const avatarMap = {
    ninja: "🥷",
    robot: "🤖",
    wizard: "🧙",
    scientist: "👨‍🔬",
    astronaut: "👨‍🚀",
    artist: "👨‍🎨",
  };
  return avatarMap[avatar] || "👤";
};

const getLanguageIcon = (language) => {
  const icons = {
    javascript: "🟨",
    python: "🐍",
    cpp: "⚡",
    java: "☕",
    c: "🔧",
  };
  return icons[language?.toLowerCase()] || "💻";
};

export default ProfilePage;
