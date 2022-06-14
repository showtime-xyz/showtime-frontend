const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const { textSizes, fontFamily } = require("@showtime-xyz/universal.typography");
const { colors } = require("@showtime-xyz/universal.tailwind/colors");
const {
  MAX_CONTENT_WIDTH,
  MAX_HEADER_WIDTH,
} = require("@showtime-xyz/universal.tailwind/layout");

module.exports = {
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
      },
      boxShadow: {
        dropdown:
          "0px 16px 48px 0px #0000001A, 0px 12px 16px 0px #0000001A, 0px 1px 3px 0px #0000000D",
        modal:
          "0px 16px 48px 0px #00000033, 0px 12px 16px 0px #00000066, 0px 0px 2px 0px #FFFFFF80",
      },
      borderRadius: {
        inherit: "inherit",
      },
      colors: {
        inherit: "inherit",
        ...colors,
      },
      cursor: {
        copy: "copy",
      },
      fontFamily: {
        space: fontFamily("SpaceGrotesk-Regular"),
        "space-bold": fontFamily("SpaceGrotesk-Bold"),
        inter: fontFamily("Inter-Regular"),
        "inter-semibold": fontFamily("Inter-SemiBold"),
        "inter-bold": fontFamily("Inter-Bold"),
        sans: [fontFamily("Inter-Regular"), ...defaultTheme.fontFamily.sans],
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
    },
  },
  plugins: [
    require("tailwindcss-react-native/plugin"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-xs": textSizes["text-xs"],
        ".text-13": textSizes["text-13"],
        ".text-sm": textSizes["text-sm"],
        ".text-base": textSizes["text-base"],
        ".text-lg": {
          ...textSizes["text-lg"],
          fontFamily: fontFamily("SpaceGrotesk-Bold"),
        },
        ".text-xl": textSizes["text-xl"],
        ".text-2xl": {
          ...textSizes["text-2xl"],
          fontFamily: fontFamily("SpaceGrotesk-Bold"),
        },
        ".text-3xl": textSizes["text-3xl"],
        ".text-4xl": textSizes["text-4xl"],
      });
    }),
  ],
};
