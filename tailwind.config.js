/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FCFCFA",
          secondary: "#F5F5F0",
        },
        ink: {
          DEFAULT: "#1A1A18",
          secondary: "#3A3A35",
          body: "#555550",
          muted: "#777770",
          faint: "#9C9C94",
        },
        amber: {
          DEFAULT: "#C47D1E",
          glow: "#D98A28",
          wash: "rgba(196, 125, 30, 0.12)",
        },
        border: {
          subtle: "#E5E5E0",
          spine: "#D1D1CB",
        },
        emerald: {
          DEFAULT: "#10B981",
        },
        violation: {
          DEFAULT: "#DC2626",
        },
      },
      fontFamily: {
        serif: [
          "Instrument Serif",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        mono: [
          "JetBrains Mono",
          "Cascadia Code",
          "Fira Code",
          "ui-monospace",
          "monospace",
        ],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      fontSize: {
        hero: ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        section: ["clamp(2rem, 4vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        milestone: ["clamp(1.5rem, 2.5vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.15em" }],
        tag: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        metric: ["1.5rem", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        sm: "2px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
        shutter: "cubic-bezier(0.7, 0, 0.3, 1)",
      },
      keyframes: {
        "pulse-emerald": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "pulse-emerald": "pulse-emerald 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
