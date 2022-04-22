import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import {
  breakpoints,
  IBreakpoints,
  sortedBreakpointKeys,
} from "design-system/theme";

type HiddenProps = {
  from?: IBreakpoints;
  till?: IBreakpoints;
  platform?: "web" | "android" | "ios" | "native";
  children: any;
};

export const Hidden = (props: HiddenProps) => {
  const { width } = useWindowDimensions();
  const { from, platform, till, children } = props;
  const currentBreakpoint = useMemo(
    () => sortedBreakpointKeys.find((key) => width >= breakpoints[key]),
    [width]
  );

  // Hide if no props are passed
  if (!from && !till && !platform) {
    return null;
  }

  if (platform && Platform.select({ default: false, [platform]: true })) {
    return null;
  }

  if (currentBreakpoint) {
    if (from && till) {
      if (
        breakpoints[currentBreakpoint] >= breakpoints[from] &&
        breakpoints[currentBreakpoint] < breakpoints[till]
      ) {
        return null;
      }
    } else if (from && breakpoints[currentBreakpoint] >= breakpoints[from]) {
      return null;
    } else if (till && breakpoints[currentBreakpoint] < breakpoints[till]) {
      return null;
    }
  }

  return children;
};
