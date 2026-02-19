import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { prepareChartData } from "../utils/chartData";

// Custom tooltip for dark mode support
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value > 0 ? "+" : ""}
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GameChart = ({ rounds, players }) => {
  const { data, players: playerConfigs } = prepareChartData(rounds, players);

  // Check if we have data to display
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-300">
          Score Progression
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            No rounds played yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 transition-colors duration-300">
            Chart will appear after the first round
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        Score Progression
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            className="dark:stroke-gray-600"
          />
          <XAxis
            dataKey="round"
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
            tickLine={{ stroke: "#9ca3af" }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
            tickLine={{ stroke: "#9ca3af" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
            iconType="line"
          />

          {/* Danger zone reference lines */}
          <ReferenceLine
            y={100}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "Danger Zone (+100)",
              position: "right",
              fill: "#ef4444",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            y={-100}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "Danger Zone (-100)",
              position: "right",
              fill: "#ef4444",
              fontSize: 12,
            }}
          />

          {/* Player lines */}
          {playerConfigs.map((player) => (
            <Line
              key={player.id}
              type="monotone"
              dataKey={player.id}
              stroke={player.color}
              strokeWidth={2}
              dot={{ fill: player.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name={player.name}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 border-t-2 border-red-500"
              style={{ borderTopStyle: "dashed" }}
            ></div>
            <span>Danger Zones (±100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Player Scores</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameChart;
