/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const { textSizes } = require("design-system/typography");
const { colors } = require("design-system/tailwind/colors");

const MAX_CONTENT_WIDTH = 1140;
const MAX_HEADER_WIDTH = 1440;

module.exports = {
  content: ["./App.tsx", "../../packages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        screen: "100vw",
        "screen-xl": `${MAX_CONTENT_WIDTH}px`,
        "screen-2xl": `${MAX_HEADER_WIDTH}px`,
        "screen-3xl": "1680px",
      },
      colors: {
        ...colors,
      },
      fontFamily: {
        inter: "Inter-Regular",
        "inter-semibold": "Inter-SemiBold",
        "inter-bold": "Inter-Bold",
        sans: ["Inter-Regular", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-xs": textSizes["text-xs"],
        ".text-13": textSizes["text-13"],
        ".text-sm": textSizes["text-sm"],
        ".text-base": textSizes["text-base"],
        ".text-lg": {
          ...textSizes["text-lg"],
        },
        ".text-xl": textSizes["text-xl"],
        ".text-2xl": {
          ...textSizes["text-2xl"],
        },
        ".text-3xl": textSizes["text-3xl"],
        ".text-4xl": textSizes["text-4xl"],
      });
    }),
  ],
};
