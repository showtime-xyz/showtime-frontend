const { MAX_CONTENT_WIDTH, MAX_HEADER_WIDTH } = require("./layout");
const { colors } = require("./colors");

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
        ...colors,
      },
      cursor: {
        copy: "copy",
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
};
