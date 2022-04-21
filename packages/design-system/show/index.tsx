import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import {
  breakpoints,
  IBreakpoints,
  sortedBreakpointKeys,
} from "design-system/theme";

type ShowProps = {
  from?: IBreakpoints;
  platform?: "web" | "android" | "ios" | "native";
  children: any;
};

export const Show = (props: ShowProps) => {
  const { width } = useWindowDimensions();
  const { from, platform, children } = props;
  const currentBreakpoint = useMemo(
    () => sortedBreakpointKeys.find((key) => width >= breakpoints[key]),
    [width]
  );

  if (platform && !Platform.select({ default: false, [platform]: true })) {
    return null;
  }

  if (
    currentBreakpoint &&
    from &&
    breakpoints[from] > breakpoints[currentBreakpoint]
  ) {
    return null;
  }

  return children;
};

export const Hide = (props: ShowProps) => {
  const { width } = useWindowDimensions();
  const { from, platform, children } = props;
  const currentBreakpoint = useMemo(
    () => sortedBreakpointKeys.find((key) => width >= breakpoints[key]),
    [width]
  );

  if (platform && Platform.select({ default: false, [platform]: true })) {
    return null;
  }

  if (
    currentBreakpoint &&
    from &&
    breakpoints[from] <= breakpoints[currentBreakpoint]
  ) {
    return null;
  }

  return children;
};
