import React from "react";
import { Zap } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Zap className="w-6 h-6 text-purple-500" />
        </div>
      </div>
    </div>
  );
};
