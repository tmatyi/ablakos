import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "framer-motion",
      "recharts",
      "react-is",
      "d3-scale",
      "d3-array",
      "d3-format",
      "d3-interpolate",
      "d3-time",
      "d3-timer",
      "eventemitter3",
      "decimal.js-light",
    ],
  },
});
