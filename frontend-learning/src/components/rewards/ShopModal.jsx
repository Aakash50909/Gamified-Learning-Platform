import React, { useState } from "react";
import { X } from "lucide-react";
import { avatarEmojis } from "../../utils/constants"; // ✅ Changed from mockData

const ShopItemCard = ({
  item,
  coins,
  purchasing,
  onPurchase,
  darkMode,
  icon,
}) => {
  const canAfford = coins >= item.price;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-750" : "bg-gray-50"
      } rounded-xl p-4 text-center`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h4 className="font-bold mb-1">{item.name}</h4>
      <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-3">
        <span className="text-lg">🪙</span>
        <span className="font-bold">{item.price}</span>
      </div>
      {item.unlocked ? (
        <div className="text-green-500 text-sm font-medium">Owned</div>
      ) : (
        <button
          onClick={onPurchase}
          disabled={!canAfford || purchasing}
          className={`w-full py-2 rounded-lg font-bold transition-all ${
            canAfford
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } ${purchasing ? "opacity-50" : ""}`}>
          {purchasing
            ? "Buying..."
            : canAfford
            ? "Buy Now"
            : "Not Enough Coins"}
        </button>
      )}
    </div>
  );
};

const ShopModal = ({ coins, shop, onPurchase, onClose, darkMode }) => {
  const [purchasing, setPurchasing] = useState(null);

  const handlePurchase = async (itemId, price) => {
    setPurchasing(itemId);
    try {
      const result = await onPurchase(itemId, price);
      if (result.success) {
        alert("Purchase successful!");
      } else {
        alert(result.error || "Purchase failed");
      }
    } catch (err) {
      alert("Failed to purchase item");
    } finally {
      setPurchasing(null);
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
        } rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Rewards Shop</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <span className="text-2xl">🪙</span>
              <span className="font-bold text-white">{coins}</span>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Premium Avatars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shop.avatars.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  coins={coins}
                  purchasing={purchasing === item.id}
                  onPurchase={() => handlePurchase(item.id, item.price)}
                  darkMode={darkMode}
                  icon={avatarEmojis[item.id] || "🎭"}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Themes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shop.themes.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  coins={coins}
                  purchasing={purchasing === item.id}
                  onPurchase={() => handlePurchase(item.id, item.price)}
                  darkMode={darkMode}
                  icon="🎨"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
