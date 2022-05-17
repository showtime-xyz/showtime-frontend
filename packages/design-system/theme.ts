import { Platform } from "react-native";

export const breakpoints = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type IBreakpoints = keyof typeof breakpoints;

export const sortedBreakpointKeys = Object.keys(breakpoints).sort((a, b) =>
  //@ts-ignore
  breakpoints[a] > breakpoints[b] ? -1 : 1
) as Array<IBreakpoints>;

export const CARD_DARK_SHADOW =
  Platform.OS === "web"
    ? "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 8px 16px rgba(255, 255, 255, 0.1)"
    : undefined;
