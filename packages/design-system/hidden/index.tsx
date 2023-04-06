import { useMemo, useState, useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";

import {
  breakpoints,
  IBreakpoints,
  sortedBreakpointKeys,
} from "design-system/theme";

type HiddenProps = {
  from?: IBreakpoints;
  until?: IBreakpoints;
  platform?: "web" | "android" | "ios" | "native";
  children: any;
};

export const Hidden = (props: HiddenProps) => {
  const { width } = useWindowDimensions();
  const [mounted, setMonted] = useState(false);
  const { from, platform, until, children } = props;

  const currentBreakpoint = useMemo(
    () => sortedBreakpointKeys.find((key) => width >= breakpoints[key]),
    [width]
  );
  useEffect(() => {
    setMonted(true);
  }, []);
  if (!mounted) return null;
  if (!from && !until && !platform) {
    return null;
  }

  if (platform && Platform.select({ default: false, [platform]: true })) {
    return null;
  }

  if (currentBreakpoint) {
    if (from && until) {
      if (
        breakpoints[currentBreakpoint] >= breakpoints[from] &&
        breakpoints[currentBreakpoint] < breakpoints[until]
      ) {
        return null;
      }
    } else if (from && breakpoints[currentBreakpoint] >= breakpoints[from]) {
      return null;
    } else if (until && breakpoints[currentBreakpoint] < breakpoints[until]) {
      return null;
    }
  }

  return children;
};
