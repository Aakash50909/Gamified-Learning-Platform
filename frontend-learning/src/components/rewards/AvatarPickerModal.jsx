import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { avatarEmojis } from "../../api/mockData";

const AvatarPickerModal = ({
  currentAvatar,
  availableAvatars,
  onSelect,
  onClose,
  darkMode,
}) => {
  const [selecting, setSelecting] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleSelect = async (avatar) => {
    setSelecting(true);
    try {
      await onSelect(avatar);
      setSelectedAvatar(avatar);
      setTimeout(onClose, 1000);
    } catch (err) {
      console.error("Failed to select avatar:", err);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Choose Your Avatar</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {availableAvatars.map((avatar) => (
            <button
              key={avatar}
              onClick={() => handleSelect(avatar)}
              disabled={selecting}
              className={`p-6 rounded-xl text-center transition-all ${
                selectedAvatar === avatar
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 scale-110"
                  : darkMode
                  ? "bg-gray-750 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${selecting ? "opacity-50" : ""}`}>
              <div className="text-5xl mb-2">{avatarEmojis[avatar]}</div>
              <div
                className={`text-sm font-medium capitalize ${
                  selectedAvatar === avatar ? "text-white" : ""
                }`}>
                {avatar}
              </div>
              {selectedAvatar === avatar && (
                <div className="mt-2">
                  <Check className="w-5 h-5 text-white mx-auto" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarPickerModal;
