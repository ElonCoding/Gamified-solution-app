/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          400: "#a78bfa",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6"
        },
        neon: "#22d3ee",
        accent: {
          amber: "#f59e0b",
          rose: "#f43f5e",
          emerald: "#10b981",
          sky: "#0ea5e9"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.2), 0 20px 60px rgba(76,29,149,0.35)",
        "glow-sm": "0 0 12px rgba(124,58,237,0.3)",
        "glow-brand": "0 0 20px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.2)",
        "glow-neon": "0 0 20px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.15)"
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fire": "fire-flicker 0.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
