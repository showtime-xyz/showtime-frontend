import { useMemo, memo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { View } from "design-system";
import { tw } from "design-system/tailwind";
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
  unmount?: boolean;
};

export const Hidden = memo((props: HiddenProps) => {
  const { width } = useWindowDimensions();
  const { from, platform, until, children, unmount } = props;
  const currentBreakpoint = useMemo(
    () => sortedBreakpointKeys.find((key) => width >= breakpoints[key]),
    [width]
  );

  // Hide if no props are passed
  if (!from && !until && !platform) {
    return null;
  }

  if (platform && Platform.select({ default: false, [platform]: true })) {
    return null;
  }

  let twValue: string = "";

  if (currentBreakpoint) {
    if (from && until) {
      if (
        breakpoints[currentBreakpoint] >= breakpoints[from] &&
        breakpoints[currentBreakpoint] < breakpoints[until]
      ) {
        if (unmount) {
          return null;
        }
        twValue = `flex ${from}:hidden ${until}:flex`;
      }
    } else if (from && breakpoints[currentBreakpoint] >= breakpoints[from]) {
      if (unmount) {
        return null;
      }
      twValue = `flex ${from}:hidden`;
    } else if (until && breakpoints[currentBreakpoint] < breakpoints[until]) {
      if (unmount) {
        return null;
      }
      twValue = `hidden ${until}:flex`;
    }
  }

  return !twValue ? (
    children
  ) : (
    <View style={tw.style(twValue)}>{children}</View>
  );
});
