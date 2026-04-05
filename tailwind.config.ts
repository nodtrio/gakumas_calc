import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2937",
        accent: "#0f766e",
        paper: "#f7f5ef",
        warm: "#e7dcc8",
      },
      fontFamily: {
        sans: ["Pretendard", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
