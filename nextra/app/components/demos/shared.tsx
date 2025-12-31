import React from "react";

// ===================================
// Theme Colors
// ===================================
export const THEME = {
  blue: "#007aff",
  green: "#34c759",
  red: "#ff3b30",
  yellow: "#ffd60a",
  purple: "#5e5ce6",
  dark: "#0a0a0f",
  surface: "#12121a",
  surfaceLight: "#1a1a25",
  border: "#2a2a3a",
  text: "#e0e0e8",
  textMuted: "#8888a0",
};

// ===================================
// Shared Components
// ===================================

const colorMap: Record<string, string> = {
  gray: "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
  blue: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 border border-blue-200 dark:border-blue-500/30",
  green:
    "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 border border-green-200 dark:border-green-500/30",
  red: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 border border-red-200 dark:border-red-500/30",
  yellow:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:hover:bg-yellow-500/30 border border-yellow-200 dark:border-yellow-500/30",
  purple:
    "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/30 border border-purple-200 dark:border-purple-500/30",
};

// Helper for hex colors passed from THEME
const getColorClass = (colorProp: string) => {
  if (colorProp === THEME.blue) return colorMap.blue;
  if (colorProp === THEME.green) return colorMap.green;
  if (colorProp === THEME.red) return colorMap.red;
  if (colorProp === THEME.yellow) return colorMap.yellow;
  if (colorProp === THEME.purple) return colorMap.purple;
  if (colorProp === "gray") return colorMap.gray;
  // Fallback for custom hex
  return colorMap.gray;
};

export const Btn = ({
  onClick,
  children,
  color = "gray",
  small = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
  small?: boolean;
}) => {
  const colorClass = getColorClass(color);
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 ${
        small ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-xs"
      } rounded-md font-medium transition-all hover:scale-105 active:scale-95 ${colorClass}`}
    >
      {children}
    </button>
  );
};

export const StatusRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => {
  // We can try to map the hex color to a tailwind text class for better adaptation,
  // or just use the hex color style but ensure the label is adaptive.
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono font-medium" style={{ color }}>
        {value}
      </span>
    </div>
  );
};

export const ActionFeedback = ({
  message,
  color,
}: {
  message: string | null;
  color: string;
}) =>
  message ? (
    <div
      className="mt-2 p-2 rounded text-xs font-medium border"
      style={{
        backgroundColor: `${color}15`, // 15 = ~8% opacity
        color: color,
        borderColor: `${color}30`,
      }}
    >
      {message}
    </div>
  ) : null;
