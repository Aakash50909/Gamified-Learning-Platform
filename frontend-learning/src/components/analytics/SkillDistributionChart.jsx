import React from "react";
import { Target } from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { skillDistributionData } from "../../api/mockData";

const SkillDistributionChart = ({ darkMode }) => {
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl p-6 shadow-xl`}>
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <Target className="w-5 h-5 text-pink-500" />
        <span>Skill Distribution</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPie>
          <Pie
            data={skillDistributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value">
            {skillDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#fff",
              border: "none",
              borderRadius: "12px",
            }}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillDistributionChart;
