import React, { useState } from "react";
import { X, Save, User, MapPin, FileText, Camera } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { avatarEmojis } from "../../utils/constants";

const EditProfileModal = ({ darkMode, onClose }) => {
  // ⭐ CHANGED: Get updateProfile from useAuth
  const { user, updateProfile } = useAuth();

  // Initialize form with current user data
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    avatar: user?.avatar || "ninja",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "ninja");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatarKey) => {
    setSelectedAvatar(avatarKey);
    setFormData((prev) => ({
      ...prev,
      avatar: avatarKey,
    }));
  };

  // ⭐ CHANGED: Handle form submission with database update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (formData.bio.trim().length > 200) {
      setError("Bio must be less than 200 characters");
      return;
    }

    setSaving(true);

    try {
      // ⭐ CHANGED: Call updateProfile from AuthContext
      const result = await updateProfile(formData);

      if (result.success) {
        console.log("✅ Profile updated in database:", result.user);
        setSuccess(true);

        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  // Available avatars
  const availableAvatars = Object.keys(avatarEmojis);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in`}>
        {/* Header */}
        <div
          className={`sticky top-0 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } p-6 flex items-center justify-between z-10`}>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg animate-fade-in">
            <p className="text-green-600 dark:text-green-400 font-medium flex items-center space-x-2">
              <span>✓</span>
              <span>Profile saved successfully!</span>
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg animate-fade-in">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Choose Avatar</span>
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
              {availableAvatars.map((avatarKey) => (
                <button
                  key={avatarKey}
                  type="button"
                  onClick={() => handleAvatarSelect(avatarKey)}
                  className={`p-3 rounded-xl text-center transition-all transform hover:scale-110 ${
                    selectedAvatar === avatarKey
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 scale-110 shadow-lg"
                      : darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}>
                  <div className="text-3xl">{avatarEmojis[avatarKey]}</div>
                </button>
              ))}
            </div>
            <p
              className={`text-xs mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              Selected:{" "}
              <span className="font-medium capitalize">{selectedAvatar}</span>
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Username</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                  : "bg-white border-gray-300 focus:border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all`}
              placeholder="Enter your username"
              required
              minLength={3}
              maxLength={30}
            />
            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              {formData.username.length}/30 characters
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Bio</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                  : "bg-white border-gray-300 focus:border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all resize-none`}
              placeholder="Tell us about yourself..."
              maxLength={200}
            />
            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              {formData.bio.length}/200 characters
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                  : "bg-white border-gray-300 focus:border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all`}
              placeholder="Where are you based?"
              maxLength={50}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              } disabled:opacity-50 disabled:cursor-not-allowed`}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || success}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving</span>
                </>
              ) : success ? (
                <>
                  <span>✓ Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
