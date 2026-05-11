/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core surfaces
        surface: {
          DEFAULT: "#0C0C10",
          1: "#111116",
          2: "#18181F",
          3: "#1E1E27",
          4: "#252530",
        },
        // Text
        ink: {
          DEFAULT: "#E8E6E1",
          muted: "#9A9891",
          faint: "#5A5856",
        },
        // Accent — warm amber, not orange/neon
        accent: {
          DEFAULT: "#C9A96E",
          dim: "#8A6E3E",
          glow: "rgba(201, 169, 110, 0.15)",
        },
        // Status
        verified: "#4E9E6E",
        danger: "#C25B4E",
        pending: "#8A7E55",
        border: "rgba(255,255,255,0.07)",
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grain": "url('/grain.png')",
        "mesh": "radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(78,158,110,0.04) 0%, transparent 50%)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};