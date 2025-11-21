import React from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { xpGrowthData } from "../../api/mockData";

const XPGrowthChart = ({ darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl`}>
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-purple-500" />
        <span>XP Growth Over Time</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={xpGrowthData}>
          <defs>
            <linearGradient id="xpGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "#374151" : "#e5e7eb"}
          />
          <XAxis dataKey="date" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
          <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#fff",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#xpGrowthGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default XPGrowthChart;
