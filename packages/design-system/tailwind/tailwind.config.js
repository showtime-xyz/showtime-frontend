const defaultTheme = require("tailwindcss/defaultTheme");

const { MAX_CONTENT_WIDTH, MAX_HEADER_WIDTH } = require("app/constants/layout");
const { colors } = require("design-system/tailwind/colors");
const { textSizes, fontFamily } = require("design-system/typography");
const { plugin } = require("twrnc");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
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
        stpink: "#e45cff",
        stlink: "rgb(81, 125, 228)",
        stgreen: "#6bd464",

        stred: "#ff5151",
        stblue: "#3A80F6",
        stpurple: "#a577ff",
        styellow: "#f3bf4b",
        stpink100: "rgba(228, 92, 255, 0.1)",
        stpurple100: "rgba(165, 119, 255, 0.1)",
        stgreen100: "rgba(107, 212, 100, 0.15)",
        stred100: "rgba(255, 81, 81, 0.1)",
        stblue100: "rgba(58, 128, 246, 0.1)",
        stgreen700: "#52a34d",
        stpurple700: "#946ce6",

        stteal: "#1dd4e0",
        stteal100: "rgba(29, 212, 224, 0.2)",
        stteal700: "#198c94",
        gray: colors.neutral,
        cyan: colors.cyan,
        yellow: colors.yellow,
        fuchsia: colors.fuchsia,
        violet: colors.violet,
        indigo: colors.indigo,
        rose: colors.rose,
        amber: colors.amber,
      },
      cursor: {
        copy: "copy",
      },
      fontSize: {},
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
    plugin(({ addUtilities }) => {
      addUtilities({
        "text-xs": textSizes["text-xs"],
        "text-13": textSizes["text-13"],
        "text-sm": textSizes["text-sm"],
        "text-base": textSizes["text-base"],
        "text-lg": textSizes["text-lg"],
        "text-xl": textSizes["text-xl"],
        "text-2xl": textSizes["text-2xl"],
        "text-3xl": textSizes["text-3xl"],
        "text-4xl": textSizes["text-4xl"],
      });
    }),
  ],
};
