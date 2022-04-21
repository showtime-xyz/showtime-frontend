import { Platform } from "react-native";

import { makeTheme } from "dripsy";

import { fontFamily, textSizes } from "design-system/typography";

const webFont = (font: string) => {
  return Platform.select({
    web: `"${fontFamily(
      font
    )}", Arial, Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    default: font,
  });
};

const theme = makeTheme({
  space: [],
  fontSizes: [],
  fonts: {
    root: "Inter",
    inter: "Inter",
  },
  customFonts: {
    Inter: {
      // 100: webFont('Inter-Thin'),
      // 200: webFont('Inter-ExtraLight'),
      // 300: webFont('Inter-Light'),
      default: webFont("Inter-Regular"),
      normal: webFont("Inter-Regular"),
      regular: webFont("Inter-Regular"),
      400: webFont("Inter-Regular"),
      semibold: webFont("Inter-SemiBold"),
      500: webFont("Inter-SemiBold"),
      bold: webFont("Inter-Bold"),
      600: webFont("Inter-SemiBold"),
      700: webFont("Inter-Bold"),
      // 800: webFont('Inter-ExtraBold'),
      // 900: webFont('Inter-Black'),
    },
    SpaceGrotesk: {
      default: webFont("SpaceGrotesk-Regular"),
      bold: webFont("SpaceGrotesk-Bold"),
      700: webFont("SpaceGrotesk-Bold"),
    },
  },
  text: {
    "text-xs": {
      fontWeight: "default",
      ...textSizes["text-xs"],
    },
    "text-13": {
      fontWeight: "default",
      ...textSizes["text-13"],
    },
    "text-sm": {
      fontWeight: "default",
      ...textSizes["text-sm"],
    },
    // `body` is the default text variant in Dripsy
    body: {
      fontWeight: "default",
      ...textSizes["text-base"],
    },
    "text-base": {
      fontWeight: "default",
      ...textSizes["text-base"],
    },
    "text-lg": {
      fontFamily: "SpaceGrotesk",
      fontWeight: "bold",
      ...textSizes["text-lg"],
    },
    "text-xl": {
      fontWeight: "default",
      ...textSizes["text-xl"],
    },
    "text-2xl": {
      fontFamily: "SpaceGrotesk",
      fontWeight: "bold",
      ...textSizes["text-2xl"],
    },
    "text-3xl": {
      fontWeight: "default",
      ...textSizes["text-3xl"],
    },
    "text-4xl": {
      fontWeight: "default",
      ...textSizes["text-4xl"],
    },
  },
});

type MyTheme = typeof theme;

declare module "dripsy" {
  interface DripsyCustomTheme extends MyTheme {}
}

export { theme };
