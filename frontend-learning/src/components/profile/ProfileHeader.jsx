import React from "react";
import { Camera, Edit2, Mail, MapPin, Calendar } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userData } from "../../api/mockData";
import { avatarEmojis } from "../../utils/constants";

const ProfileHeader = ({ darkMode, setShowEditProfile }) => {
  const { user } = useAuth();

  const currentUser = user || userData;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 sm:p-8 shadow-xl`}>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="text-6xl sm:text-8xl">
            {avatarEmojis[currentUser.avatar] || "👤"}
          </div>
          <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform">
            <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold break-words">
                {currentUser.username}
              </h1>
              <p className="text-purple-500 font-medium">{currentUser.title}</p>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto">
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mb-4 text-sm sm:text-base`}>
            {currentUser.bio}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm justify-center md:justify-start">
            <div className="flex items-center space-x-2">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
              <span className="break-all">{currentUser.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
              <span>{currentUser.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
              <span>Joined {currentUser.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
