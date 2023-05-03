/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const { colors } = require("design-system/tailwind/colors");
const { textSizes } = require("design-system/typography");

const MAX_CONTENT_WIDTH = 1140;
const MAX_HEADER_WIDTH = 1440;

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  important: "html",
  theme: {
    extend: {
      maxWidth: {
        "screen-3xl": "1680px",
        screen: "100vw",
        "screen-xl": `${MAX_CONTENT_WIDTH}px`,
        "screen-2xl": `${MAX_HEADER_WIDTH}px`,
        60: "240px",
      },
      boxShadow: {
        dark: "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 8px 16px rgba(255, 255, 255, 0.1)",
        light:
          "0px 2px 4px rgba(0, 0, 0, 0.05), 0px 4px 8px rgba(0, 0, 0, 0.05)",
        "lg-dark":
          "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 16px 48px rgba(255, 255, 255, 0.2)",
        "lg-light":
          "0px 12px 16px rgba(0, 0, 0, 0.1), 0px 16px 48px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        inherit: "inherit",
        "4xl": "32px",
        4: "16px",
      },
      colors: {
        black45: "rgba(0, 0, 0, 0.45)",
        inherit: "inherit",
        ...colors,
      },
      cursor: {
        copy: "copy",
      },
      fontFamily: {
        inter: "var(--font-inter)",
        "inter-semibold": "var(--font-inter)",
        "inter-bold": "var(--font-inter)",
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      whitespace: {
        "break-spaces": "break-spaces",
      },
      fill: {
        black: "black",
        white: "white",
      },
      zIndex: {
        1: 1,
        2: 2,
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(1)", opacity: 0 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "zoom-in": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        "bounce-in": "bounce-in 250ms",
        "fade-in": "fade-in 150ms",
        "fade-in-250": "fade-in 250ms",
        "fade-in-500": "fade-in 500ms",
        "zoom-in": "zoom-in 250ms",
      },
    },
  },
  plugins: [
    require("nativewind/tailwind/css"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-xs": textSizes["text-xs"],
        ".text-13": textSizes["text-13"],
        ".text-sm": textSizes["text-sm"],
        ".text-base": textSizes["text-base"],
        ".text-lg": {
          ...textSizes["text-lg"],
          fontWeight: "bold",
        },
        ".text-xl": textSizes["text-xl"],
        ".text-2xl": {
          ...textSizes["text-2xl"],
          fontWeight: "bold",
        },
        ".text-3xl": textSizes["text-3xl"],
        ".text-4xl": textSizes["text-4xl"],
        ".safe-top": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".safe-bottom": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
      });
    }),
  ],
};
