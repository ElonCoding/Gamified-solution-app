/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#7c3aed",
          600: "#6d28d9"
        },
        neon: "#22d3ee"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.2), 0 20px 60px rgba(76,29,149,0.35)"
      }
    }
  },
  plugins: []
};

