import React from "react";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { monthlyEventsData } from "../../api/mockData";

const EventParticipationChart = ({ darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl`}>
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <span>Monthly Event Participation</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyEventsData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "#374151" : "#e5e7eb"}
          />
          <XAxis dataKey="month" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
          <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#fff",
              border: "none",
              borderRadius: "12px",
            }}
          />
          <Bar
            dataKey="events"
            fill="url(#eventsGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventParticipationChart;
