/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Geist", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        accent: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, #6366f1, #a855f7)",
        "brand-gradient-reverse": "linear-gradient(to left, #6366f1, #a855f7)",
        "accent-gradient": "linear-gradient(to right, #a855f7, #ec4899)",
        "mesh-gradient-light":
          "radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%), radial-gradient(circle at 40% 40%, #ec4899 0%, transparent 50%)",
        "mesh-gradient-dark":
          "radial-gradient(circle at 20% 80%, #4c1d95 0%, transparent 50%), radial-gradient(circle at 80% 20%, #581c87 0%, transparent 50%), radial-gradient(circle at 40% 40%, #831843 0%, transparent 50%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
