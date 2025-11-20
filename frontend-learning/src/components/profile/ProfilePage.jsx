import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import QuickStats from "./QuickStats";
import AchievementGrid from "./AchievementGrid";
import ActivityTimeline from "./ActivityTimeline";
import EditProfileModal from "./EditProfileModal";

const ProfilePage = ({ darkMode }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <ProfileHeader
        darkMode={darkMode}
        setShowEditProfile={setShowEditProfile}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AchievementGrid darkMode={darkMode} />
          <ActivityTimeline darkMode={darkMode} />
        </div>
        <div>
          <QuickStats darkMode={darkMode} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          darkMode={darkMode}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
