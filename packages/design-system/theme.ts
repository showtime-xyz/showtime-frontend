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
